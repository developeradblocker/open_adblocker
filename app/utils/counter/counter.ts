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
import { CounterInterface } from '@/utils/counter/counter.types'
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'
import AreaName = chrome.storage.AreaName

export const makeCounter = (key: string, storageType: AreaName, initialValue?: number): CounterInterface => {
  const counterKey = `${key}Counter`
  const storage = makeDataAccessor<number>(storageType, counterKey, {
    default: initialValue ?? 0
  })

  /**
   * @inheritDoc
   */
  const get = async (): Promise<number> => {
    return await storage.read()
  }

  /**
   * @inheritDoc
   */
  const increase = async (): Promise<void> => {
    const current = await storage.read()
    await storage.write(current + 1)
  }

  /**
   * @inheritDoc
   */
  const set = async (value: number): Promise<void> => {
    await storage.write(value)
  }

  /**
   * @inheritDoc
   */
  const reset = async (): Promise<void> => {
    await storage.write(initialValue ?? 0)
  }

  /**
   * @inheritDoc
   */
  const remove = async (): Promise<void> => {
    await storage.remove()
  }

  return {
    get,
    set,
    increase,
    reset,
    remove
  }
}
