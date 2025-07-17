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
import { setupExternalPortChannel } from '@/modules/port/external/port.setup'
import { Connection } from '@/modules/port/external/port.types'

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn(() => ({
    sendBox: jest.fn()
  }))
}))

jest.mock('@/utils/logger/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn() }
}))

describe('setupExternalPortChannel', () => {
  let mockPort: chrome.runtime.Port
  const connectMock = jest.fn()
  const addListenerMock = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    mockPort = {
      name: 'testPort',
      postMessage: jest.fn(),
      onMessage: {
        addListener: addListenerMock,
        removeListener: jest.fn()
      },
      disconnect: jest.fn()
    } as unknown as chrome.runtime.Port

    global.chrome = {
      runtime: {
        connect: connectMock
      }
    } as any
    connectMock.mockImplementation(() => mockPort)
  })

  it('returns the same channel instance when called multiple times', () => {
    jest.isolateModules(() => {
      const options = { name: 'testChannel' }
      const channel1 = setupExternalPortChannel(options)
      const channel2 = setupExternalPortChannel(options)

      expect(channel1).toBe(channel2)
    })
  })

  it('retries connection if initial connection fails', async () => {
    await jest.isolateModulesAsync(async () => {
      const { setupExternalPortChannel } = require('@/modules/port/external/port.setup')
      const options = { name: 'testChannel' }
      const channel = setupExternalPortChannel(options)
      channel._connection = Connection.CONNECTED

      const connectSpy = jest.spyOn(channel, 'establish').mockResolvedValueOnce(true)

      await channel.establish()

      expect(connectSpy).toHaveBeenCalled()
      expect(channel._connection).toBe(Connection.CONNECTED)
    })
  })

  it('throws an error when accessing the channel without setup', () => {
    jest.isolateModules(() => {
      const { useExternalPort } = require('@/modules/port/external/port.setup')

      try {
        useExternalPort()
      } catch (e: any) {
        expect(e.message).toEqual('Port channel is not set up. Please call "setupExternalPortChannel" first.')
      }
    })
  })
})
