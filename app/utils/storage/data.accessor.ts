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

import { type DataAccessorInterface, type DataAccessorOptions } from './storage.types'
import { DataAccessorException } from './storage.exception'
import { logger } from '@/utils/logger/logger'
import AreaName = chrome.storage.AreaName

/**
 * DataAccessor is a class that provides methods to read, write, and remove data from a storage area.
 */
export class DataAccessor<Type> implements DataAccessorInterface<Type> {
  private data: Type | null
  private errorOccurred = false

  /**
   * Creates a new DataAccessor instance.
   * @param area - The storage type
   * @param key - The key under which the data is stored.
   * @param options - Options for the DataAccessor, including whether to use JSON serialization and caching.
   */
  constructor (
    private readonly area: AreaName,
    private readonly key: string,
    private readonly options: DataAccessorOptions<Type>
  ) {
  }

  /**
   * @inheritDoc
   */
  async exists (): Promise<boolean> {
    const data = await chrome.storage[this.area].get(this.key)
    return Boolean(data[this.key])
  }

  /**
   * @inheritDoc
   */
  async read (): Promise<Type> {
    if ((this.options.useCache && this.data != null) || this.errorOccurred) {
      return this.data as Type
    }

    if (await this.exists()) {
      const rawData = await this.getRaw<Type>(this.key)
      const data = this.options.asJSON ? JSON.parse(rawData as string) : rawData as Type

      if (this.options.useCache) {
        this.data = data
      }

      return data
    }

    if (this.options.default != null) {
      this.data = this.options.default
      return this.data
    }

    throw new DataAccessorException('Data is not exist and default value is not provided')
  }

  /**
   * @inheritDoc
   */
  async remove (): Promise<void> {
    this.data = null
    await chrome.storage[this.area].remove(this.key)
  }

  /**
   * @inheritDoc
   */
  async write (data: Type): Promise<void> {
    if (this.options.useCache) {
      this.data = data
    }

    const rawData = this.options.asJSON ? JSON.stringify(data) : data
    try {
      await chrome.storage[this.area].set({ [this.key]: rawData })
    } catch (error) {
      logger.warn(`Storage: can't set key "${this.key}" to storage. Reason: ${error}. Try to set it in runtime`)
      this.errorOccurred = true
      this.data = data
    }
  }

  private async getRaw<Type> (keys?: string | string[]): Promise<Type> {
    const isKeysMissing = typeof keys === 'undefined'
    const response: Record<string, any> = isKeysMissing
      ? await chrome.storage[this.area].get()
      : await chrome.storage[this.area].get(keys)

    if (isKeysMissing) {
      return response as Type
    }
    return (Array.isArray(keys) ? response : response[keys]) as Type
  }
}
