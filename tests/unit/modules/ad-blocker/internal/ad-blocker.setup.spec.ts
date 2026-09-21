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

import {
  handleApplyBasicRule,
  handleOnAdGuardReady,
  makeHandleOnFilteringLogEvent,
  setupDispatchingOnAdBlockedMessage,
  setupInternalAdBlocker,
  setupPerTabCounterReset
} from '@/modules/ad-blocker/internal/ad-blocker.setup'
import { inject } from '@/utils/inject/inject'
import { dispatcher } from '@/utils/setup-worker'
import { tsWebExtension } from '@/modules/aguard/internal/utils'
import { onAdGuardReady } from '@/modules/aguard/internal/expose.messages'
import { AdBlockerToggleListener } from '@/modules/ad-blocker/internal/listeners/adblocker-toggle.listener'
import { HIDDEN_TAB_ID } from '@/common/constants'
import { getFrameUrlHelper } from '@/helpers/get-frame.helper'
import { getDomainHelper } from '@/helpers/get-domain.helper'
import { counterByTab, internalAdblocker, totalCounter } from '@/modules/ad-blocker/internal/utils'
import { AdBlockerMessages } from '@/modules/ad-blocker/common/ad-blocker.messages'
import { flushPromises } from '../../../../helpers/flushPromises'

jest.mock('@/utils/inject/inject')
jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))
jest.mock('@/modules/aguard/internal/utils')
jest.mock('@/modules/aguard/internal/expose.messages')
jest.mock('@/modules/ad-blocker/internal/listeners/adblocker-toggle.listener')
jest.mock('@/helpers/get-frame.helper')
jest.mock('@/helpers/get-domain.helper')
jest.mock('@/modules/ad-blocker/internal/utils')

const mockedInject = jest.mocked(inject)
const mockedDispatcher = jest.mocked(dispatcher)
const mockedTsWebExtension = jest.mocked(tsWebExtension)
const mockedOnAdGuardReady = jest.mocked(onAdGuardReady)
const mockDispatcherInstance = {
  onWithClass: jest.fn(),
  sendMessage: jest.fn().mockResolvedValue(undefined)
}

const webNavigationOnCommittedAddListener = jest.fn()
const tabsOnRemovedAddListener = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  mockedDispatcher.mockReturnValue(mockDispatcherInstance as any)
  mockedTsWebExtension.mockReturnValue({
    onFilteringLogEvent: {
      subscribe: jest.fn()
    }
  } as any)
  global.chrome = {
    webNavigation: {
      onCommitted: {
        addListener: webNavigationOnCommittedAddListener
      }
    },
    tabs: {
      onRemoved: {
        addListener: tabsOnRemovedAddListener
      }
    }
  } as any
})

describe('setupInternalAdBlocker', () => {
  it('should register onAdGuardReady with handleOnAdGuardReady', () => {
    setupInternalAdBlocker()
    expect(mockedOnAdGuardReady).toHaveBeenCalledTimes(1)
    expect(mockedOnAdGuardReady).toHaveBeenCalledWith(handleOnAdGuardReady)
  })
})

describe('handleOnAdGuardReady', () => {
  it('should call inject, register listener and send ready message', async () => {
    await handleOnAdGuardReady()
    expect(mockedInject).toHaveBeenCalledTimes(1)
    expect(mockedDispatcher().onWithClass).toHaveBeenCalledWith(AdBlockerToggleListener)
    // setupDispatchingOnAdBlockedMessage should subscribe on tsWebExtension
    expect(mockedTsWebExtension).toHaveBeenCalledTimes(1)
    // Verify ready message sent
    expect(mockDispatcherInstance.sendMessage).toHaveBeenCalledWith({
      type: AdBlockerMessages.ready,
      force: true
    })
  })
})

describe('setupDispatchingOnAdBlockedMessage', () => {
  it('should subscribe onFilteringLogEvent with handleOnFilteringLogEvent', () => {
    const subscribeSpy = jest.fn()
    mockedTsWebExtension.mockReturnValue({
      onFilteringLogEvent: { subscribe: subscribeSpy }
    } as any)
    setupDispatchingOnAdBlockedMessage()
    expect(subscribeSpy).toHaveBeenCalledWith(expect.any(Function))
  })
})

