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
import { onInstallHandler } from '@/modules/settings/internal/handlers/on-install.handler'
import { di } from '@/utils/setup-worker'
import { InternalSettingsIdentifiers } from '@/modules/settings/internal/settings.types'
import { MetadataServiceInterface, FilterMetadata } from '@/modules/settings/common/settings.types'
import { useInternalFilters } from '@/modules/filters/internal/filters.utils'
import { getFilterIdsByLocale } from '@/helpers/locale-detect.helper'

jest.mock('@/utils/setup-worker', () => ({
  di: {
    get: jest.fn()
  }
}))

jest.mock('@/modules/filters/internal/filters.utils', () => ({
  useInternalFilters: jest.fn()
}))

jest.mock('@/helpers/locale-detect.helper', () => ({
  getFilterIdsByLocale: jest.fn()
}))

jest.mock('../../../../../constants', () => ({
  DEFAULT_ENABLED_FILTER_IDS: [2, 10]
}))

global.chrome = {
  runtime: {
    OnInstalledReason: {
      INSTALL: 'install',
      UPDATE: 'update',
      CHROME_UPDATE: 'chrome_update'
    }
  }
} as any

const mockGetFilterIdsByLocale = jest.mocked(getFilterIdsByLocale)
const mockUseInternalFilters = jest.mocked(useInternalFilters)

const createDetails = (reason: string): chrome.runtime.InstalledDetails =>
  ({ reason } as chrome.runtime.InstalledDetails)

describe('onInstallHandler', () => {
  const mockUpdateMetadata = jest.fn()
  const mockGetFilters = jest.fn()
  const mockSetup = jest.fn()

  const mockMetadataService: MetadataServiceInterface = {
    updateMetadata: mockUpdateMetadata,
    getMetadata: jest.fn(),
    getFilters: mockGetFilters
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(di.get).mockReturnValue(mockMetadataService)
    mockUpdateMetadata.mockResolvedValue(undefined)
    mockGetFilters.mockResolvedValue([])
    mockSetup.mockResolvedValue(undefined)
    mockGetFilterIdsByLocale.mockReturnValue([])
    mockUseInternalFilters.mockReturnValue({ setup: mockSetup } as any)
  })

  describe('metadata update', () => {
    it('should get metadata service from DI container', async () => {
      await onInstallHandler(createDetails('install'))

      expect(di.get).toHaveBeenCalledWith(InternalSettingsIdentifiers.metadata)
    })

    it('should call updateMetadata for INSTALL reason', async () => {
      await onInstallHandler(createDetails('install'))

      expect(mockUpdateMetadata).toHaveBeenCalledTimes(1)
    })
  })

  describe('on INSTALL reason', () => {
    const installDetails = createDetails('install')

    it('should fetch filters and set up initial filters', async () => {
      const filters = [{ filterId: 5, languages: ['en'] }] as FilterMetadata[]
      mockGetFilters.mockResolvedValue(filters)
      mockGetFilterIdsByLocale.mockReturnValue([5])

      await onInstallHandler(installDetails)

      expect(mockGetFilters).toHaveBeenCalledTimes(1)
      expect(mockGetFilterIdsByLocale).toHaveBeenCalledWith(filters)
      expect(mockSetup).toHaveBeenCalledWith([2, 10, 5])
    })

    it('should deduplicate filter IDs when locale filters overlap with defaults', async () => {
      const filters = [{ filterId: 2, languages: ['en'] }] as FilterMetadata[]
      mockGetFilters.mockResolvedValue(filters)
      mockGetFilterIdsByLocale.mockReturnValue([2])

      await onInstallHandler(installDetails)

      expect(mockSetup).toHaveBeenCalledWith([2, 10])
    })

    it('should use only default filters when no locale filters match', async () => {
      mockGetFilters.mockResolvedValue([])
      mockGetFilterIdsByLocale.mockReturnValue([])

      await onInstallHandler(installDetails)

      expect(mockSetup).toHaveBeenCalledWith([2, 10])
    })

    it('should merge multiple locale filter IDs with defaults', async () => {
      const filters = [
        { filterId: 5, languages: ['en'] },
        { filterId: 7, languages: ['fr'] }
      ] as FilterMetadata[]
      mockGetFilters.mockResolvedValue(filters)
      mockGetFilterIdsByLocale.mockReturnValue([5, 7])

      await onInstallHandler(installDetails)

      expect(mockSetup).toHaveBeenCalledWith([2, 10, 5, 7])
    })
  })
})
