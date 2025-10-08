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
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'
import { FilterId } from '@/modules/filters/common/filters.types'
import { DEFAULT_ENABLED_FILTER_IDS } from '../../../../../constants.js'

export class FiltersStorage {
  private readonly storage = makeDataAccessor<number[]>(
    'local',
    'ENABLED_FILTERS',
    {
      useCache: false,
      default: DEFAULT_ENABLED_FILTER_IDS.map(Number)
    })

  async enable (id: number): Promise<number[]> {
    const enabledFilters = await this.get()
    if (enabledFilters.includes(id)) {
      return enabledFilters
    }

    enabledFilters.push(id)
    await this.storage.write(enabledFilters)
    return enabledFilters
  }

  async disable (id: number): Promise<number[]> {
    const enabledFilters = (await this.get())
      .filter((filterId: FilterId) => filterId !== id)

    await this.storage.write(enabledFilters)
    return enabledFilters
  }

  async get (): Promise<number[]> {
    return await this.storage.read()
  }
}
