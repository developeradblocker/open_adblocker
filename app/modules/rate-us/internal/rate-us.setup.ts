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

import { RateUsIdentifiers } from '@/modules/rate-us/internal/rate-us.types'
import { InternalRateUsService } from '@/modules/rate-us/internal/services/rate-us.service'
import { makeCounter } from '@/utils/counter/counter'
import { HOME_PAGE_VISITED_COUNTER } from '@/modules/rate-us/constants'
import { onUserActivity } from '@/modules/user-activity/internal/expose.messages'
import { Injection } from '@/utils/inject/inject.types'
import { inject } from '@/utils/inject/inject'
import { userActivityHandler } from '@/modules/rate-us/internal/handlers/user-activity.handler'
import { onUpdatedHandler } from '@/modules/rate-us/internal/handlers/on-updated.handler'

const injections: Injection[] = [
  {
    key: RateUsIdentifiers._counter,
    use: makeCounter(
      HOME_PAGE_VISITED_COUNTER,
      'local',
      0
    ),
    value: true
  },
  {
    key: RateUsIdentifiers.rateUsService,
    use: InternalRateUsService
  }
]

export const setupInternalRateUs = (): void => {
  inject(injections)
  onUserActivity(userActivityHandler)
  chrome.runtime.onInstalled.addListener(onUpdatedHandler)
}
