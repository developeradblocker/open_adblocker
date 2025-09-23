import { ElementsUI, UserActivityType } from '@/modules/user-activity/common/user-activity.types'
import { handleUserActivity } from '@/modules/user-activity/internal/user-activity.setup'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { rateUsCounter, rateUsService } from '@/modules/rate-us/internal/utils'
import { UserActivityMessages } from '@/modules/user-activity/common/user-activity.messages'
import {
  handleOnHomePageVisited,
  handleOnRateUsPageVisited, userActivityHandler
} from '@/modules/rate-us/internal/handlers/user-activity.handler'

jest.mock('@/modules/rate-us/internal/utils', () => ({
  rateUsCounter: jest.fn(),
  rateUsService: jest.fn()
}))

describe('handleOnHomePageVisited', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call rateUsCounter().increase', async () => {
    const increaseMock = jest.fn().mockResolvedValue(undefined as never)
    jest.mocked(rateUsCounter).mockReturnValue({ increase: increaseMock } as any)

    await handleOnHomePageVisited()

    expect(rateUsCounter).toHaveBeenCalledTimes(1)
    expect(increaseMock).toHaveBeenCalledTimes(1)
  })
})

describe('handleOnRateUsPageVisited', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call rateUsService().visit', async () => {
    const visitMock = jest.fn().mockResolvedValue(undefined as never)
    jest.mocked(rateUsService).mockReturnValue({ visit: visitMock } as any)

    await handleOnRateUsPageVisited()

    expect(rateUsService).toHaveBeenCalledTimes(1)
    expect(visitMock).toHaveBeenCalledTimes(1)
  })
})

describe('handleUserActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should do nothing for non-visitPage events', async () => {
    const msg = {
      type: UserActivityMessages.activity,
      payload: {
        type: 'other',
        page: ROUTE.HOME
      }
    }
    const result = await handleUserActivity({ message: msg } as any)
    expect(result).toBeUndefined()
  })

  it('should call handleOnHomePageVisited for HOME route', async () => {
    const increaseMock = jest.fn().mockResolvedValue(undefined as never)
    jest.mocked(rateUsCounter).mockReturnValue({ increase: increaseMock } as any)

    // Create a message with visitPage type and HOME route
    const msg = {
      payload: {
        type: UserActivityType.visitPage,
        page: ROUTE.HOME
      }
    }
    await userActivityHandler({ message: msg } as any)

    expect(increaseMock).toHaveBeenCalledTimes(1)
  })

  it('should call handleOnRateUsPageVisited for RATE_US route', async () => {
    const visitMock = jest.fn().mockResolvedValue(undefined as never)
    jest.mocked(rateUsService).mockReturnValue({ visit: visitMock } as any)

    // Create a message with visitPage type and RATE_US route
    const msg = {
      payload: {
        type: UserActivityType.visitPage,
        page: ROUTE.RATE_US
      }
    }
    await userActivityHandler({ message: msg } as any)

    expect(visitMock).toHaveBeenCalledTimes(1)
  })

  it('should do nothing if page does not match any handler', async () => {
    const msg = {
      payload: {
        type: UserActivityType.visitPage,
        page: 'unknown'
      }
    }
    const result = await handleUserActivity({ message: msg } as any)
    expect(result).toBeUndefined()
  })

  it('should handle click on rate us', async () => {
    const msg = {
      payload: {
        type: UserActivityType.click,
        element: ElementsUI.rateUsButton
      }
    }
    const rateMock = jest.fn()
    jest.mocked(rateUsService).mockReturnValue({ rate: rateMock } as any)

    await userActivityHandler({ message: msg } as any)
    expect(rateMock).toHaveBeenCalledTimes(1)
  })
})
