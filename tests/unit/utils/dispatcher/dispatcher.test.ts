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
import { LoggerInterface } from '@/utils/logger/logger.types'
import { Di } from '@/utils/di/di'
import { AppMessage } from '@/utils/dispatcher/dispatcher.types'
import { Dispatcher } from '@/utils/dispatcher/dispatcher'

describe('Dispatcher', () => {
  let mockDi: Di
  let mockLogger: LoggerInterface
  let dispatcher: Dispatcher
  const resolveMock = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    mockDi = { resolve: resolveMock } as unknown as Di
    mockLogger = {
      groupCollapsed: jest.fn(),
      info: jest.fn(),
      groupEnd: jest.fn(),
      error: jest.fn()
    } as unknown as LoggerInterface
    dispatcher = new Dispatcher(mockDi as any, mockLogger as any)
  })

  it('registers a listener with onWithClass and returns its id', () => {
    class TestListener {
      on = jest.fn(() => 'testMessage')
      handle = jest.fn()
      main = jest.fn(() => true)
      sync = jest.fn(() => true)
    }
    resolveMock.mockReturnValue(new TestListener())

    const listenerId = dispatcher.onWithClass(TestListener)

    expect(listenerId).toBeGreaterThan(0)
    expect(mockDi.resolve).toHaveBeenCalledWith(TestListener)
  })

  it('throws an error when registering the same listener class twice', () => {
    class TestListener {
      on = jest.fn(() => 'testMessage')
      handle = jest.fn()
      main = jest.fn(() => true)
      sync = jest.fn(() => true)
    }
    resolveMock.mockReturnValue(new TestListener())

    dispatcher.onWithClass(TestListener)

    expect(() => dispatcher.onWithClass(TestListener)).toThrow(
      'This listener(class) TestListener is already registered'
    )
  })

  it('removes a listener by its id', () => {
    const listenerId = dispatcher.on<AppMessage>('testMessage', jest.fn(), false)

    dispatcher.remove(listenerId)

    expect(dispatcher.has(listenerId)).toBe(false)
  })

  it('throws an error when removing a non-existent listener', () => {
    expect(() => dispatcher.remove(999)).toThrow(
      'Listener with id "999" not exist'
    )
  })

  it('sends a message', async () => {
    await jest.isolateModulesAsync(async () => {
      const dispatcher = new Dispatcher(mockDi as any, mockLogger as any)

      const callback = jest.fn().mockResolvedValue(true)
      dispatcher.on<AppMessage>('testMessage', callback, false)
      await dispatcher.work()
      const result = dispatcher.sendMessage({ type: 'testMessage' })

      await expect(result).resolves.toBeUndefined()
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({ message: { type: 'testMessage' } }))
    })
  })

  it('throws an error when registering an async main listener', () => {
    const dispatcher = new Dispatcher(mockDi as any, mockLogger as any)
    // @ts-ignore
    expect(() => dispatcher.on('testMessage', jest.fn(), true, false)).toThrow(
      'a main listener cannot be async for message "testMessage"'
    )
  })

  it('processes pending messages when work is called', async () => {
    await jest.isolateModulesAsync(async () => {
      const dispatcher = new Dispatcher(mockDi, mockLogger)

      const callback = jest.fn().mockResolvedValue(true)
      dispatcher.on<AppMessage>('testMessage', callback, false)

      const promise = dispatcher.sendMessage({ type: 'testMessage' })
      await dispatcher.work()

      await expect(promise).resolves.toBeUndefined()
      expect(callback).toHaveBeenCalled()
    })
  })

  it('should handle "onAfter" hooks', async () => {
    await jest.isolateModulesAsync(async () => {
      const dispatcher = new Dispatcher(mockDi as any, mockLogger as any)
      const message = { type: 'testMessage' }
      const callback = jest.fn()
      const afterCb1 = jest.fn()
      const afterCb2 = jest.fn()
      const afterCb3 = jest.fn()
      dispatcher.on<AppMessage>('testMessage', callback, false)

      await dispatcher.work()

      await dispatcher.sendMessage(message)
      expect(afterCb1).not.toHaveBeenCalled()
      dispatcher.onAfter<AppMessage>('testMessage', afterCb1)
      dispatcher.onAfter<AppMessage>('testMessage', afterCb2)
      dispatcher.onAfter<AppMessage>('testMessage-2', afterCb3)
      await dispatcher.sendMessage(message)
      expect(afterCb1).toHaveBeenCalledTimes(1)
      expect(afterCb1).toHaveBeenCalledWith({ channel: 'internal', message })
      expect(afterCb2).toHaveBeenCalledTimes(1)
      expect(afterCb2).toHaveBeenCalledWith({ channel: 'internal', message })
      expect(afterCb3).not.toHaveBeenCalled()
    })
  })
})
