import { onHandledAllRequiredMessages } from '@/utils/on-handled-all-required-messages'

const registeredCallbacks: Record<string, Function> = {}

function fakeDispatcher (): any {
  return {
    on<T> (messageType: string, callback: (msg: T) => void): void {
      registeredCallbacks[messageType] = callback
    }
  }
}

// Replace dispatcher with our fake implementation
jest.mock('@/utils/setup-worker', () => ({
  dispatcher: fakeDispatcher
}))

describe('onHandledAllRequiredMessages', () => {
  beforeEach(() => {
    for (const key in registeredCallbacks) {
      delete registeredCallbacks[key]
    }
    jest.clearAllMocks()
  })

  it('calls listener immediately when no required messages', () => {
    const listener = jest.fn()
    onHandledAllRequiredMessages([], listener)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('calls listener after all required messages are handled', async () => {
    const listener = jest.fn().mockResolvedValue(undefined)
    const requiredMessages = ['msg1', 'msg2']
    onHandledAllRequiredMessages(requiredMessages, listener)

    if (registeredCallbacks['msg1']) {
      await registeredCallbacks['msg1']()
    }
    expect(listener).not.toHaveBeenCalled()

    if (registeredCallbacks['msg2']) {
      await registeredCallbacks['msg2']()
    }
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('ignores extra events after listener is called', async () => {
    const listener = jest.fn().mockResolvedValue(undefined)
    const requiredMessages = ['msg1']
    onHandledAllRequiredMessages(requiredMessages, listener)

    if (registeredCallbacks['msg1']) {
      await registeredCallbacks['msg1']()
    }
    expect(listener).toHaveBeenCalledTimes(1)

    if (registeredCallbacks['msg1']) {
      await registeredCallbacks['msg1']()
    }
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
