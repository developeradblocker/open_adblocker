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
import { setupInternalConfig } from '@/modules/config/internal/config.setup'
import { inject } from '@/utils/inject/inject'
import { useInternalConfig } from '@/modules/config/internal/config.utils'
import { dispatcher } from '@/utils/setup-worker'
import { ConfigMessages } from '@/modules/config/common/config.messages'
import { CONFIG_ALARM } from '@/modules/config/common/config.constants'
import { InternalConfigIdentifiers } from '@/modules/config/internal/config.types'
import { ConfigService } from '@/modules/config/internal/service/config.service'
import { ConfigStorage } from '@/modules/config/internal/storage/config.storage'
import { flushPromises } from '../../../helpers/flushPromises'

jest.mock('@/utils/inject/inject', () => ({
  inject: jest.fn()
}))

jest.mock('@/modules/config/internal/config.utils', () => ({
  useInternalConfig: jest.fn()
}))

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))

describe('setupInternalConfig', () => {
  const mockUrl = 'https://test-api.com'
  const mockIntervalDays = 7
  let addListenerMock: jest.Mock
  let configServiceMock: { update: jest.Mock; get: jest.Mock }
  let dispatcherMock: { sendMessage: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()

    addListenerMock = jest.fn()
    global.chrome = {
      alarms: {
        onAlarm: {
          addListener: addListenerMock
        }
      }
    } as any

    configServiceMock = {
      update: jest.fn().mockResolvedValue(undefined),
      get: jest.fn()
    }

    dispatcherMock = {
      sendMessage: jest.fn().mockResolvedValue(undefined)
    }

    jest.mocked(useInternalConfig).mockReturnValue(configServiceMock as any)
    jest.mocked(dispatcher).mockReturnValue(dispatcherMock as any)
  })

  it('should inject dependencies with correct configuration', () => {
    setupInternalConfig(mockUrl, mockIntervalDays)

    expect(inject).toHaveBeenCalledTimes(1)
    const injections = jest.mocked(inject).mock.calls[0][0]

    expect(injections).toEqual([
      {
        key: InternalConfigIdentifiers.service,
        use: ConfigService
      },
      {
        key: InternalConfigIdentifiers._storage,
        use: ConfigStorage
      },
      {
        key: InternalConfigIdentifiers.url,
        use: mockUrl,
        value: true
      },
      {
        key: InternalConfigIdentifiers.intervalDays,
        use: mockIntervalDays,
        value: true
      }
    ])
  })

  it('should setup alarm listener', () => {
    setupInternalConfig(mockUrl, mockIntervalDays)

    expect(chrome.alarms.onAlarm.addListener).toHaveBeenCalledTimes(1)
    expect(typeof addListenerMock.mock.calls[0][0]).toBe('function')
  })

  it('should call update on alarm trigger with correct alarm name', async () => {
    setupInternalConfig(mockUrl, mockIntervalDays)

    const alarmListener = addListenerMock.mock.calls[0][0]
    await alarmListener({ name: CONFIG_ALARM })

    expect(configServiceMock.update).toHaveBeenCalledTimes(2) // Once in setup, once in alarm
  })

  it('should not call update on alarm trigger with different alarm name', async () => {
    setupInternalConfig(mockUrl, mockIntervalDays)

    const alarmListener = addListenerMock.mock.calls[0][0]

    // Clear the initial update call
    jest.clearAllMocks()

    await alarmListener({ name: 'DIFFERENT_ALARM' })

    expect(configServiceMock.update).not.toHaveBeenCalled()
  })

  it('should update config and send ready message on setup', async () => {
    setupInternalConfig(mockUrl, mockIntervalDays)

    // Wait for async operations
    await flushPromises()

    expect(configServiceMock.update).toHaveBeenCalledTimes(1)
    expect(dispatcherMock.sendMessage).toHaveBeenCalledWith({
      type: ConfigMessages.ready,
      force: true
    })
  })
})
