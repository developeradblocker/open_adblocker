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
  ManuallyBlockingAdsMessages,
  ManuallyBlockingAdsStartMessage, ManuallyBlockingAdsStopMessage
} from '@/modules/manually-blocking-ads/common/manually-blocking-ads.messages'
import { logger } from '@/utils/logger/logger'
import {
  InternalManuallyBlockingAdsServiceInterface
} from '@/modules/manually-blocking-ads/internal/manually-blocking-ads.types'
import {
  InternalBroadcastIdentifiers,
  InternalBroadcastServiceInterface
} from '@/modules/broadcast/internal/broadcast.types'

@injectable()
export class ManuallyBlockingAdsService implements InternalManuallyBlockingAdsServiceInterface {
  constructor (
    @inject(InternalBroadcastIdentifiers.service)
    private readonly broadcast: InternalBroadcastServiceInterface
  ) {
  }

  async start (): Promise<void> {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tabs.length) {
      logger.warn('No active tab found')
    }
    const message: ManuallyBlockingAdsStartMessage = {
      type: ManuallyBlockingAdsMessages.start,
      payload: { tabId: tabs[0].id }
    }
    this.broadcast.sendMessage(message.payload.tabId, message)
  }

  async stop (): Promise<void> {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tabs.length) {
      logger.warn('No active tab found')
    }
    const message: ManuallyBlockingAdsStopMessage = {
      type: ManuallyBlockingAdsMessages.stop
    }
    this.broadcast.sendMessage(tabs[0].id, message)
  }
}
