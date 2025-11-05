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
import {
  FilterMetadata,
  FiltersBaseInterface,
  GroupMetadata,
  Metadata,
  TagMetadata
} from '@/modules/filters/common/filters.types'

export enum InternalFiltersIdentifiers {
  /**
   * @link FilterServiceInterface
   */
  filters = 'Filters.Filters',

  /**
   * @link FiltersStorage
   */
  _filterStorage = 'Filters.FilterStorage',

  /**
   * MetadataServiceInterface
   */
  metadata = 'Filters.Metadata',

  /**
   * @link MetadataStorage
   */
  _metadataStorage = 'Filters.MetadataStorage'
}

export interface FiltersServiceInterface extends FiltersBaseInterface {
  getEnabledFilters: () => Promise<number[]>
  setup: (filters: number[]) => Promise<void>
}

export interface MetadataServiceInterface {
  getMetadata: () => Promise<Metadata>
  getGroups: () => Promise<GroupMetadata[]>
  getFilters: () => Promise<FilterMetadata[]>
  getTags: () => Promise<TagMetadata[]>
  updateMetadata: () => Promise<void>
}
