/**
 * @file
 * This file is part of Open Ad Blocker Browser Extension (https://github.com/developeradblocker/open_adblocker).
 *
 * Open Ad Blocker Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Open Ad Blocker Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Open Ad Blocker Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */

import { dispatcher } from '@/utils/setup-worker'
import { AdBlockerToggleListener } from './listeners/adblocker-toggle.listener'
import { InternalAdBlockerService } from '@/modules/ad-blocker/internal/services/ad-blocker.service'
import { InternalAdBlockerIdentifiers } from '@/modules/ad-blocker/internal/ad-blocker.types'
import { tsWebExtension } from '@/modules/aguard/internal/utils'
import {
  AdBlockerMessages,
  AdBlockerOnBlockedAd,
  AdBlockerOnReadyMessage
} from '@/modules/ad-blocker/common/ad-blocker.messages'
import {
  ApplyBasicRuleEvent,
  FilteringLogEvent
} from '@adguard/tswebextension/dist/types/lib/common/filtering-log'
import { TotalCounterService } from '@/modules/ad-blocker/internal/services/total-counter.service'
import { CounterByTabService } from '@/modules/ad-blocker/internal/services/counter-by-tab.service'
import { counterByTab, internalAdblocker, totalCounter } from '@/modules/ad-blocker/internal/utils'
import { HIDDEN_TAB_ID } from '@/common/constants'
import { Injection } from '@/utils/inject/inject.types'
import { inject } from '@/utils/inject/inject'
import { onAdGuardReady } from '@/modules/aguard/internal/expose.messages'
import { getFrameUrlHelper } from '@/helpers/get-frame.helper'
import { getDomainHelper } from '@/helpers/get-domain.helper'
import { makeAsyncQueue } from '@/utils/async-queue/async-queue'

const injections: Injection[] = [
  {
    key: InternalAdBlockerIdentifiers._counterByTab,
    use: CounterByTabService
  },
  {
    key: InternalAdBlockerIdentifiers._totalCounter,
    use: TotalCounterService
  },
  {
    key: InternalAdBlockerIdentifiers.adBlocker,
    use: InternalAdBlockerService
  }
]

/**
 * Sets up the internal ad blocker.
 * because it depends on AdGuard, it should be called after AdGuard is ready.
 */
export const setupInternalAdBlocker = (): void => {
  onAdGuardReady(handleOnAdGuardReady)
}

export const handleOnAdGuardReady = async (): Promise<void> => {
  inject(injections)
  dispatcher().onWithClass(AdBlockerToggleListener)
  setupDispatchingOnAdBlockedMessage()
  setupPerTabCounterReset()
  const message: AdBlockerOnReadyMessage = {
    type: AdBlockerMessages.ready,
    force: true
  }
  await dispatcher().sendMessage(message)
}

export const setupDispatchingOnAdBlockedMessage = (): void => {
  tsWebExtension()
    .onFilteringLogEvent
    .subscribe(makeHandleOnFilteringLogEvent())
}

/**
 * In-memory dedup of assuredly-blocked request URLs, scoped to the current
 * page load of each tab. Retry-happy sites (WebSocket reconnects, XHR polls,
 * prebid bidders, video ad SDKs) can produce thousands of real DNR blocks for
 * the exact same URL within a single visit. AdGuard's own UI collapses these
 * to a single entry; we do the same so the counter reflects unique blocked
 * resources on the current page rather than raw network events.
 *
 * The set is cleared whenever the per-tab counter is reset (top-frame
 * navigation, tab removal, or manual reset via the toggle listener).
 */
const seenBlockedUrlsByTab = new Map<number, Set<string>>()

const clearSeenBlockedUrls = (tabId: number): void => {
  seenBlockedUrlsByTab.delete(tabId)
}

/**
 * Reset the per-tab blocked-ads counter when the user navigates the top frame
 * to a new document, and clean up when the tab is closed. Without this the
 * counter accumulates across every page visited in the tab lifetime, which on
 * tracker-heavy sites (e.g. cnn.com) produces numbers that do not match what
 * AdGuard's own extension shows for the current page.
 */
export const setupPerTabCounterReset = (): void => {
  chrome.webNavigation.onCommitted.addListener(async ({ frameId, tabId }) => {
    // Only reset on top-frame navigations; subframes should not clear the badge.
    if (frameId !== 0 || tabId === HIDDEN_TAB_ID) {
      return
    }
    clearSeenBlockedUrls(tabId)
    await counterByTab().reset(tabId)
    const message: AdBlockerOnBlockedAd = {
      type: AdBlockerMessages.blockedAd
    }
    dispatcher().sendMessage(message)
  })

  chrome.tabs.onRemoved.addListener(async (tabId) => {
    clearSeenBlockedUrls(tabId)
    await counterByTab().reset(tabId)
  })
}

export const handleApplyBasicRule = async ({ data }: ApplyBasicRuleEvent): Promise<void> => {
  // In MV3, tswebextension publishes `ApplyBasicRule` twice per request:
  //  1. A speculative match from the JS engine during `webRequest.onBeforeRequest`
  //     (no `isAssuredlyBlocked` flag) - the request may or may not actually be
  //     blocked by the browser's declarativeNetRequest engine.
  //  2. A confirmed block from `webRequest.onErrorOccurred` with
  //     `error === 'net::ERR_BLOCKED_BY_CLIENT'` and `isAssuredlyBlocked: true`.
  // Only the confirmed events represent real blocks, so we skip the rest to
  // avoid inflating counters with speculative/observational matches, header-rule
  // matches, and other non-blocking rule applications.
  if (data.tabId === HIDDEN_TAB_ID ||
  data.isAllowlist ||
  data.filterId === null ||
  data.ruleIndex === null ||
  !data.isAssuredlyBlocked) {
    return
  }

  // Collapse retry storms of the same blocked URL within the current page
  // load so the counter reflects unique blocked resources, not raw events.
  const requestUrl = data.requestUrl
  if (typeof requestUrl === 'string' && requestUrl.length > 0) {
    let seen = seenBlockedUrlsByTab.get(data.tabId)
    if (!seen) {
      seen = new Set<string>()
      seenBlockedUrlsByTab.set(data.tabId, seen)
    }
    if (seen.has(requestUrl)) {
      return
    }
    seen.add(requestUrl)
  }

  const url = await getFrameUrlHelper(data.tabId)
  const isPaused = await internalAdblocker().isPaused(getDomainHelper(url))
  if (isPaused) {
    return
  }
  const promises = [
    totalCounter().increment(),
    counterByTab().increment(data.tabId)
  ]
  await Promise.allSettled(promises)
  const message: AdBlockerOnBlockedAd = {
    type: AdBlockerMessages.blockedAd
  }
  dispatcher().sendMessage(message)
}

export const makeHandleOnFilteringLogEvent = () => {
  const queue = makeAsyncQueue()
  return (data: FilteringLogEvent): void => {
    const listenEvents = {
      applyBasicRule: handleApplyBasicRule
    } as any

    if (!listenEvents[data.type]) {
      return
    }

    queue.enqueue(() => listenEvents[data.type](data))
  }
}
