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
import { FiltersStorage } from '@/modules/filters/internal/storage/filters.storage'
import { DataAccessorInterface } from '@/utils/storage/storage.types'
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'

jest.mock('@/utils/storage/make-data-accessor')

describe('FiltersStorage', () => {
  let storage: FiltersStorage
  let dataAccessorMock: DataAccessorInterface<unknown>

  beforeEach(() => {
    jest.clearAllMocks()
    dataAccessorMock = {
      read: jest.fn(),
      write: jest.fn()
    } as unknown as DataAccessorInterface<unknown>
    jest.mocked(makeDataAccessor).mockReturnValue(dataAccessorMock)
    storage = new FiltersStorage()
  })

  describe('enable', () => {
    it('should add filter to storage if not exists', async () => {
      jest.mocked(dataAccessorMock.read).mockResolvedValueOnce([12, 2])
      const enabledFilters = await storage.enable(13)

      expect(dataAccessorMock.write).toHaveBeenCalledWith([12, 2, 13])
      expect(enabledFilters).toEqual([12, 2, 13])
    })

    it('should NOT add filter to storage if it already exists', async () => {
      jest.mocked(dataAccessorMock.read).mockResolvedValueOnce([12, 2])
      const enabledFilters = await storage.enable(12)

      expect(dataAccessorMock.write).not.toHaveBeenCalled()
      expect(enabledFilters).toEqual([12, 2])
    })
  })

  describe('disable', () => {
    it('should remove filter from storage', async () => {
      jest.mocked(dataAccessorMock.read).mockResolvedValueOnce([12, 2])
        .mockResolvedValueOnce([2])

      expect(await storage.disable(12)).toEqual([2])
      expect(dataAccessorMock.write).toHaveBeenCalledWith([2])

      expect(await storage.disable(10)).toEqual([2])
      expect(dataAccessorMock.write).toHaveBeenCalledWith([2])
    })
  })

  describe('get', () => {
    it('should return stored items', async () => {
      jest.mocked(dataAccessorMock.read)
        .mockResolvedValueOnce([12, 2])

      expect(await storage.get()).toEqual([12, 2])
    })
  })
})
