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
