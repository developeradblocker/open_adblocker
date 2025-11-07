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
import { injectable } from 'inversify'
import { InternalFiltersIdentifiers, MetadataServiceInterface } from '@/modules/filters/internal/filters.types'
import {
  FilterId,
  FilterMetadata, GroupId,
  GroupMetadata,
  Metadata,
  metadataValidator
} from '@/modules/filters/common/filters.types'
import { inject } from '@/utils/di/di.types'
import { MetadataStorage } from '@/modules/filters/internal/storage/metadata.storage'
import { METADATA_PATH } from '../../../../../constants'
import { logger } from '@/utils/logger/logger'
import { MetadataRuleSet } from '@adguard/tsurlfilter/es/declarative-converter'

@injectable()
export class MetadataService implements MetadataServiceInterface {
  constructor (
    @inject(InternalFiltersIdentifiers._metadataStorage)
    private storage: MetadataStorage
  ) {
  }

  async getMetadata (): Promise<Metadata> {
    const data = await this.storage.get()
    if (!data.version) {
      await this.updateMetadata()
    }
    return await this.storage.get()
  }

  async getGroups (): Promise<GroupMetadata[]> {
    const { metadata } = await this.storage.get()
    return metadata.groups
  }

  async getGroupByFilter (filterId: FilterId): Promise<GroupId> {
    const filters = await this.getFilters()
    const filter = filters.find(filter => filter.filterId === filterId)
    return filter?.groupId
  }

  async getFilters (): Promise<FilterMetadata[]> {
    const { metadata } = await this.storage.get()
    return metadata.filters
  }

  async updateMetadata (): Promise<void> {
    try {
      const url = chrome.runtime.getURL(METADATA_PATH)
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const metadataResponse = MetadataRuleSet.deserialize(await response.text())

      const validData = metadataValidator.parse({
        metadata: metadataResponse.getAdditionalProperty('metadata'),
        version: metadataResponse.getAdditionalProperty('version'),
        versionTimestampMs: metadataResponse.getAdditionalProperty('versionTimestampMs')
      })
      await this.storage.set(validData)
    } catch (error) {
      logger.error('Failed to fetch metadata: ', error)
    }
  }
}
