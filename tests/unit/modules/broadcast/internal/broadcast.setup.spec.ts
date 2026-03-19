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
import { setupInternalBroadcast, useInternalBroadcast } from '@/modules/broadcast/internal/broadcast.setup'
import { inject } from '@/utils/inject/inject'
import { dispatcher, di } from '@/utils/setup-worker'
import { Channel } from '@/common/types'
import {
  InternalBroadcastIdentifiers,
  type InternalBroadcastServiceInterface
} from '@/modules/broadcast/internal/broadcast.types'
import { BroadcastService } from '@/modules/broadcast/internal/services/broadcast.service'

jest.mock('@/utils/inject/inject', () => ({
  inject: jest.fn()
}))

jest.mock('@/utils/setup-worker', () => ({
  di: {
    get: jest.fn()
  },
  dispatcher: jest.fn()
}))

describe('setupInternalBroadcast', () => {
  const addListenerMock = jest.fn()
  const serviceMock: InternalBroadcastServiceInterface = {
    sendMessage: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    addListenerMock.mockClear()
    ;(serviceMock.sendMessage as jest.Mock).mockClear()
    global.chrome = {
      runtime: {
        onMessage: {
          addListener: addListenerMock
        }
      }
    } as any
    jest.mocked(di.get).mockReturnValue(serviceMock)
  })

  it('injects dependencies, resolves service and subscribes to runtime messages', () => {
    setupInternalBroadcast()

    expect(inject).toHaveBeenCalledWith([
      {
        key: InternalBroadcastIdentifiers.service,
        use: BroadcastService
      }
    ])
    expect(di.get).toHaveBeenCalledWith(InternalBroadcastIdentifiers.service)
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledTimes(1)
  })

  it('forwards broadcast messages to dispatcher and optionally rebroadcasts to iframes', () => {
    const sendMessageMock = jest.fn().mockResolvedValue(undefined)
    jest.mocked(dispatcher).mockReturnValue({
      sendMessage: sendMessageMock
    } as any)

    setupInternalBroadcast()

    const listener = addListenerMock.mock.calls[0][0]
    const message = { type: 'broadcast' } as any

    // non-broadcast channel is ignored
    listener({ channel: Channel.port }, {})
    expect(sendMessageMock).not.toHaveBeenCalled()
    expect(serviceMock.sendMessage).not.toHaveBeenCalled()

    // broadcast without iframe rebroadcast
    listener({ channel: Channel.broadcast, message, broadcast: false }, { tab: { id: 123 } } as any)
    expect(sendMessageMock).toHaveBeenCalledTimes(1)
    expect(sendMessageMock).toHaveBeenCalledWith(message)
    expect(serviceMock.sendMessage).not.toHaveBeenCalled()

    // broadcast with iframe rebroadcast, missing tab id should still call service
    listener({ channel: Channel.broadcast, message, broadcast: true }, { tab: {} } as any)
    expect(serviceMock.sendMessage).toHaveBeenCalledWith(undefined, message)
  })
})

describe('useInternalBroadcast', () => {
  it('returns the broadcast service from DI', () => {
    const service = {} as InternalBroadcastServiceInterface
    jest.mocked(di.get).mockReturnValue(service)

    const result = useInternalBroadcast()

    expect(result).toBe(service)
    expect(di.get).toHaveBeenCalledWith(InternalBroadcastIdentifiers.service)
  })
})
