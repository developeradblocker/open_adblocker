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
import { ConfigService } from '@/modules/config/internal/service/config.service'
import { ConfigStorageInterface, ApiConfig, StoredConfig } from '@/modules/config/internal/config.types'
import { LoggerInterface } from '@/utils/logger/logger.types'
import { CONFIG_ALARM } from '@/modules/config/common/config.constants'
import { dayToMs } from '@/helpers/time/day-to-ms'

describe('ConfigService', () => {
  let service: ConfigService
  let storageMock: ConfigStorageInterface
  let loggerMock: LoggerInterface
  const mockUrl = 'https://test-api.com'
  const intervalDays = 7

  const getAlarmMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    storageMock = {
      get: jest.fn(),
      set: jest.fn()
    }

    loggerMock = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn()
    } as unknown as LoggerInterface

    global.chrome = {
      alarms: {
        create: jest.fn(),
        get: getAlarmMock
      }
    } as any

    global.fetch = jest.fn()

    service = new ConfigService(storageMock, mockUrl, intervalDays, loggerMock)
  })

  describe('get', () => {
    it('should return config from storage', async () => {
      const mockConfig = { rateUsReminderDays: 5 }
      const mockStoredConfig: StoredConfig = {
        config: mockConfig,
        updated: 1234567890
      }
      jest.mocked(storageMock.get).mockResolvedValueOnce(mockStoredConfig)

      const result = await service.get()

      expect(result).toEqual(mockConfig)
      expect(storageMock.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('update', () => {
    it('should fetch and update config when update is needed', async () => {
      const oldTimestamp = Date.now() - dayToMs(8)
      const mockStoredConfig: StoredConfig = {
        config: { rateUsReminderDays: 5 },
        updated: oldTimestamp
      }
      const mockApiConfig: ApiConfig = {
        config: { rateUsReminderDays: 10 }
      }

      jest.mocked(storageMock.get).mockResolvedValueOnce(mockStoredConfig)
      jest.mocked(global.fetch).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockApiConfig)
      } as any)

      await service.update()

      expect(fetch).toHaveBeenCalledWith(`${mockUrl}/rest/v3/configs/extensions/open-ad-blocker`)
      expect(storageMock.set).toHaveBeenCalledWith(mockApiConfig)
      expect(chrome.alarms.create).toHaveBeenCalledWith(CONFIG_ALARM, { periodInMinutes: 10080 }) // 7 days in minutes
    })

    it('should not update config when update is not needed', async () => {
      const recentTimestamp = Date.now() - dayToMs(2)
      const mockStoredConfig: StoredConfig = {
        config: { rateUsReminderDays: 5 },
        updated: recentTimestamp
      }

      jest.mocked(storageMock.get).mockResolvedValueOnce(mockStoredConfig)

      await service.update()

      expect(fetch).not.toHaveBeenCalled()
      expect(storageMock.set).not.toHaveBeenCalled()
    })

    it('should update config when updated timestamp is null', async () => {
      const mockStoredConfig: StoredConfig = {
        config: { rateUsReminderDays: 5 },
        updated: null
      }
      const mockApiConfig: ApiConfig = {
        config: { rateUsReminderDays: 10 }
      }

      jest.mocked(storageMock.get).mockResolvedValueOnce(mockStoredConfig)
      jest.mocked(global.fetch).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockApiConfig)
      } as any)

      await service.update()

      expect(fetch).toHaveBeenCalled()
      expect(storageMock.set).toHaveBeenCalledWith(mockApiConfig)
    })

    it('should not create alarm if it already exists', async () => {
      const oldTimestamp = Date.now() - dayToMs(8)
      const mockStoredConfig: StoredConfig = {
        config: { rateUsReminderDays: 5 },
        updated: oldTimestamp
      }
      const mockApiConfig: ApiConfig = {
        config: { rateUsReminderDays: 10 }
      }

      getAlarmMock.mockResolvedValue({ name: CONFIG_ALARM })
      jest.mocked(storageMock.get).mockResolvedValueOnce(mockStoredConfig)
      jest.mocked(global.fetch).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockApiConfig)
      } as any)

      await service.update()

      expect(chrome.alarms.create).not.toHaveBeenCalled()
    })

    it('should log error when fetch fails', async () => {
      const oldTimestamp = Date.now() - dayToMs(8)
      const mockStoredConfig: StoredConfig = {
        config: { rateUsReminderDays: 5 },
        updated: oldTimestamp
      }
      const mockError = new Error('Network error')

      jest.mocked(storageMock.get).mockResolvedValueOnce(mockStoredConfig)
      jest.mocked(global.fetch).mockRejectedValueOnce(mockError)

      await service.update()

      expect(loggerMock.error).toHaveBeenCalledWith('ConfigService: failed to update config:', mockError)
      expect(storageMock.set).not.toHaveBeenCalled()
    })
  })
})
