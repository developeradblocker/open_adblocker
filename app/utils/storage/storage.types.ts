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
export interface DataAccessorOptions<Type> {
  readonly default?: Type

  /**
   * determines if data has to be stored as json in a storage
   *
   * by default, it is false
   */
  readonly asJSON?: boolean

  /**
   * determines if a cache should be used
   *
   * by default, it is true
   */
  readonly useCache?: boolean
}

export interface DataAccessorInterface<Type> {
  /**
   * Read data from a storage
   *
   * @throws DataAccessorException - when data is not stored and default value is not provided
   * @throws SyntaxError - when a stored JSON cannot be parsed
   */
  read: () => Promise<Type>

  /**
   * Write data to a storage
   *
   * @throws Error - when not enough space on a storage
   * @param data
   */
  write: (data: Type) => Promise<void>

  /**
   * Remove data from a storage
   *
   */
  remove: () => Promise<void>

  /**
   * checks if data is written in a storage
   */
  exists: () => Promise<boolean>
}
