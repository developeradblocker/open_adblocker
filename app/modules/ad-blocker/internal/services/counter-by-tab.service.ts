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
import { CounterByTabInterface } from '@/modules/ad-blocker/internal/ad-blocker.types'
import { injectable } from '@/utils/di/di.types'
import { BlockedAdsCounter } from '@/common/types'
import { BLOCKED_ADS_BY_TAB_COUNTER_STORAGE_KEY } from '@/modules/ad-blocker/internal/constants'
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'

@injectable()
export class CounterByTabService implements CounterByTabInterface {
  private readonly dataAccessor = makeDataAccessor<Record<number, BlockedAdsCounter>>(
    'session',
    BLOCKED_ADS_BY_TAB_COUNTER_STORAGE_KEY,
    {
      default: {}
    }
  )

  /**
   * Get number of blocked ads on the specified tab
   * @param tabId
   */
  async get (tabId: number): Promise<BlockedAdsCounter> {
    const data = await this.dataAccessor.read()
    return data[tabId] ?? 0
  }

  /**
   * Increment number of blocked ads on the specified tab
   * @param tabId
   */
  async increment (tabId: number): Promise<void> {
    const data = await this.dataAccessor.read()
    if (!data[tabId]) {
      data[tabId] = 0
    }
    data[tabId]++
    await this.dataAccessor.write(data)
  }

  /**
   * Reset the number of blocked ads to zero on the specified tab
   * @param tabId
   */
  async reset (tabId: number): Promise<void> {
    const data = await this.dataAccessor.read()
    delete data[tabId]
    await this.dataAccessor.write(data)
  }
}
