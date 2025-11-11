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
import { MetadataStorage } from '@/modules/settings/internal/storage/metadata.storage'

import { Metadata } from '@/modules/settings/common/settings.types'

describe('MetadataStorage', () => {
  let storage: MetadataStorage
  let mockStorageAccessor: any

  beforeEach(() => {
    mockStorageAccessor = {
      read: jest.fn(),
      write: jest.fn()
    }
    storage = new MetadataStorage()
    // @ts-ignore
    storage.storage = mockStorageAccessor
  })

  describe('get', () => {
    it('should return metadata from storage', async () => {
      const mockMetadata: Metadata = {
        version: '1.0.0',
        versionTimestampMs: 123456,
        metadata: { filters: [], groups: [], tags: [] }
      }
      mockStorageAccessor.read.mockResolvedValue(mockMetadata)

      const result = await storage.get()

      expect(result).toEqual(mockMetadata)
      expect(mockStorageAccessor.read).toHaveBeenCalledTimes(1)
    })
  })

  describe('set', () => {
    it('should write metadata to storage', async () => {
      const mockMetadata: Metadata = {
        version: '2.0.0',
        versionTimestampMs: 789012,
        metadata: { filters: [], groups: [], tags: [] }
      }
      mockStorageAccessor.write.mockResolvedValue(undefined)

      await storage.set(mockMetadata)

      expect(mockStorageAccessor.write).toHaveBeenCalledWith(mockMetadata)
      expect(mockStorageAccessor.write).toHaveBeenCalledTimes(1)
    })
  })
})