describe('handleApplyBasicRule', () => {
  const dummyUrl = 'http://example.com'
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return immediately if tabId equals HIDDEN_TAB_ID', async () => {
    await handleApplyBasicRule({
      data: {
        tabId: HIDDEN_TAB_ID,
        filterId: null
      }
    } as any)
    expect(mockDispatcherInstance.sendMessage).not.toHaveBeenCalled()
  })

  it('should return if filter index is not null', async () => {
    await handleApplyBasicRule({
      data: {
        tabId: 1,
        filterId: 'some-filter',
        ruleIndex: null
      }
    } as any)
    expect(getFrameUrlHelper).not.toHaveBeenCalled()
  })

  it('should return if the event is not flagged as assuredly blocked', async () => {
    await handleApplyBasicRule({
      data: {
        tabId: 1,
        filterId: 2,
        ruleIndex: 3,
        isAllowlist: false
        // isAssuredlyBlocked omitted - speculative match only, must be ignored
      }
    } as any)
    expect(getFrameUrlHelper).not.toHaveBeenCalled()
    expect(mockDispatcherInstance.sendMessage).not.toHaveBeenCalled()
  })

  it('should return if internalAdblocker indicates paused', async () => {
    // Mock getFrameUrlHelper and getDomainHelper
    jest.mocked(getFrameUrlHelper).mockResolvedValue(dummyUrl)
    jest.mocked(getDomainHelper).mockReturnValue('example.com')
    jest.mocked(internalAdblocker).mockReturnValue({
      isPaused: jest.fn().mockResolvedValue(true)
    } as any)
    await handleApplyBasicRule({
      data: {
        tabId: 1,
        filterId: 2,
        ruleIndex: 3,
        isAllowlist: false,
        isAssuredlyBlocked: true
      }
    } as any)
    expect(internalAdblocker().isPaused).toHaveBeenCalledWith('example.com')
    expect(mockDispatcherInstance.sendMessage).not.toHaveBeenCalled()
  })

  it('should increment counters and send blockedAd message', async () => {
    jest.mocked(getFrameUrlHelper).mockResolvedValue(dummyUrl)
    jest.mocked(getDomainHelper).mockReturnValue('example.com')
    jest.mocked(internalAdblocker).mockReturnValue({
      isPaused: jest.fn().mockResolvedValue(false)
    } as any)
    const totalIncrement = jest.fn().mockResolvedValue(undefined)
    const tabIncrement = jest.fn().mockResolvedValue(undefined)
    jest.mocked(totalCounter).mockReturnValue({ increment: totalIncrement } as any)
    jest.mocked(counterByTab).mockReturnValue({ increment: tabIncrement } as any)
    await handleApplyBasicRule({
      data: {
        tabId: 1,
        filterId: 2,
        ruleIndex: 3,
        isAllowlist: false,
        isAssuredlyBlocked: true
      }
    } as any)
    expect(totalIncrement).toHaveBeenCalledTimes(1)
    expect(tabIncrement).toHaveBeenCalledWith(1)
    expect(mockDispatcherInstance.sendMessage).toHaveBeenCalledWith({
      type: AdBlockerMessages.blockedAd
    })
  })

  it('should dedupe repeated blocks of the same URL within a page load', async () => {
    jest.mocked(getFrameUrlHelper).mockResolvedValue(dummyUrl)
    jest.mocked(getDomainHelper).mockReturnValue('example.com')
    jest.mocked(internalAdblocker).mockReturnValue({
      isPaused: jest.fn().mockResolvedValue(false)
    } as any)
    const totalIncrement = jest.fn().mockResolvedValue(undefined)
    const tabIncrement = jest.fn().mockResolvedValue(undefined)
    jest.mocked(totalCounter).mockReturnValue({
      increment: totalIncrement
    } as any)
    jest.mocked(counterByTab).mockReturnValue({
      increment: tabIncrement,
      reset: jest.fn().mockResolvedValue(undefined)
    } as any)

    const event = {
      data: {
        tabId: 7,
        filterId: 2,
        ruleIndex: 3,
        isAllowlist: false,
        isAssuredlyBlocked: true,
        requestUrl: 'https://tracker.example/ping'
      }
    } as any

    // Simulate a retry storm: same URL fires many times
    await handleApplyBasicRule(event)
    await handleApplyBasicRule(event)
    await handleApplyBasicRule(event)

    expect(totalIncrement).toHaveBeenCalledTimes(1)
    expect(tabIncrement).toHaveBeenCalledTimes(1)

    // A different URL on the same tab still counts
    await handleApplyBasicRule({
      data: { ...event.data, requestUrl: 'https://tracker.example/other' }
    } as any)
    expect(totalIncrement).toHaveBeenCalledTimes(2)
    expect(tabIncrement).toHaveBeenCalledTimes(2)

    // After a top-frame navigation the dedup set is cleared and the same URL counts again
    setupPerTabCounterReset()
    const onCommitted = webNavigationOnCommittedAddListener.mock.calls[0][0]
    await onCommitted({ frameId: 0, tabId: 7 })
    await handleApplyBasicRule(event)
    expect(totalIncrement).toHaveBeenCalledTimes(3)
    expect(tabIncrement).toHaveBeenCalledTimes(3)
  })
})

