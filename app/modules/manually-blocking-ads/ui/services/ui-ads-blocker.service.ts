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
import { inject, injectable } from '@/utils/di/di.types'
import {
  ContentBroadcastIdentifiers,
  ContentBroadcastServiceInterface
} from '@/modules/broadcast/content/broadcast.types'
import {
  ManuallyBlockingAdsBlockElementMessage,
  ManuallyBlockingAdsChangeElementMessage, ManuallyBlockingAdsCloseMessage,
  ManuallyBlockingAdsEnterPreviewMessage,
  ManuallyBlockingAdsExitPreviewMessage,
  ManuallyBlockingAdsMessages,
  ManuallyBlockingAdsSelectElementMessage,
  ManuallyBlockingAdsStopMessage
} from '@/modules/manually-blocking-ads/common/manually-blocking-ads.messages'

@injectable()
export class UiAdsBlockerService {
  constructor (
    @inject(ContentBroadcastIdentifiers.service)
    private readonly broadcast: ContentBroadcastServiceInterface
  ) {
  }

  stop (): void {
    const message: ManuallyBlockingAdsStopMessage = {
      type: ManuallyBlockingAdsMessages.stop
    }
    this.broadcast.sendMessageToIframes(message)
  }

  startSelecting (): void {
    const message: ManuallyBlockingAdsSelectElementMessage = {
      type: ManuallyBlockingAdsMessages.selectElement
    }
    this.broadcast.sendMessageToIframes(message)
  }

  changeElement (newIndex: number): void {
    const message: ManuallyBlockingAdsChangeElementMessage = {
      type: ManuallyBlockingAdsMessages.changeElement,
      payload: { newIndex }
    }
    this.broadcast.sendMessageToIframes(message)
  }

  enterPreview (): void {
    const message: ManuallyBlockingAdsEnterPreviewMessage = {
      type: ManuallyBlockingAdsMessages.enterPreview
    }
    this.broadcast.sendMessageToIframes(message)
  }

  exitPreview (): void {
    const message: ManuallyBlockingAdsExitPreviewMessage = {
      type: ManuallyBlockingAdsMessages.exitPreview
    }
    this.broadcast.sendMessageToIframes(message)
  }

  close (): void {
    const message: ManuallyBlockingAdsCloseMessage = {
      type: ManuallyBlockingAdsMessages.close
    }
    this.broadcast.sendMessageToIframes(message)
  }

  blockElement (allWebsites: boolean, blockSimilar: boolean): void {
    const message: ManuallyBlockingAdsBlockElementMessage = {
      type: ManuallyBlockingAdsMessages.blockElement,
      payload: {
        allWebsites,
        blockSimilar
      }
    }
    this.broadcast.sendMessageToIframes(message)
  }
}
