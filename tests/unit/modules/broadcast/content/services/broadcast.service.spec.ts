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
import { BroadcastService } from '@/modules/broadcast/content/services/broadcast.service'
import { Channel } from '@/common/types'
import type { AppMessage } from '@/utils/dispatcher/dispatcher.types'

describe('BroadcastService (content)', () => {
  const sendMessageMock = jest.fn()

  beforeEach(() => {
    sendMessageMock.mockClear()
    sendMessageMock.mockResolvedValue(undefined)
    global.chrome = {
      runtime: {
        sendMessage: sendMessageMock
      }
    } as any
  })

  it('sendMessage sends message to the broadcast channel without iframe propagation', () => {
    const service = new BroadcastService()
    const message = { type: 'test-message' } as AppMessage

    service.sendMessage(message)

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1)
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      broadcast: false,
      channel: Channel.broadcast,
      message
    })
  })

  it('sendMessageToIframes sends message to the broadcast channel and enables iframe propagation', () => {
    const service = new BroadcastService()
    const message = { type: 'iframe-message' } as AppMessage

    service.sendMessageToIframes(message)

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1)
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      broadcast: true,
      channel: Channel.broadcast,
      message
    })
  })
})
