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
import { FiltersService } from '@/modules/filters/internal/service/filters.service'
import { FiltersStorage } from '@/modules/filters/internal/storage/filters.storage'
import { dispatcher } from '@/utils/setup-worker'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'
import { FiltersMessages } from '@/modules/filters/common/filters.messages'
import { MetadataServiceInterface } from '@/modules/filters/internal/filters.types'

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))

describe('InternalFiltersService', () => {
  let service: FiltersService
  let sendMessageMock: jest.Mock

  const getFiltersMock = jest.fn()
  const mockStorage = {
    get: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    setup: jest.fn()
  } as unknown as FiltersStorage

  const metadata = {
    getFilters: getFiltersMock
  } as unknown as MetadataServiceInterface

  beforeEach(() => {
    jest.clearAllMocks()

    sendMessageMock = jest.fn()
    getFiltersMock.mockResolvedValue([{ filterId: 12 }, { filterId: 1 }])
    service = new FiltersService(mockStorage, metadata)
    jest.mocked(dispatcher).mockReturnValue(
      { sendMessage: sendMessageMock } as unknown as DispatcherInterface
    )
  })

  describe('isEnabled', () => {
    it('should return the result from filters.isEnabled', async () => {
      jest.mocked(mockStorage.get).mockResolvedValueOnce([12, 18, 10])
      jest.mocked(mockStorage.get).mockResolvedValueOnce([12, 18, 10])
      expect(await service.isEnabled(11)).toBeFalsy()
      expect(await service.isEnabled(18)).toBeTruthy()
    })
  })

  describe('toggle', () => {
    it('should enable filter and send message that filters updated', async () => {
      jest.mocked(mockStorage.get).mockResolvedValueOnce([12])
      jest.mocked(mockStorage.enable).mockResolvedValueOnce([12, 18])
      await service.toggle(18)
      expect(mockStorage.enable).toHaveBeenCalledWith(18)
      expect(mockStorage.disable).not.toHaveBeenCalled()
      expect(sendMessageMock).toHaveBeenCalledWith({
        type: FiltersMessages.filtersUpdated,
        payload: {
          enabledFilters: [12, 18]
        }
      })
    })
    it('should disable filter and send message that filters updated', async () => {
      jest.mocked(mockStorage.get).mockResolvedValueOnce([12, 18])
      jest.mocked(mockStorage.disable).mockResolvedValueOnce([18])
      await service.toggle(12)
      expect(mockStorage.disable).toHaveBeenCalledWith(12)
      expect(mockStorage.enable).not.toHaveBeenCalled()
      expect(sendMessageMock).toHaveBeenCalledWith({
        type: FiltersMessages.filtersUpdated,
        payload: {
          enabledFilters: [18]
        }
      })
    })
  })

  describe('getEnabledFilters', () => {
    it('should return currently active filters', async () => {
      jest.mocked(mockStorage.get).mockResolvedValueOnce([12])
      jest.mocked(mockStorage.get).mockResolvedValueOnce([1, 2, 3])
      expect(await service.getEnabledFilters()).toEqual([12])
      expect(await service.getEnabledFilters()).toEqual([1, 2, 3])
    })
  })

  describe('setup', () => {
    it('should be able to set unique filters', async () => {
      await service.setup([1, 1, 2])
      expect(mockStorage.setup).toHaveBeenCalledWith([1])
    })

    it('should not be able to setup unsupported filters', async () => {
      await service.setup([1000, 0, 100])
      expect(mockStorage.setup).toHaveBeenCalledWith([])
    })
  })
})
