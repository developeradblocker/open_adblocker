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
import { AppMessage } from '@/utils/dispatcher/dispatcher.types'

export enum ContentBroadcastIdentifiers {
  service = 'service'
}

export interface ContentBroadcastServiceInterface {
  /**
   * Sends message to service worker
   * @param {AppMessage} message
   */
  sendMessage: (message: AppMessage) => void

  /**
   * Sends message to service worker and then broadcast it to all iframes on sender's tab
   * @param {AppMessage} message
   */
  sendMessageToIframes: (message: AppMessage) => void
}
