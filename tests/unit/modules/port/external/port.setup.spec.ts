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
import { Connection } from '@/modules/port/external/port.types'
import { PortMessages } from '@/modules/port/common/port.messages'
import { Channel } from '@/common/types'

const mockDispatcher = {
  sendBox: jest.fn()
}

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn(() => mockDispatcher)
}))

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn()
}

jest.mock('@/utils/logger/logger', () => ({
  logger: mockLogger
}))

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234')
}))

describe('setupExternalPortChannel', () => {
  let mockPort: chrome.runtime.Port
  const connectMock = jest.fn()
  const addListenerMock = jest.fn()
  const removeListenerMock = jest.fn()
  const disconnectMock = jest.fn()
  const postMessageMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    mockPort = {
      name: 'testPort',
      postMessage: postMessageMock,
      onMessage: {
        addListener: addListenerMock,
        removeListener: removeListenerMock
      },
      disconnect: disconnectMock
    } as unknown as chrome.runtime.Port

    global.chrome = {
      runtime: {
        connect: connectMock
      }
    } as any
    connectMock.mockImplementation(() => mockPort)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns the same channel instance when called multiple times', () => {
    jest.isolateModules(() => {
      const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
      const options = { name: 'testChannel' }
      const channel1 = setupExternalPortChannel(options)
      const channel2 = setupExternalPortChannel(options)

      expect(channel1).toBe(channel2)
    })
  })

  describe('useExternalPort', () => {
    it('throws an error when accessing the channel without setup', () => {
      jest.isolateModules(() => {
        const { useExternalPort } = require('@/modules/port/external/port.setup')

        expect(() => useExternalPort()).toThrow(
          'Port channel is not set up. Please call "setupExternalPortChannel" first.'
        )
      })
    })

    it('returns the channel when it is set up', () => {
      jest.isolateModules(() => {
        const { setupExternalPortChannel, useExternalPort } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        const retrievedChannel = useExternalPort()

        expect(retrievedChannel).toBe(channel)
      })
    })
  })

  describe('establish', () => {
    it('does not establish connection if already connected', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)
        channel._connection = Connection.CONNECTED

        await channel.establish()

        expect(connectMock).not.toHaveBeenCalled()
      })
    })

    it('does not establish connection if already connecting', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)
        channel._connection = Connection.CONNECTING

        await channel.establish()

        expect(connectMock).not.toHaveBeenCalled()
      })
    })

    it('establishes connection successfully on first attempt', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        const establishPromise = channel.establish()

        // Simulate message listener being called to mark connection as CONNECTED
        const listener = addListenerMock.mock.calls[0][0]
        listener()

        jest.advanceTimersByTime(100)
        await establishPromise

        expect(connectMock).toHaveBeenCalledWith({ name: 'testChannel-test-uuid-1234' })
        expect(channel._connection).toBe(Connection.CONNECTED)
        expect(addListenerMock).toHaveBeenCalled()
        expect(removeListenerMock).toHaveBeenCalled()
        expect(mockLogger.info).toHaveBeenCalledWith(
          'Port "testChannel-test-uuid-1234" is connected'
        )
      })
    })

    it('retries connection if initial connection fails', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        let attemptCount = 0
        connectMock.mockImplementation(() => {
          attemptCount++
          return mockPort
        })

        const establishPromise = channel.establish()

        // First attempt - no message received (stays CONNECTING)
        await jest.advanceTimersByTimeAsync(100)

        // Verify retry happened - first connection was disconnected
        expect(disconnectMock).toHaveBeenCalled()
        expect(attemptCount).toBeGreaterThan(1)

        // Trigger connection on the latest attempt
        const latestListenerIndex = addListenerMock.mock.calls.length - 2
        if (latestListenerIndex >= 0) {
          const listener = addListenerMock.mock.calls[latestListenerIndex][0]
          listener()
        }
        await jest.advanceTimersByTimeAsync(100)

        await establishPromise

        expect(channel._connection).toBe(Connection.CONNECTED)
      })
    })

    it('resolves pending promises after connection is established', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        const resolver1 = jest.fn()
        const resolver2 = jest.fn()
        channel._resolvers.push(resolver1, resolver2)

        const establishPromise = channel.establish()

        const listener = addListenerMock.mock.calls[0][0]
        listener()

        jest.advanceTimersByTime(100)
        await establishPromise

        expect(resolver1).toHaveBeenCalled()
        expect(resolver2).toHaveBeenCalled()
        expect(channel._resolvers).toEqual([])
      })
    })

    it('sets up message listener for incoming messages', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        const establishPromise = channel.establish()

        const listener = addListenerMock.mock.calls[0][0]
        listener()

        jest.advanceTimersByTime(100)
        await establishPromise

        // Check that a message listener was added (after connection)
        expect(addListenerMock).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('sendMessage', () => {
    it('establishes connection if disconnected before sending', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        const message = { type: 'test.message' }
        const sendPromise = channel.sendMessage(message)

        // Simulate connection establishment
        const listener = addListenerMock.mock.calls[0][0]
        listener()
        await jest.advanceTimersByTimeAsync(100)

        // Simulate response
        const messageListener = addListenerMock.mock.calls[1][0]
        messageListener({
          id: 'test-uuid-1234',
          port: 'testChannel-test-uuid-1234',
          channel: Channel.port,
          message: {
            type: PortMessages.response,
            payload: { result: 'success' }
          }
        })

        const result = await sendPromise
        expect(result).toEqual({ result: 'success' })
        expect(postMessageMock).toHaveBeenCalled()
      })
    })

    it('waits for connection if already connecting', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        // Start establishing connection
        channel.establish()

        // Try to send message while connecting
        const message = { type: 'test.message' }
        const sendPromise = channel.sendMessage(message)

        // Complete connection
        const listener = addListenerMock.mock.calls[0][0]
        listener()
        await jest.advanceTimersByTimeAsync(100)

        // Simulate response
        const messageListener = addListenerMock.mock.calls[1][0]
        messageListener({
          id: 'test-uuid-1234',
          port: 'testChannel-test-uuid-1234',
          channel: Channel.port,
          message: {
            type: PortMessages.response,
            payload: { result: 'success' }
          }
        })

        const result = await sendPromise
        expect(result).toEqual({ result: 'success' })
      })
    })

    it('sends message with correct box structure', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        // Establish connection first
        const establishPromise = channel.establish()
        const listener = addListenerMock.mock.calls[0][0]
        listener()
        jest.advanceTimersByTime(100)
        await establishPromise

        const message = { type: 'test.message', payload: { data: 'test' } }
        const sendPromise = channel.sendMessage(message)

        expect(postMessageMock).toHaveBeenCalledWith({
          port: 'testChannel-test-uuid-1234',
          channel: Channel.port,
          id: 'test-uuid-1234',
          message
        })

        // Simulate response
        const messageListener = addListenerMock.mock.calls[1][0]
        messageListener({
          id: 'test-uuid-1234',
          port: 'testChannel-test-uuid-1234',
          channel: Channel.port,
          message: {
            type: PortMessages.response,
            payload: { result: 'success' }
          }
        })

        await sendPromise
      })
    })

    it('re-establishes connection on postMessage error', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        // Establish connection first
        const establishPromise = channel.establish()
        const listener = addListenerMock.mock.calls[0][0]
        listener()
        await jest.advanceTimersByTimeAsync(100)
        await establishPromise

        // Make postMessage throw error on first call
        postMessageMock.mockImplementationOnce(() => {
          throw new Error('Connection lost')
        })

        const message = { type: 'test.message' }
        const sendPromise = channel.sendMessage(message)

        // Wait for re-establishment
        await Promise.resolve()
        const reconnectListener = addListenerMock.mock.calls[2][0]
        reconnectListener()
        await jest.advanceTimersByTimeAsync(100)

        expect(channel._connection).toBe(Connection.CONNECTED)
        expect(postMessageMock).toHaveBeenCalledTimes(2)

        // Simulate response
        const messageListener = addListenerMock.mock.calls[3][0]
        messageListener({
          id: 'test-uuid-1234',
          port: 'testChannel-test-uuid-1234',
          channel: Channel.port,
          message: {
            type: PortMessages.response,
            payload: { result: 'success' }
          }
        })

        await sendPromise
      })
    })

    it('handles response message correctly', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        // Establish connection
        const establishPromise = channel.establish()
        const listener = addListenerMock.mock.calls[0][0]
        listener()
        jest.advanceTimersByTime(100)
        await establishPromise

        const message = { type: 'test.message' }
        const sendPromise = channel.sendMessage(message)

        // Simulate response
        const messageListener = addListenerMock.mock.calls[1][0]
        messageListener({
          id: 'test-uuid-1234',
          port: 'testChannel-test-uuid-1234',
          channel: Channel.port,
          message: {
            type: PortMessages.response,
            payload: { data: 'response data' }
          }
        })

        const result = await sendPromise
        expect(result).toEqual({ data: 'response data' })
        expect(channel._waiters.size).toBe(0)
      })
    })
  })

  describe('message listener', () => {
    it('ignores messages with different port name', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        // Establish connection
        const establishPromise = channel.establish()
        const listener = addListenerMock.mock.calls[0][0]
        listener()
        jest.advanceTimersByTime(100)
        await establishPromise

        const messageListener = addListenerMock.mock.calls[1][0]
        messageListener({
          id: 'test-uuid-1234',
          port: 'different-port-name',
          channel: Channel.port,
          message: { type: 'test.message' }
        })

        expect(mockDispatcher.sendBox).not.toHaveBeenCalled()
      })
    })

    it('handles greeting message', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        // Establish connection
        const establishPromise = channel.establish()
        const listener = addListenerMock.mock.calls[0][0]
        listener()
        jest.advanceTimersByTime(100)
        await establishPromise

        const messageListener = addListenerMock.mock.calls[1][0]
        messageListener({
          id: 'test-uuid-1234',
          port: 'testChannel-test-uuid-1234',
          channel: Channel.port,
          message: { type: PortMessages.greeting }
        })

        expect(mockLogger.info).toHaveBeenCalledWith(
          'Port "testChannel-test-uuid-1234" established connection'
        )
        expect(mockDispatcher.sendBox).not.toHaveBeenCalled()
      })
    })

    it('warns when response received with no registered handler', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        // Establish connection
        const establishPromise = channel.establish()
        const listener = addListenerMock.mock.calls[0][0]
        listener()
        jest.advanceTimersByTime(100)
        await establishPromise

        const messageListener = addListenerMock.mock.calls[1][0]
        messageListener({
          id: 'unknown-id',
          port: 'testChannel-test-uuid-1234',
          channel: Channel.port,
          message: {
            type: PortMessages.response,
            payload: { data: 'test' }
          }
        })

        expect(mockLogger.warn).toHaveBeenCalledWith(
          'Port: Box received with no registered handler for "unknown-id"'
        )
      })
    })

    it('dispatches non-response messages and sends response back', async () => {
      await jest.isolateModulesAsync(async () => {
        const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
        const options = { name: 'testChannel' }
        const channel = setupExternalPortChannel(options)

        mockDispatcher.sendBox.mockResolvedValue({ result: 'dispatched' })

        // Establish connection
        const establishPromise = channel.establish()
        const listener = addListenerMock.mock.calls[0][0]
        listener()
        jest.advanceTimersByTime(100)
        await establishPromise

        const messageListener = addListenerMock.mock.calls[1][0]
        const incomingBox = {
          id: 'incoming-id',
          port: 'testChannel-test-uuid-1234',
          channel: Channel.port,
          message: { type: 'custom.message', payload: { data: 'test' } }
        }

        messageListener(incomingBox)
        await Promise.resolve()

        expect(mockDispatcher.sendBox).toHaveBeenCalledWith(incomingBox)
        expect(postMessageMock).toHaveBeenCalledWith({
          id: 'incoming-id',
          port: 'testChannel-test-uuid-1234',
          channel: Channel.port,
          message: {
            type: PortMessages.response,
            payload: { result: 'dispatched' }
          }
        })
      })
    })
  })
})
