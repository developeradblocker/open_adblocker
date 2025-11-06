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
import { FilterId } from '@/modules/filters/common/filters.types'
import { inject, injectable } from '@/utils/di/di.types'
import {
  FiltersServiceInterface,
  InternalFiltersIdentifiers,
  MetadataServiceInterface
} from '@/modules/filters/internal/filters.types'
import { FiltersStorage } from '@/modules/filters/internal/storage/filters.storage'
import { FiltersMessages, FiltersUpdatedMessage } from '@/modules/filters/common/filters.messages'
import { dispatcher } from '@/utils/setup-worker'
import { ALLOWLIST_FILTER_ID, CUSTOM_FILTERS_START_ID, USER_FILTER_ID } from '../../../../../constants'

@injectable()
export class FiltersService implements FiltersServiceInterface {
  constructor (
    @inject(InternalFiltersIdentifiers._filterStorage)
    private readonly storage: FiltersStorage,

    @inject(InternalFiltersIdentifiers.metadata)
    private readonly metadata: MetadataServiceInterface
  ) {}

  async setup (filters: FilterId[]): Promise<void> {
    const filteredFilters: FilterId[] = []
    for (const filterId of filters) {
      if (filteredFilters.includes(filterId)) {
        continue
      }

      if (!this.isCommonFilter(filterId)) {
        continue
      }

      if (!(await this.isSupported(filterId))) {
        continue
      }

      filteredFilters.push(filterId)
    }

    await this.storage.setup(filteredFilters)
  }

  async toggle (filterId: FilterId): Promise<void> {
    let enabledFilters = await this.storage.get()

    if (enabledFilters.includes(filterId)) {
      enabledFilters = await this.storage.disable(filterId)
    } else {
      enabledFilters = await this.storage.enable(filterId)
    }

    const message: FiltersUpdatedMessage = {
      type: FiltersMessages.filtersUpdated,
      payload: { enabledFilters }
    }

    await dispatcher().sendMessage(message)
  }

  async isEnabled (id: FilterId): Promise<boolean> {
    const enabledFilters = await this.storage.get()
    return enabledFilters.includes(id)
  }

  async getEnabledFilters (): Promise<FilterId[]> {
    return await this.storage.get()
  }

  private isCommonFilter (filterId: FilterId): boolean {
    return !this.isCustomFilter(filterId) &&
    filterId !== USER_FILTER_ID &&
    filterId !== ALLOWLIST_FILTER_ID
  }

  private isCustomFilter (filterId: FilterId): boolean {
    return filterId >= CUSTOM_FILTERS_START_ID
  }

  private async isSupported (filterId: FilterId): Promise<boolean> {
    const supportedFilterIds = (await this.metadata.getFilters()).map((filter) => filter.filterId)

    return supportedFilterIds.includes(filterId)
  }
}
