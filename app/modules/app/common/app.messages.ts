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
import { AppState } from '@/modules/app/common/app.types'

export enum AppMessages {
  ready = 'App.Ready',
  getState = 'App.GetState',
  updateState = 'Popup.UpdateState'
}

/**
 * a message from the popup to the service worker.
 * This message is used to request the current state of the application.
 */
export interface AppGetStateMessage extends AppMessage {
  type: AppMessages.getState
}

export interface AppOnReadyMessage extends AppMessage {
  type: AppMessages.ready
  force: boolean
}

/**
 * an external message to update all ports state
 */
export interface AppUpdateStateMessage extends AppMessage {
  type: AppMessages.updateState
  payload: AppState
}
