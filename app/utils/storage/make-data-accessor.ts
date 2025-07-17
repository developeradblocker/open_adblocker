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

import { DataAccessorInterface, DataAccessorOptions } from './storage.types'
import { DataAccessor } from './data.accessor'
import AreaName = chrome.storage.AreaName

/**
 * Creates a data accessor for the specified storage and key.
 * @param area - The storage area to use (e.g., 'local', 'sync').
 * @param key - The key under which the data is stored.
 * @param options - Options for the DataAccessor.
 */
export const makeDataAccessor = <Type>(
  area: AreaName,
  key: string,
  options: DataAccessorOptions<Type> = {}
): DataAccessorInterface<Type> => {
  return new DataAccessor<Type>(area, key, {
    asJSON: options.asJSON ?? false,
    useCache: options.useCache ?? true,
    default: options.default
  })
}
