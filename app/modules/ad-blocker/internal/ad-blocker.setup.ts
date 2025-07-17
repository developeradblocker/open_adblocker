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
  const message: AdBlockerOnReadyMessage = {
    type: AdBlockerMessages.ready,
    force: true
  }
  await dispatcher().sendMessage(message)
}

export const setupDispatchingOnAdBlockedMessage = (): void => {
  tsWebExtension()
    .onFilteringLogEvent
    .subscribe(handleOnFilteringLogEvent)
}

export const handleApplyBasicRule = async ({ data }: ApplyBasicRuleEvent): Promise<void> => {
  if (data.tabId === HIDDEN_TAB_ID) {
    return
  }

  /**
   * AdGuard set null for applied filter
   */
  const isFilterApplied = data.filterId === null

  if (!isFilterApplied) {
    return
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
  await dispatcher().sendMessage(message)
}

export const handleOnFilteringLogEvent = (data: FilteringLogEvent): void => {
  const listenEvents = {
    applyBasicRule: handleApplyBasicRule
  } as any

  if (!listenEvents[data.type]) {
    return
  }

  listenEvents[data.type](data)
}
