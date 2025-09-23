import { Box } from '@/utils/dispatcher/dispatcher.types'
import { UserActivityMessage } from '@/modules/user-activity/common/user-activity.messages'
import { ElementsUI, PageUI, UserActivityType } from '@/modules/user-activity/common/user-activity.types'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { rateUsCounter, rateUsService } from '@/modules/rate-us/internal/utils'

export const userActivityHandler = async ({ message }: Box<UserActivityMessage>): Promise<void> => {
  const { payload } = message

  if (payload.type === UserActivityType.click) {
    return handleClicks(payload.element)
  }

  if (payload.type === UserActivityType.visitPage) {
    return handlePageVisit(payload.page)
  }
}

export const handleOnHomePageVisited = async (): Promise<void> => {
  await rateUsCounter().increase()
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
    [ROUTE.HOME]: handleOnHomePageVisited,
    [ROUTE.RATE_US]: handleOnRateUsPageVisited
  }

  await handlers[page]?.()
}
