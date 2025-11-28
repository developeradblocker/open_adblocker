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
import { BroadcastService } from '@/modules/broadcast/internal/services/broadcast.service'
import { Channel } from '@/common/types'
import type { AppMessage } from '@/utils/dispatcher/dispatcher.types'

describe('BroadcastService (internal)', () => {
  const sendMessageMock = jest.fn()

  beforeEach(() => {
    sendMessageMock.mockClear()
    sendMessageMock.mockResolvedValue(undefined)
    global.chrome = {
      tabs: {
        sendMessage: sendMessageMock
      }
    } as any
  })

  it('sends broadcast boxes to chrome.tabs.sendMessage', () => {
    const service = new BroadcastService()
    const tabId = 42
    const message = { type: 'internal' } as AppMessage

    service.sendMessage(tabId, message)

    expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(1)
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(tabId, {
      broadcast: true,
      channel: Channel.broadcast,
      message
    })
  })
})
