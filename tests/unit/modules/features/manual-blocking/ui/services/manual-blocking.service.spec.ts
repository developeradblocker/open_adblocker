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
import { ManualBlockingService } from '@/modules/features/manual-blocking/ui/services/manual-blocking.service'
import { ContentBroadcastServiceInterface } from '@/modules/broadcast/content/broadcast.types'
import { ManualBlockingMessages } from '@/modules/features/manual-blocking/common/manual-blocking.messages'

describe('ManualBlockingService (UI)', () => {
  const broadcast: jest.Mocked<ContentBroadcastServiceInterface> = {
    sendMessage: jest.fn(),
    sendMessageToIframes: jest.fn()
  } as any
  let service: ManualBlockingService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new ManualBlockingService(broadcast)
  })

  it('sends stop and selection commands to iframes', () => {
    service.stop()
    expect(broadcast.sendMessageToIframes).toHaveBeenCalledWith({ type: ManualBlockingMessages.stop })

    service.startSelecting()
    expect(broadcast.sendMessageToIframes).toHaveBeenCalledWith({ type: ManualBlockingMessages.selectElement })
  })

  it('changes element, enters/exits preview, and closes via iframe broadcasts', () => {
    service.changeElement(2)
    expect(broadcast.sendMessageToIframes).toHaveBeenCalledWith({
      type: ManualBlockingMessages.changeElement,
      payload: { newIndex: 2 }
    })

    service.enterPreview()
    service.exitPreview()
    service.close()

    expect(broadcast.sendMessageToIframes).toHaveBeenCalledWith({ type: ManualBlockingMessages.enterPreview })
    expect(broadcast.sendMessageToIframes).toHaveBeenCalledWith({ type: ManualBlockingMessages.exitPreview })
    expect(broadcast.sendMessageToIframes).toHaveBeenCalledWith({ type: ManualBlockingMessages.close })
  })

  it('blocks element and resets rules with the right channels', () => {
    service.blockElement(true, false)
    expect(broadcast.sendMessageToIframes).toHaveBeenCalledWith({
      type: ManualBlockingMessages.blockElement,
      payload: {
        allWebsites: true,
        blockSimilar: false
      }
    })

    service.resetRules(['a'])
    expect(broadcast.sendMessage).toHaveBeenCalledWith({
      type: ManualBlockingMessages.resetRules,
      payload: { rules: ['a'] }
    })
  })
})
