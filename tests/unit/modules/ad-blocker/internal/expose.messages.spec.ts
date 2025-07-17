import { dispatcher } from '@/utils/setup-worker'
import {
  onAdBlockerReady,
  onBlockedAd,
  onToggledAdBlocker
} from '@/modules/ad-blocker/internal/expose.messages'
import { AdBlockerMessages } from '@/modules/ad-blocker/common/ad-blocker.messages'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))

describe('expose.messages', () => {
  let onAfterMock: jest.Mock

  beforeEach(() => {
    onAfterMock = jest.fn()
    jest.mocked(dispatcher).mockReturnValue(
      { onAfter: onAfterMock } as unknown as DispatcherInterface
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should register onAdBlockerReady listener with correct message type', () => {
    const listener = jest.fn()
    onAdBlockerReady(listener)
    expect(onAfterMock).toHaveBeenCalledWith(AdBlockerMessages.ready, listener)
  })

  it('should register onBlockedAd listener with correct message type', () => {
    const listener = jest.fn()
    onBlockedAd(listener)
    expect(onAfterMock).toHaveBeenCalledWith(AdBlockerMessages.blockedAd, listener)
  })

  it('should register onToggledAdBlocker listener with correct message type', () => {
    const listener = jest.fn()
    onToggledAdBlocker(listener)
    expect(onAfterMock).toHaveBeenCalledWith(AdBlockerMessages.toggle, listener)
  })
})
