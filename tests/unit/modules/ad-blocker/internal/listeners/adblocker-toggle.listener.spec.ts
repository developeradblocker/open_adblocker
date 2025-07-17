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
import { AdBlockerToggleListener } from '@/modules/ad-blocker/internal/listeners/adblocker-toggle.listener'
import { AdBlockerMessages, AdBlockerToggleMessage } from '@/modules/ad-blocker/common/ad-blocker.messages'
import { Box } from '@/utils/dispatcher/dispatcher.types'
import { CounterByTabInterface, InternalAdBlockerInterface } from '@/modules/ad-blocker/internal/ad-blocker.types'
import { getActiveTabHelper } from '@/helpers/get-active-tab.helper'
import { counterByTab } from '@/modules/ad-blocker/internal/utils'

jest.mock('@/modules/ad-blocker/internal/ad-blocker.setup', () => ({
  useInternalAdBlocker: jest.fn()
}))

jest.mock('@/helpers/get-active-tab.helper', () => ({
  getActiveTabHelper: jest.fn()
}))

jest.mock('@/modules/ad-blocker/internal/utils', () => ({
  counterByTab: jest.fn()
}))

describe('AdBlockerToggleListener', () => {
  let listener: AdBlockerToggleListener

  const tabId = 123
  const toggleMock = jest.fn()
  const resetMock = jest.fn()
  const adBlockerService = {
    toggle: toggleMock
  } as unknown as InternalAdBlockerInterface

  beforeEach(() => {
    jest.mocked(getActiveTabHelper).mockResolvedValue({ id: tabId } as chrome.tabs.Tab)
    jest.mocked(counterByTab).mockImplementation(() => ({ reset: resetMock }) as unknown as CounterByTabInterface)
    listener = new AdBlockerToggleListener(adBlockerService)
  })

  it('returns the correct message type on "on" method', () => {
    expect(listener.on()).toBe(AdBlockerMessages.toggle)
  })

  it('returns false on "main" method', () => {
    expect(listener.main()).toBe(false)
  })

  it('calls toggle with the correct payload when handle is invoked', async () => {
    global.chrome = {
      tabs: {
        reload: jest.fn()
      }
    } as any
    const message: AdBlockerToggleMessage = {
      type: AdBlockerMessages.toggle,
      payload: true
    }
    await listener.handle({ message } as Box<AdBlockerToggleMessage>)
    expect(toggleMock).toHaveBeenCalledWith(true)
    expect(global.chrome.tabs.reload).toHaveBeenCalledTimes(1)
    expect(resetMock).toHaveBeenCalledTimes(1)
    expect(resetMock).toHaveBeenCalledWith(tabId)
  })
})
