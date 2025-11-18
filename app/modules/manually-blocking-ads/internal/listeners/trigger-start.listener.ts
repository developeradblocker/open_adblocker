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
import { AppMessageListener, Box } from '@/utils/dispatcher/dispatcher.types'
import {
  ManuallyBlockingAdsMessages,
  ManuallyBlockingAdsStartMessage, ManuallyBlockingAdsTriggerStartMessage
} from '@/modules/manually-blocking-ads/common/manually-blocking-ads.messages'
import { inject, injectable } from '@/utils/di/di.types'
import {
  InternalBroadcastIdentifiers,
  InternalBroadcastServiceInterface
} from '@/modules/broadcast/internal/broadcast.types'
import {
  InternalManuallyBlockingAdsIdentifiers,
  InternalManuallyBlockingAdsServiceInterface
} from '@/modules/manually-blocking-ads/internal/manually-blocking-ads.types'

@injectable()
export class TriggerStartManualAdBlockingListener implements AppMessageListener<ManuallyBlockingAdsTriggerStartMessage> {
  constructor (
    @inject(InternalBroadcastIdentifiers.service)
    private readonly broadcast: InternalBroadcastServiceInterface,

    @inject(InternalManuallyBlockingAdsIdentifiers.service)
    private readonly service: InternalManuallyBlockingAdsServiceInterface
  ) {}

  on (): ManuallyBlockingAdsMessages.triggerStart {
    return ManuallyBlockingAdsMessages.triggerStart
  }

  main (): false {
    return false
  }

  async handle ({ message }: Box<ManuallyBlockingAdsTriggerStartMessage>): Promise<void> {
    const appliedRules = (await this.service.getUserRules())
      .filter((rule: string) => {
        const currentDomain = (new URL(message.payload.url)).host.replace('www.', '').replace(/:\d+/, '')
        const availableDomains = ['', currentDomain]
        return availableDomains.includes(rule.split('##')[0])
      })

    const startMessage: ManuallyBlockingAdsStartMessage = {
      type: ManuallyBlockingAdsMessages.start,
      payload: {
        tabId: message.payload.tabId,
        appliedRules
      }
    }
    this.broadcast.sendMessage(message.payload.tabId, startMessage)
  }
}
