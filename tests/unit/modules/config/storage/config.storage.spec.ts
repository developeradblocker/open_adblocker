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
import { ConfigStorage } from '@/modules/config/internal/storage/config.storage'
import { DataAccessorInterface } from '@/utils/storage/storage.types'
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'
import { ApiConfig, StoredConfig } from '@/modules/config/internal/config.types'

jest.mock('@/utils/storage/make-data-accessor')

describe('ConfigStorage', () => {
  let storage: ConfigStorage
  let dataAccessorMock: DataAccessorInterface<StoredConfig>

  beforeEach(() => {
    jest.clearAllMocks()
    dataAccessorMock = {
      read: jest.fn(),
      write: jest.fn()
    } as unknown as DataAccessorInterface<StoredConfig>
    jest.mocked(makeDataAccessor).mockReturnValue(dataAccessorMock as any)
    storage = new ConfigStorage()
  })

  describe('get', () => {
    it('should return stored config', async () => {
      const mockStoredConfig: StoredConfig = {
        config: { rateUsReminderDays: 5 },
        updated: 1234567890
      }
      jest.mocked(dataAccessorMock.read).mockResolvedValueOnce(mockStoredConfig)

      const result = await storage.get()

      expect(result).toEqual(mockStoredConfig)
      expect(dataAccessorMock.read).toHaveBeenCalledTimes(1)
    })
  })

  describe('set', () => {
    it('should store config with current timestamp', async () => {
      const mockApiConfig: ApiConfig = {
        config: { rateUsReminderDays: 10 }
      }
      const mockTimestamp = 1234567890
      jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp)

      await storage.set(mockApiConfig)

      expect(dataAccessorMock.write).toHaveBeenCalledWith({
        config: mockApiConfig.config,
        updated: mockTimestamp
      })
      expect(dataAccessorMock.write).toHaveBeenCalledTimes(1)
    })
  })
})