describe('setupPerTabCounterReset', () => {
  it('registers listeners for top-frame navigation and tab removal', () => {
    setupPerTabCounterReset()
    expect(webNavigationOnCommittedAddListener).toHaveBeenCalledTimes(1)
    expect(tabsOnRemovedAddListener).toHaveBeenCalledTimes(1)
  })

  it('resets per-tab counter and notifies UI on top-frame navigation', async () => {
    const resetMock = jest.fn().mockResolvedValue(undefined)
    jest.mocked(counterByTab).mockReturnValue({ reset: resetMock } as any)
    setupPerTabCounterReset()
    const onCommitted = webNavigationOnCommittedAddListener.mock.calls[0][0]
    await onCommitted({ frameId: 0, tabId: 42 })
    expect(resetMock).toHaveBeenCalledWith(42)
    expect(mockDispatcherInstance.sendMessage).toHaveBeenCalledWith({
      type: AdBlockerMessages.blockedAd
    })
  })

  it('ignores sub-frame navigations', async () => {
    const resetMock = jest.fn().mockResolvedValue(undefined)
    jest.mocked(counterByTab).mockReturnValue({ reset: resetMock } as any)
    setupPerTabCounterReset()
    const onCommitted = webNavigationOnCommittedAddListener.mock.calls[0][0]
    await onCommitted({ frameId: 1, tabId: 42 })
    expect(resetMock).not.toHaveBeenCalled()
    expect(mockDispatcherInstance.sendMessage).not.toHaveBeenCalled()
  })

  it('resets per-tab counter when a tab is removed', async () => {
    const resetMock = jest.fn().mockResolvedValue(undefined)
    jest.mocked(counterByTab).mockReturnValue({ reset: resetMock } as any)
    setupPerTabCounterReset()
    const onRemoved = tabsOnRemovedAddListener.mock.calls[0][0]
    await onRemoved(99)
    expect(resetMock).toHaveBeenCalledWith(99)
  })
})

describe('handleOnFilteringLogEvent', () => {
  it('should do nothing if event type has no registered handler', () => {
    const data = { type: 'unknown' }
    expect(makeHandleOnFilteringLogEvent()(data as any)).toBeUndefined()
  })

  it('should call handleApplyBasicRule if event type is "applyBasicRule"', async () => {
    const applyBasicRuleSpy = jest.spyOn(
      require('@/modules/ad-blocker/internal/ad-blocker.setup'),
      'handleApplyBasicRule'
    ).mockImplementation(() => Promise.resolve())

    makeHandleOnFilteringLogEvent()({ type: 'applyBasicRule', data: {} } as any)
    await flushPromises()
    expect(applyBasicRuleSpy).toHaveBeenCalledWith({ type: 'applyBasicRule', data: {} })
    applyBasicRuleSpy.mockRestore()
  })
})
