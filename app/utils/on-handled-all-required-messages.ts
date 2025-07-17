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

import { dispatcher } from '@/utils/setup-worker'
import { SimpleListener } from '@/common/types'
import { AppMessage } from '@/utils/dispatcher/dispatcher.types'

/**
 * This utility calls a listener when all required messages have been handled.
 *
 * @param requiredMessages - a list of message types that must be handled before the listener is called
 * @param listener - a function to call when all required messages are handled
 */
export const onHandledAllRequiredMessages = (
  requiredMessages: string[],
  listener: SimpleListener
): void => {
  if (requiredMessages.length === 0) {
    listener()
    return
  }

  const handledMessages = new Set(requiredMessages)
  requiredMessages.forEach(messageType => {
    dispatcher().on<AppMessage>(messageType, async () => {
      await handleMessage(messageType, listener, handledMessages)
    }, false)
  })
}

export const handleMessage = async (
  messageType: string,
  listener: SimpleListener,
  requiredMessages: Set<string>
): Promise<void> => {
  if (!requiredMessages.has(messageType)) {
    // already handled
    return
  }
  requiredMessages.delete(messageType)

  if (!requiredMessages.size) {
    await listener()
  }
}
