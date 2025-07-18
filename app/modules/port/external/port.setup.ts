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

import { Connection, ExternalPortChannel, ExternalPortSetupOptions, PromiseResolver, PromiseWaiter } from './port.types'
import { AppMessage } from '@/utils/dispatcher/dispatcher.types'
import { PortMessages, PortResponseMessage } from '../common/port.messages'
import { PortBox } from '../common/port.types'
import { logger } from '@/utils/logger/logger'
import { v4 as uuidv4 } from 'uuid'
import { Channel } from '@/common/types'
import { dispatcher } from '@/utils/setup-worker'
import ConnectInfo = chrome.runtime.ConnectInfo

let channel: ExternalPortChannel

const delay = async (ms: number): Promise<void> => {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
export const setupExternalPortChannel = (options: ExternalPortSetupOptions): ExternalPortChannel => {
  if (channel) {
    return channel
  }
  channel = {
    _port: null,
    _connection: Connection.DISCONNECTED,
    _waiters: new Map<string, PromiseWaiter>(),
    _resolvers: [] as PromiseResolver[],
    async sendMessage<ResponseType> (message: AppMessage): Promise<ResponseType> {
      const box: PortBox<AppMessage> = {
        port: this._port?.name ?? options.name,
        channel: Channel.port,
        id: uuidv4(),
        message
      }

      if (this._connection === Connection.DISCONNECTED) {
        await this.establish()
      } else if (this._connection === Connection.CONNECTING) {
        await new Promise((resolve): void => {
          this._resolvers.push(resolve)
        })
      }

      return await new Promise((resolve, reject) => {
        this._waiters.set(box.id, { resolve, reject })
        try {
          this._port.postMessage(box)
        } catch {
          this._connection = Connection.DISCONNECTED
          this.establish().then(() => this._port.postMessage(box))
        }
      })
    },

    async establish (): Promise<void> {
      if (this._connection !== Connection.DISCONNECTED) {
        return
      }

      this._connection = Connection.CONNECTING

      while (true) {
        const connectInfo: ConnectInfo = { name: `${options.name}-${uuidv4()}` }
        this._port = chrome.runtime.connect(connectInfo)
        const listener = (): void => {
          this._connection = Connection.CONNECTED
        }
        this._port.onMessage.addListener(listener)
        await delay(100)
        this._port.onMessage.removeListener(listener)

        if (this._connection === Connection.CONNECTING) {
          this._port.disconnect()
          continue
        }

        this._resolvers.forEach((func: PromiseResolver) => func())
        this._resolvers = []
        break
      }

      logger.info(`Port "${this._port.name}" is connected`)

      this._port.onMessage.addListener((box: PortBox<AppMessage>) => {
        if (box.port !== this._port.name) {
          return
        }

        if (box?.message?.type === PortMessages.greeting) {
          logger.info(`Port "${this._port.name}" established connection`)
          return
        }
        if (box?.message?.type === PortMessages.response) {
          if (!this._waiters.has(box.id)) {
            logger.warn(`Port: Box received with no registered handler for "${box.id}"`)
          } else {
            const message = box.message as PortResponseMessage
            this._waiters.get(box.id)?.resolve(message.payload)
            this._waiters.delete(box.id)
          }
        } else {
          dispatcher()
            .sendBox(box)
            .then(res => {
              const response: PortBox<PortResponseMessage> = {
                id: box.id,
                port: this._port.name,
                channel: Channel.port,
                message: {
                  type: PortMessages.response,
                  payload: res
                }
              }
              this._port.postMessage(response)
            })
        }
      })
    }
  }

  return channel
}

export const useExternalPort = (): ExternalPortChannel => {
  if (!channel) {
    throw new Error('Port channel is not set up. Please call "setupExternalPortChannel" first.')
  }
  return channel
}
