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

import { PortName } from '../common/port.types'
import { AppMessage } from '@/utils/dispatcher/dispatcher.types'
import Port = chrome.runtime.Port

export interface ExternalPortSetupOptions {
  readonly name: PortName
}

export enum Connection {
  CONNECTED = 'CONNECTED',
  CONNECTING = 'CONNECTING',
  DISCONNECTED = 'DISCONNECTED'
}

export type PromiseResolver = (any?: any) => void
export interface PromiseWaiter {
  resolve: PromiseResolver
  reject: PromiseResolver
}

export interface ExternalPortChannel {
  _port: Port
  _connection: Connection
  _waiters: Map<string, PromiseWaiter>
  _resolvers: PromiseResolver[]
  sendMessage: <ResponseType = void>(message: AppMessage) => Promise<ResponseType>
  establish: () => Promise<void>
}
