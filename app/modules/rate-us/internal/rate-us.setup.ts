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
import { UserActivityType } from '@/modules/user-activity/common/user-activity.types'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { Box } from '@/utils/dispatcher/dispatcher.types'
import { UserActivityMessage } from '@/modules/user-activity/common/user-activity.messages'
import { Injection } from '@/utils/inject/inject.types'
import { inject } from '@/utils/inject/inject'
import { rateUsCounter, rateUsService } from '@/modules/rate-us/internal/utils'

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
  onUserActivity(handleUserActivity)
}

export const handleOnHomePageVisited = async (): Promise<void> => {
  await rateUsCounter().increase()
}

export const handleOnRateUsPageVisited = async (): Promise<void> => {
  await rateUsService().visit()
}

export const handleUserActivity = async ({ message }: Box<UserActivityMessage>): Promise<void> => {
  const { payload } = message

  if (payload.type !== UserActivityType.visitPage) {
    return
  }

  const page = payload.page

  const handlers = {
    [ROUTE.HOME]: handleOnHomePageVisited,
    [ROUTE.RATE_US]: handleOnRateUsPageVisited
  } as any

  if (!handlers[page]) {
    return
  }

  await handlers[page]()
}
