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
import { setupContentBroadcast, useContentBroadcast } from '@/modules/broadcast/content/broadcast.setup'
import { inject } from '@/utils/inject/inject'
import { dispatcher, di } from '@/utils/setup-worker'
import { Channel } from '@/common/types'
import { ContentBroadcastIdentifiers, type ContentBroadcastServiceInterface } from '@/modules/broadcast/content/broadcast.types'
import { BroadcastService } from '@/modules/broadcast/content/services/broadcast.service'

jest.mock('@/utils/inject/inject', () => ({
  inject: jest.fn()
}))

jest.mock('@/utils/setup-worker', () => ({
  di: { get: jest.fn() },
  dispatcher: jest.fn()
}))

describe('setupContentBroadcast', () => {
  const addListenerMock = jest.fn()

  beforeEach(() => {
    addListenerMock.mockClear()
    jest.clearAllMocks()
    global.chrome = {
      runtime: {
        onMessage: {
          addListener: addListenerMock
        }
      }
    } as any
  })

  it('injects content broadcast services and registers the runtime listener', () => {
    setupContentBroadcast()

    expect(inject).toHaveBeenCalledWith([
      {
        key: ContentBroadcastIdentifiers.service,
        use: BroadcastService
      }
    ])
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledTimes(1)
  })

  it('forwards only broadcast channel boxes to the dispatcher', () => {
    const sendBoxMock = jest.fn().mockResolvedValue(undefined)
    jest.mocked(dispatcher).mockReturnValue({
      sendBox: sendBoxMock
    } as any)

    setupContentBroadcast()

    const listener = addListenerMock.mock.calls[0][0]
    const broadcastBox = { channel: Channel.broadcast } as any
    const otherBox = { channel: Channel.port } as any

    listener(otherBox)
    expect(sendBoxMock).not.toHaveBeenCalled()

    listener(broadcastBox)
    expect(sendBoxMock).toHaveBeenCalledTimes(1)
    expect(sendBoxMock).toHaveBeenCalledWith(broadcastBox)
  })
})

describe('useContentBroadcast', () => {
  it('returns the broadcast service from the DI container', () => {
    const service = {} as ContentBroadcastServiceInterface
    jest.mocked(di.get).mockReturnValue(service)

    const result = useContentBroadcast()

    expect(result).toBe(service)
    expect(di.get).toHaveBeenCalledWith(ContentBroadcastIdentifiers.service)
  })
})
