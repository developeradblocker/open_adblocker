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

import { PortBox, PortName } from '../common/port.types'
import { AppMessage } from '@/utils/dispatcher/dispatcher.types'
import { PortGreetingMessage, PortMessages, PortOpenMessage, PortResponseMessage } from '../common/port.messages'
import { InternalPortChannel } from './port.types'
import { PromiseWaiter } from '../external/port.types'
import { v4 as uuidv4 } from 'uuid'
import { Channel } from '@/common/types'
import { logger } from '@/utils/logger/logger'
import { dispatcher } from '@/utils/setup-worker'
import Port = chrome.runtime.Port

let channel: InternalPortChannel
export const setupInternalPortChannel = (): InternalPortChannel => {
  if (channel) {
    return channel
  }

  channel = {
    _ports: new Map<PortName, Port>(),
    _scopes: new Map<PortName, Map<string, PromiseWaiter>>(),
    isOpen (name: PortName): boolean {
      return this._ports.has(name)
    },
    getOpenedPortNames (): PortName[] {
      return Array.from(this._ports.keys())
    },
    async sendMessage<ReturnType> (portName: PortName, message: AppMessage): Promise<ReturnType> {
      if (!this._ports.has(portName)) {
        throw new Error(`Port "${portName}" was not found`)
      }

      const port: Port = this._ports.get(portName)
      const box: PortBox<AppMessage> = {
        channel: Channel.port,
        id: uuidv4(),
        port: portName,
        message
      }

      return await new Promise((resolve, reject) => {
        const waiter: PromiseWaiter = { resolve, reject }
        this._scopes.get(portName)?.set(box.id, waiter)
        port.postMessage(box)
      })
    },
    async sendMessageToAllPorts (message: AppMessage): Promise<void> {
      const ports = this.getOpenedPortNames()
      if (!ports.length) {
        return
      }

      await Promise.allSettled(ports.map((portName: PortName) => this.sendMessage(portName, message)))
    }
  }

  chrome.runtime.onConnect.addListener((port: Port) => {
    const greetingMessage: PortGreetingMessage = {
      type: PortMessages.greeting
    }
    port.postMessage(greetingMessage)

    channel._ports.set(port.name, port)
    channel._scopes.set(port.name, new Map<string, PromiseWaiter>())
    const message: PortOpenMessage = {
      type: PortMessages.open,
      payload: {
        name: port.name
      }
    }
    dispatcher().sendMessage(message)
    channel._ports.set(port.name, port)
    port.onMessage.addListener((box: PortBox<AppMessage>) => {
      if (box.port !== port.name) {
        return
      }
      if (box?.message?.type === PortMessages.response) {
        const scope: Map<string, PromiseWaiter> = channel._scopes.get(port.name)
        if (!scope) {
          return
        }
        if (scope.has(box.id)) {
          const message = box.message as PortResponseMessage
          scope.get(box.id)?.resolve(message.payload)
          scope.delete(box.id)
        }
      } else {
        dispatcher()
          .sendBox(box)
          .then((res) => {
            const message: PortBox<PortResponseMessage> = {
              id: box.id,
              port: port.name,
              channel: Channel.port,
              message: {
                type: PortMessages.response,
                payload: res
              }
            }
            if (channel.isOpen(port.name)) {
              port.postMessage(message)
            } else {
              logger.warn(`Could not delivery a response to a port="${port.name}"`)
            }
          })
      }
    })
    port.onDisconnect.addListener(() => {
      logger.info(`Port "${port.name}" is disconnected`)
      channel._ports.delete(port.name)

      const waiters: Map<string, PromiseWaiter> = channel._scopes.get(port.name)
      if (!waiters) {
        return
      }
      Array
        .from(waiters.values())
        .forEach((waiter: PromiseWaiter) => waiter.reject(`Port "${port.name}" is closed before a response is gotten`))
      channel._scopes.delete(port.name)
    })
  })
}

export const useInternalPort = (): InternalPortChannel => {
  if (!channel) {
    throw new Error('Port channel is not set up. Please call "setupInternalPortChannel" first.')
  }
  return channel
}
