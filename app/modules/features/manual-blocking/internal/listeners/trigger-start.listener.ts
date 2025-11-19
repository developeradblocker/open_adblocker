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
import { AppMessageListener } from '@/utils/dispatcher/dispatcher.types'
import {
  ManualBlockingMessages,
  ManualBlockingStartMessage,
  ManualBlockingTriggerStartMessage
} from '@/modules/features/manual-blocking/common/manual-blocking.messages'
import { inject, injectable } from '@/utils/di/di.types'
import {
  InternalBroadcastIdentifiers,
  InternalBroadcastServiceInterface
} from '@/modules/broadcast/internal/broadcast.types'
import {
  InternalManualBlockingIdentifiers,
  InternalManualBlockingServiceInterface
} from '@/modules/features/manual-blocking/internal/manual-blocking.types'
import { logger } from '@/utils/logger/logger'

@injectable()
export class TriggerStartManualBlockingListener implements AppMessageListener<ManualBlockingTriggerStartMessage> {
  constructor (
    @inject(InternalBroadcastIdentifiers.service)
    private readonly broadcast: InternalBroadcastServiceInterface,

    @inject(InternalManualBlockingIdentifiers.service)
    private readonly service: InternalManualBlockingServiceInterface
  ) {}

  on (): ManualBlockingMessages.triggerStart {
    return ManualBlockingMessages.triggerStart
  }

  main (): false {
    return false
  }

  async handle (): Promise<void> {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tabs.length) {
      logger.warn('No active tab found')
      return
    }

    const appliedRules = (await this.service.getUserRules())
      .filter((rule: string) => {
        const currentDomain = (new URL(tabs[0].url)).host.replace('www.', '').replace(/:\d+/, '')
        const availableDomains = ['', currentDomain]
        return availableDomains.includes(rule.split('##')[0])
      })

    const startMessage: ManualBlockingStartMessage = {
      type: ManualBlockingMessages.start,
      payload: {
        tabId: tabs[0].id,
        appliedRules
      }
    }
    this.broadcast.sendMessage(tabs[0].id, startMessage)
  }
}
