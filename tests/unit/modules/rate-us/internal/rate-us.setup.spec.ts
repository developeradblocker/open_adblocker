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
import { setupInternalRateUs } from '@/modules/rate-us/internal/rate-us.setup'
import { inject } from '@/utils/inject/inject'
import { onUserActivity } from '@/modules/user-activity/internal/expose.messages'
import { jest } from '@jest/globals'
import { onConfigReady } from '@/modules/config/internal/expose.messages'
import { Box } from '@/utils/dispatcher/dispatcher.types'
import { ConfigOnReadyMessage } from '@/modules/config/common/config.messages'

jest.mock('@/utils/inject/inject', () => ({
  inject: jest.fn()
}))
jest.mock('@/modules/user-activity/internal/expose.messages', () => ({
  onUserActivity: jest.fn()
}))

jest.mock('@/modules/config/internal/expose.messages')

describe('setupInternalRateUs', () => {
  const addListenerMock = jest.fn()
  const addAlarmListenerMock = jest.fn()
  beforeEach(() => {
    global.chrome = {
      runtime: {
        onInstalled: {
          addListener: addListenerMock
        }
      },
      alarms: {
        onAlarm: {
          addListener: addAlarmListenerMock
        }
      }
    } as any
    jest.clearAllMocks()
  })

  it('should call inject with correct injections and register user activity handler', () => {
    setupInternalRateUs()
    const cb = jest.mocked(onConfigReady).mock.calls[0][0]
    cb({} as Box<ConfigOnReadyMessage>)
    expect(inject).toHaveBeenCalledTimes(1)
    expect(onUserActivity).toHaveBeenCalledTimes(1)
    // Check that onUserActivity was registered with a function
    const callback = (onUserActivity as jest.Mock).mock.calls[0][0]
    expect(typeof callback).toBe('function')
    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalledTimes(2)
    expect(chrome.alarms.onAlarm.addListener).toHaveBeenCalledTimes(1)
  })
})
