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

import { type InternalRateUsServiceInterface, RateUsIdentifiers } from '../rate-us.types'
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'
import { inject } from '@/utils/di/di.types'
import { CounterInterface } from '@/utils/counter/counter.types'
import { RATE_US_HOME_PAGE_VISITED_THRESHOLD } from '@/modules/rate-us/constants'
import { injectable } from 'inversify'

@injectable()
export class InternalRateUsService implements InternalRateUsServiceInterface {
  constructor (
    @inject(RateUsIdentifiers._counter)
    private readonly counter: CounterInterface
  ) {
  }

  private storage = makeDataAccessor<boolean>('local', 'RATE_US_SHOWN', {
    useCache: false,
    default: false
  })

  async visit (): Promise<void> {
    await this.storage.write(true)
  }

  async needVisit (): Promise<boolean> {
    const isShown = await this.storage.read()

    if (isShown) {
      return false
    }

    const homePageVisitedTimes = await this.counter.get()
    return homePageVisitedTimes >= RATE_US_HOME_PAGE_VISITED_THRESHOLD
  }
}
