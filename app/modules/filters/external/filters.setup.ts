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
import { useExternalPort } from '@/modules/port/external/port.setup'
import { FilterId, FiltersBaseInterface } from '@/modules/filters/common/filters.types'
import { FiltersMessages, IsEnabledFilterMessage, ToggleFilterMessage } from '@/modules/filters/common/filters.messages'

let filters: FiltersBaseInterface
export const setupExternalFilters = (): FiltersBaseInterface => {
  if (filters) {
    return filters
  }

  filters = {
    async toggle (id: FilterId): Promise<void> {
      const message: ToggleFilterMessage = {
        type: FiltersMessages.toggle,
        payload: { id }
      }

      const port = useExternalPort()
      await port.sendMessage(message)
    },

    async isEnabled (id: FilterId): Promise<boolean> {
      const message: IsEnabledFilterMessage = {
        type: FiltersMessages.isEnabled,
        payload: { id }
      }

      const port = useExternalPort()
      return await port.sendMessage(message)
    }
  }

  return filters
}

export const useFilters = (): FiltersBaseInterface => {
  if (!filters) {
    throw new Error('FiltersModule is not set up. Please call "setupExternalFilters" first.')
  }
  return filters
}
