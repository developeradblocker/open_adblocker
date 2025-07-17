import { internalAdblocker, totalCounter, counterByTab } from '@/modules/ad-blocker/internal/utils'
import { di } from '@/utils/setup-worker'
import { InternalAdBlockerIdentifiers } from '@/modules/ad-blocker/internal/ad-blocker.types'

jest.mock('@/utils/setup-worker', () => ({
  di: {
    get: jest.fn()
  }
}))

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return adBlocker instance with correct identifier', () => {
    const mockAdBlocker = {}
    jest.mocked(di.get).mockReturnValueOnce(mockAdBlocker)

    expect(internalAdblocker()).toBe(mockAdBlocker)
    expect(di.get).toHaveBeenCalledWith(InternalAdBlockerIdentifiers.adBlocker)
  })

  it('should return totalCounter instance with correct identifier', () => {
    const mockTotalCounter = {}
    jest.mocked(di.get).mockReturnValueOnce(mockTotalCounter)

    expect(totalCounter()).toBe(mockTotalCounter)
    expect(di.get).toHaveBeenCalledWith(InternalAdBlockerIdentifiers._totalCounter)
  })

  it('should return counterByTab instance with correct identifier', () => {
    const mockCounterByTab = {}
    jest.mocked(di.get).mockReturnValueOnce(mockCounterByTab)

    expect(counterByTab()).toBe(mockCounterByTab)
    expect(di.get).toHaveBeenCalledWith(InternalAdBlockerIdentifiers._counterByTab)
  })
})
