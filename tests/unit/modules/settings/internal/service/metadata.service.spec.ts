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
import { MetadataService } from '@/modules/settings/internal/service/metadata.service'
import { MetadataStorage } from '@/modules/settings/internal/storage/metadata.storage'
import { MetadataRuleSet } from '@adguard/tsurlfilter/es/declarative-converter'
import { METADATA_PATH } from '../../../../../../constants'
import { FilterMetadata, GroupMetadata, Metadata, metadataValidator } from '@/modules/settings/common/settings.types'

jest.mock('@/utils/logger/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

jest.mock('@/modules/settings/common/settings.types', () => ({
  ...jest.requireActual('@/modules/settings/common/settings.types'),
  metadataValidator: {
    parse: jest.fn()
  }
}))

describe('MetadataService', () => {
  let service: MetadataService
  let mockStorage: jest.Mocked<MetadataStorage>

  const mockMetadata: Metadata = {
    version: '1.0.0',
    versionTimestampMs: 1234567890,
    metadata: {
      filters: [
        { filterId: 1, name: 'Filter 1', description: 'Description 1', groupId: 1, tags: [1] }
      ] as FilterMetadata[],
      groups: [
        { groupId: 1, groupName: 'Group 1' }
      ] as GroupMetadata[],
      tags: []
    }
  }

  beforeEach(() => {
    (metadataValidator.parse as jest.Mock).mockReturnValue(mockMetadata)
    mockStorage = {
      get: jest.fn(),
      set: jest.fn()
    } as any

    service = new MetadataService(mockStorage)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getMetadata', () => {
    it('should return metadata from storage when version exists', async () => {
      mockStorage.get.mockResolvedValue(mockMetadata)

      const result = await service.getMetadata()

      expect(result).toEqual(mockMetadata)
      expect(mockStorage.get).toHaveBeenCalledTimes(2)
    })

    it('should update metadata when version does not exist', async () => {
      const emptyMetadata: Metadata = {
        metadata: { filters: [], groups: [], tags: [] }
      } as any

      mockStorage.get
        .mockResolvedValueOnce(emptyMetadata)
        .mockResolvedValueOnce(mockMetadata)

      const mockResponse = {
        text: jest.fn().mockResolvedValue('{}'),
        ok: true
      }
      global.fetch = jest.fn().mockResolvedValue(mockResponse)
      global.chrome = {
        runtime: {
          getURL: jest.fn().mockReturnValue('chrome-extension://test/metadata.json')
        }
      } as any

      const mockRuleSet = {
        getAdditionalProperty: jest.fn((key: string) => {
          if (key === 'metadata') return mockMetadata.metadata
          if (key === 'version') return mockMetadata.version
          if (key === 'versionTimestampMs') return mockMetadata.versionTimestampMs
        })
      }
      jest.spyOn(MetadataRuleSet, 'deserialize').mockReturnValue(mockRuleSet as any)

      const result = await service.getMetadata()

      expect(result).toEqual(mockMetadata)
      expect(mockStorage.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('getFilters', () => {
    it('should return filters from metadata', async () => {
      mockStorage.get.mockResolvedValue(mockMetadata)

      const result = await service.getFilters()

      expect(result).toEqual(mockMetadata.metadata.filters)
      expect(mockStorage.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateMetadata', () => {
    let mockResponse: any
    let mockRuleSet: any

    beforeEach(() => {
      mockResponse = {
        text: jest.fn().mockResolvedValue('{"test": "data"}'),
        ok: true
      }
      global.fetch = jest.fn().mockResolvedValue(mockResponse)
      global.chrome = {
        runtime: {
          getURL: jest.fn().mockReturnValue('chrome-extension://test/metadata.json')
        }
      } as any

      mockRuleSet = {
        getAdditionalProperty: jest.fn((key: string) => {
          if (key === 'metadata') return mockMetadata.metadata
          if (key === 'version') return mockMetadata.version
          if (key === 'versionTimestampMs') return mockMetadata.versionTimestampMs
        })
      }
      jest.spyOn(MetadataRuleSet, 'deserialize').mockReturnValue(mockRuleSet as any)
    })

    it('should fetch and update metadata successfully', async () => {
      mockStorage.set.mockResolvedValue(undefined)

      await service.updateMetadata()

      expect(chrome.runtime.getURL).toHaveBeenCalledWith(METADATA_PATH)
      expect(global.fetch).toHaveBeenCalledWith(
        'chrome-extension://test/metadata.json',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      )
      expect(mockResponse.text).toHaveBeenCalled()
      expect(MetadataRuleSet.deserialize).toHaveBeenCalledWith('{"test": "data"}')
      expect(mockStorage.set).toHaveBeenCalledWith({
        metadata: mockMetadata.metadata,
        version: mockMetadata.version,
        versionTimestampMs: mockMetadata.versionTimestampMs
      })
    })

    it('should handle fetch errors gracefully', async () => {
      const error = new Error('Fetch failed')
      global.fetch = jest.fn().mockRejectedValue(error)

      await service.updateMetadata()

      expect(mockStorage.set).not.toHaveBeenCalled()
    })

    it('should handle deserialization errors', async () => {
      jest.spyOn(MetadataRuleSet, 'deserialize').mockImplementation(() => {
        throw new Error('Deserialization failed')
      })

      await service.updateMetadata()

      expect(mockStorage.set).not.toHaveBeenCalled()
    })
  })
})
