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
import { Injection } from '@/utils/inject/inject.types'
import { inject } from '@/utils/inject/inject'
import { Channel } from '@/common/types'
import { di, dispatcher } from '@/utils/setup-worker'
import { BroadcastService } from '@/modules/broadcast/internal/services/broadcast.service'
import {
  InternalBroadcastIdentifiers,
  InternalBroadcastServiceInterface
} from '@/modules/broadcast/internal/broadcast.types'

const injections: Injection[] = [
  {
    key: InternalBroadcastIdentifiers.service,
    use: BroadcastService
  }
]

export const setupInternalBroadcast = (): void => {
  inject(injections)
  const service = di.get<InternalBroadcastServiceInterface>(InternalBroadcastIdentifiers.service)
  chrome.runtime.onMessage.addListener((box, sender) => {
    if (box.channel === Channel.broadcast) {
      const { message, broadcast } = box
      const tabId = sender.tab?.id

      dispatcher().sendMessage(message).then()

      if (broadcast) {
        service.sendMessage(tabId, message)
      }
    }
  })
}

export const useInternalBroadcast = (): InternalBroadcastServiceInterface => di.get(InternalBroadcastIdentifiers.service)
