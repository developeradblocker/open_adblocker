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
import { injectable } from '@/utils/di/di.types'
import { AppMessageListener, Box } from '@/utils/dispatcher/dispatcher.types'
import {
  ManualBlockingElementSelectedMessage,
  ManualBlockingMessages
} from '@/modules/features/manual-blocking/common/manual-blocking.messages'
import router from '@/ui/manual-blocking/router'
import { Route } from '@/ui/manual-blocking/router/route-names'

@injectable()
export class ElementSelectedListener implements AppMessageListener<ManualBlockingElementSelectedMessage> {
  on (): ManualBlockingMessages.elementSelected {
    return ManualBlockingMessages.elementSelected
  }

  main (): false {
    return false
  }

  async handle ({ message }: Box<ManualBlockingElementSelectedMessage>): Promise<void> {
    await router.push({
      name: Route.selection,
      query: {
        elementIndex: message.payload.elementIndex,
        elementsInTraversedTree: message.payload.elementsInTraversedTree
      }
    })
  }
}
