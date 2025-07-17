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
import { setupInternalPortChannel } from '@/modules/port/internal/port.setup'
import { logger } from '@/utils/logger/logger'
import { AppMessage } from '@/utils/dispatcher/dispatcher.types'
import { dispatcher } from '@/utils/setup-worker'
import { Dispatcher } from '@/utils/dispatcher/dispatcher'

const sendMessageMock = jest.fn()

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))
jest.mock('@/utils/logger/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn()
  }
}))

describe('setupInternalPortChannel', () => {
  let mockPort: chrome.runtime.Port

  beforeEach(() => {
    jest.clearAllMocks()
    const mockedDispatcher = {
      sendMessage: sendMessageMock
    } as unknown as Dispatcher
    jest.mocked(dispatcher).mockReturnValue(mockedDispatcher)
    mockPort = {
      name: 'testPort',
      postMessage: jest.fn(),
      onMessage: { addListener: jest.fn(), removeListener: jest.fn() },
      onDisconnect: { addListener: jest.fn() }
    } as unknown as chrome.runtime.Port

    global.chrome = {
      runtime: {
        onConnect: {
          addListener: jest.fn((callback: (port: chrome.runtime.Port) => void) => callback(mockPort))
        }
      }
    } as any
    setupInternalPortChannel()
  })

  it('rejects pending promises when a port is disconnected before a response is received', async () => {
    const channel = setupInternalPortChannel()
    channel._ports.set('testPort', mockPort)
    channel._scopes.set('testPort', new Map([['testId', { resolve: jest.fn(), reject: jest.fn() }]]))

    // @ts-ignore
    jest.mocked(mockPort.onDisconnect.addListener).mock.calls[0][0]()

    expect(channel._scopes.get('testPort')).toBeUndefined()
    expect(logger.info).toHaveBeenCalledWith('Port "testPort" is disconnected')
  })

  it('does not send a response if the port is no longer open', async () => {
    await jest.isolateModulesAsync(async () => {
      const { setupInternalPortChannel, useInternalPort } = require('@/modules/port/internal/port.setup')
      setupInternalPortChannel()
      const channel = useInternalPort()
      channel._ports.delete('testPort')

      const box: AppMessage = {
        type: 'response'
      }
      jest.mocked(mockPort.postMessage).mockClear()
      try {
        await channel.sendMessage('testPort', box)
      } catch (e: any) {
        expect(e.message).toBe('Port "testPort" was not found')
        expect(mockPort.postMessage).not.toHaveBeenCalled()
      }
    })
  })

  it('handles multiple ports and sends messages to all connected ports', async () => {
    await jest.isolateModulesAsync(async () => {
      const { setupInternalPortChannel, useInternalPort } = require('@/modules/port/internal/port.setup')
      setupInternalPortChannel()
      const channel = useInternalPort()
      const mockPort1 = {
        name: 'port1',
        postMessage: jest.fn(),
        onMessage: { addListener: jest.fn() }
      } as unknown as chrome.runtime.Port

      channel._ports.set('port1', mockPort1)
      jest.spyOn(channel, 'sendMessage').mockResolvedValue(undefined)
      await channel.sendMessageToAllPorts({ type: 'broadcastMessage' })
      expect(channel.sendMessage).toHaveBeenCalledTimes(2)
      expect(channel.sendMessage).toHaveBeenNthCalledWith(1, 'testPort', { type: 'broadcastMessage' })
      expect(channel.sendMessage).toHaveBeenNthCalledWith(2, 'port1', { type: 'broadcastMessage' })
    })
  })

  it('throws an error when attempting to send a message to a non-existent port', async () => {
    const channel = setupInternalPortChannel()

    await expect(channel.sendMessage('nonExistentPort', { type: 'testMessage' })).rejects.toThrow(
      'Port "nonExistentPort" was not found'
    )
  })
})
