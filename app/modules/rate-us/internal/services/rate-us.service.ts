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

import { type InternalRateUsServiceInterface, RateUsDataInterface } from '../rate-us.types'
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'
import { inject } from '@/utils/di/di.types'
import { injectable } from 'inversify'
import { ConfigServiceInterface, InternalConfigIdentifiers } from '@/modules/config/internal/config.types'
import { dayToMs } from '@/helpers/time/day-to-ms'
import { RATE_US_STORAGE_KEY } from '../../constants'
import { InternalBroadcastIdentifiers } from '@/modules/broadcast/internal/broadcast.types'
import { InternalBroadcastServiceInterface } from '@/modules/broadcast/internal/broadcast.types'
import { RateUsMessages } from '../../common/rate-us.messages'
import { logger } from '@/utils/logger/logger'

@injectable()
export class InternalRateUsService implements InternalRateUsServiceInterface {
  constructor (
    @inject(InternalConfigIdentifiers.service)
    private readonly config: ConfigServiceInterface,

    @inject(InternalBroadcastIdentifiers.service)
    private readonly broadcast: InternalBroadcastServiceInterface
  ) {
  }

  private storage = makeDataAccessor<RateUsDataInterface>('local', RATE_US_STORAGE_KEY, {
    useCache: false
  })

  async visit (): Promise<void> {
    const lastVisited = Date.now()
    if (await this.storage.exists()) {
      const data = await this.storage.read()
      await this.storage.write({ lastVisited, rated: data?.rated ?? false })
      return
    }

    await this.storage.write({ lastVisited })
  }

  async needVisit (): Promise<boolean> {
    if (!(await this.storage.exists())) {
      return false
    }

    const { rated, lastVisited } = await this.storage.read()

    if (!lastVisited || rated) {
      return false
    }

    const { rateUsReminderDays } = await this.config.get()
    return (Date.now() - lastVisited) >= dayToMs(rateUsReminderDays)
  }

  async rate (): Promise<void> {
    const data = await this.storage.read()
    await this.storage.write({ lastVisited: data.lastVisited, rated: true })
  }

  async showRateUsPopup (): Promise<void> {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!activeTab) {
      logger.warn('RateUsModule: No active tab found')
      return
    }

    this.broadcast.sendMessage(activeTab.id, { type: RateUsMessages.showNotification })
  }
}
