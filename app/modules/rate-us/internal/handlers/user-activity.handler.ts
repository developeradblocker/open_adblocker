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

import { Box } from '@/utils/dispatcher/dispatcher.types'
import { UserActivityMessage } from '@/modules/user-activity/common/user-activity.messages'
import { ElementsUI, PageUI, UserActivityType } from '@/modules/user-activity/common/user-activity.types'
import { POPUP_ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { rateUsService } from '@/modules/rate-us/internal/utils'

export const userActivityHandler = async ({ message }: Box<UserActivityMessage>): Promise<void> => {
  const { payload } = message

  if (payload.type === UserActivityType.click) {
    return handleClicks(payload.element)
  }

  if (payload.type === UserActivityType.visitPage) {
    return handlePageVisit(payload.page)
  }
}

export const handleOnRateUsPageVisited = async (): Promise<void> => {
  await rateUsService().visit()
}

export const handleOnRatingClickedVisited = async (): Promise<void> => {
  await rateUsService().rate()
}

const handleClicks = async (element: ElementsUI): Promise<void> => {
  const clickHandlers: any = {
    [ElementsUI.rateUsButton]: handleOnRatingClickedVisited
  }

  return clickHandlers[element]?.()
}

const handlePageVisit = async (page: PageUI): Promise<void> => {
  const handlers: any = {
    [POPUP_ROUTE.RATE_US]: handleOnRateUsPageVisited
  }

  await handlers[page]?.()
}
