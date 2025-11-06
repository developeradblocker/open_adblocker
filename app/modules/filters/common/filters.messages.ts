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
import { AppMessage } from '@/utils/dispatcher/dispatcher.types'
import { FilterId, GroupId } from '@/modules/filters/common/filters.types'

export enum FiltersMessages {
  toggleFilter = 'Filters.ToggleFilter',
  filtersUpdated = 'Filters.FiltersUpdated',
  isEnabled = 'Filters.IsEnabled',
  toggleGroup = 'Filters.ToggleGroup',
}

export interface ToggleFilterMessage extends AppMessage {
  type: FiltersMessages.toggleFilter
  payload: { id: FilterId }
}

export interface ToggleGroupMessage extends AppMessage {
  type: FiltersMessages.toggleGroup
  payload: { id: GroupId }
}

export interface IsEnabledFilterMessage extends AppMessage {
  type: FiltersMessages.isEnabled
  payload: { id: FilterId }
}

export interface FiltersUpdatedMessage extends AppMessage {
  type: FiltersMessages.filtersUpdated
  payload: { enabledFilters: number[] }
}
