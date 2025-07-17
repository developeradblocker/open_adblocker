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
import { PortName } from './port.types'

export enum PortMessages {
  open = 'Port.Open',
  greeting = 'Port.Greeting',
  response = 'Port.Response'
}

/**
 * internal message to notify that a port is open
 */
export interface PortOpenMessage extends AppMessage {
  type: PortMessages.open
  payload: {
    name: PortName
  }
}

/**
 * external message to connect sw and port
 */
export interface PortGreetingMessage extends AppMessage {
  type: PortMessages.greeting
}

/**
 * external message to send response to port
 */
export interface PortResponseMessage extends AppMessage {
  type: PortMessages.response
  payload: any
}
