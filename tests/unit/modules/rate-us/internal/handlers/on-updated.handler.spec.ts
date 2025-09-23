import { rateUsService } from '@/modules/rate-us/internal/utils'
import { onUpdatedHandler } from '@/modules/rate-us/internal/handlers/on-updated.handler'

jest.mock('@/modules/rate-us/internal/utils')

describe('onUpdatedHandler', () => {
  const visitMock = jest.fn()
  const rateMock = jest.fn()
  const removeMock = jest.fn()
  beforeEach(() => {
    global.chrome = {
      storage: {
        local: {
          remove: removeMock
        }
      }
    } as any
    (rateUsService as jest.Mock).mockReturnValue({ visit: visitMock, rate: rateMock })
  })
  it('should be able to migrate "1.2.0"', async () => {
    await onUpdatedHandler({ reason: 'install', previousVersion: '1.1.0' })
    expect(visitMock).not.toHaveBeenCalled()
    expect(rateMock).not.toHaveBeenCalled()
    await onUpdatedHandler({ reason: 'update', previousVersion: '1.1.0' })
    expect(visitMock).toHaveBeenCalledTimes(1)
    expect(rateMock).toHaveBeenCalledTimes(1)
  })
})
