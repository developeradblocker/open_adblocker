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
  handleOnFilteringLogEvent,
  setupDispatchingOnAdBlockedMessage,
  setupInternalAdBlocker
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

beforeEach(() => {
  jest.clearAllMocks()
  mockedDispatcher.mockReturnValue(mockDispatcherInstance as any)
  mockedTsWebExtension.mockReturnValue({
    onFilteringLogEvent: {
      subscribe: jest.fn()
    }
  } as any)
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
    expect(subscribeSpy).toHaveBeenCalledWith(handleOnFilteringLogEvent)
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

  it('should return if filterId is not null', async () => {
    await handleApplyBasicRule({
      data: {
        tabId: 1,
        filterId: 'some-filter'
      }
    } as any)
    expect(getFrameUrlHelper).not.toHaveBeenCalled()
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
        filterId: null
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
        filterId: null
      }
    } as any)
    expect(totalIncrement).toHaveBeenCalledTimes(1)
    expect(tabIncrement).toHaveBeenCalledWith(1)
    expect(mockDispatcherInstance.sendMessage).toHaveBeenCalledWith({
      type: AdBlockerMessages.blockedAd
    })
  })
})

describe('handleOnFilteringLogEvent', () => {
  it('should do nothing if event type has no registered handler', () => {
    const data = { type: 'unknown' }
    expect(handleOnFilteringLogEvent(data as any)).toBeUndefined()
  })

  it('should call handleApplyBasicRule if event type is "applyBasicRule"', () => {
    const applyBasicRuleSpy = jest.spyOn(
      require('@/modules/ad-blocker/internal/ad-blocker.setup'),
      'handleApplyBasicRule'
    ).mockImplementation(() => Promise.resolve())

    handleOnFilteringLogEvent({ type: 'applyBasicRule', data: {} } as any)
    expect(applyBasicRuleSpy).toHaveBeenCalledWith({ type: 'applyBasicRule', data: {} })
    applyBasicRuleSpy.mockRestore()
  })
})
