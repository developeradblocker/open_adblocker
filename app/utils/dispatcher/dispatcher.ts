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

import {
  type AppMessage,
  type AppMessageListener,
  type AppMessageListenerConstructor,
  type Box,
  type CallbackMessageListener,
  type DispatcherInterface,
  type TypeListener
} from './dispatcher.types'
import { DiInterface, inject, injectable } from '../di/di.types'
import { LoggerInterface } from '../logger/logger.types'
import { DispatcherException } from './dispatcher.exception'
import { UtilsIdentifiers } from '../utils-Identifiers'
import { Channel } from '@/common/types'

/**
 * a listener handler
 */
type Listener <ReturnType> = (box: Box<AppMessage>) => ReturnType

/**
 * a record keeps the information about registered listeners "main" and "general"
 * that watching a specific message type and gives access to them by their id
 */
interface RegistryRecord {
  main: {
    id: number | null
    listener: ListenerConfig | null
  }
  general: Map<number, ListenerConfig>
}

interface ListenerConfig {
  sync: boolean
  handler: Listener<any>
}

/**
 *  An Index Uses to speed up finding a listener from registry
 */
interface Index {
  messageType: string
  listenerType: 'main' | 'general'
}

/**
 * Type describes how to keep pending boxes that are waiting for a brother is waked up
 */
interface PendingBox {
  /**
   * a box that should be handled once a brother is waked up
   */
  box: Box<AppMessage>

  /**
   * it keeps a promise resolver
   * @param result
   */
  resolve: (result: any) => void
}

/**
 *  @inheritDoc
 */
@injectable()
export class Dispatcher implements DispatcherInterface {
  /**
   * Registry of Listeners
   *
   * @private
   */
  private readonly registry: Map<string, RegistryRecord> = new Map<string, RegistryRecord>()
  /**
   * Registry of after hook Listeners
   *
   * @private
   */
  private readonly registryAfter: Map<string, CallbackMessageListener<any, void>[]> = new Map()

  /**
   * An Index Uses to speed up finding a listener from registry
   *
   * @private
   */
  private readonly index: Map<number, Index> = new Map<number, Index>()

  /**
   * It keeps all registered callbacks and classes
   *
   * @private
   */
  private readonly registerOfHandlers: Set<unknown> = new Set<unknown>()

  /**
   * it counts registered listeners for all period of life
   *
   * @private
   */
  private counter = 0

  /**
   * just a flag that signals a brother is waked up
   * @private
   */
  private working = false

  /**
   * keeps pending boxes.
   * Should be cleaned up once a brother is waked up
   *
   * @private
   */
  private pending: PendingBox[] = []

  constructor (
    @inject(UtilsIdentifiers.di)
    private readonly di: DiInterface,

    @inject(UtilsIdentifiers.logger)
    private readonly logger: LoggerInterface
  ) {
  }

  /**
   *  @inheritDoc
   */
  onWithClass (listener: AppMessageListenerConstructor): number {
    if (this.registerOfHandlers.has(listener)) {
      throw new DispatcherException(`This listener(class) ${listener.name} is already registered`)
    }

    this.registerOfHandlers.add(listener)

    const instance = this.di.resolve<AppMessageListener<AppMessage, any>>(listener)
    return this.on(
      instance.on(),
      instance.handle.bind(instance),
      instance.main() as never,
      (instance.sync != null) ? instance.sync() : true
    )
  }

  /**
   *  @inheritDoc
   */
  on<Message extends AppMessage, ReturnType = undefined> (
    type: Message['type'],
    callback: CallbackMessageListener<Message, ReturnType>,
    main: TypeListener<ReturnType>,
    sync = true
  ): number {
    if (this.registerOfHandlers.has(callback)) {
      throw new DispatcherException(`This listener(callback)${callback.name} is already registered`)
    }

    this.registerOfHandlers.add(callback)

    let record: RegistryRecord | undefined = this.registry.get(type)

    if (typeof record === 'undefined') {
      // register a new record for a new message type
      record = {
        main: {
          id: null,
          listener: null
        },
        general: new Map<number, ListenerConfig>()
      }
      this.registry.set(type, record)
    }

    if (main && (record.main.id != null)) {
      throw new DispatcherException(`a main listener for "${type}" is already exist`)
    }

    if (main && !sync) {
      throw new DispatcherException(`a main listener cannot be async for message "${type}"`)
    }

    this.counter++

    if (main) {
      record.main.id = this.counter
      record.main.listener = {
        sync: true,
        handler: callback as Listener<any>
      }
    } else {
      record.general.set(this.counter, {
        sync,
        handler: callback as Listener<any>
      })
    }

    const index: Index = {
      messageType: type,
      listenerType: main ? 'main' : 'general'
    }
    this.index.set(this.counter, index)
    return this.counter
  }

  /**
   *  @inheritDoc
   */
  remove (listenerId: number): void {
    const index: Index | undefined = this.index.get(listenerId)

    if (typeof index === 'undefined') {
      throw new DispatcherException(`Listener with id "${listenerId}" not exist`)
    }

    const record: RegistryRecord = this.registry.get(index.messageType) as RegistryRecord

    if (index.listenerType === 'main') {
      record.main = {
        id: null,
        listener: null
      }
      this.index.delete(listenerId)
      return
    }

    record.general.delete(listenerId)
    this.index.delete(listenerId)
  }

  /**
   *  @inheritDoc
   */
  has (listenerId: number): boolean {
    return this.index.has(listenerId)
  }

  /**
   *  @inheritDoc
   */
  async sendMessage<ReturnType> (message: AppMessage): Promise<ReturnType> {
    const box: Box<AppMessage> = {
      channel: Channel.internal,
      message
    }
    return await this.sendBox(box)
  }

  /**
   *  @inheritDoc
   */
  async sendBox<ReturnType> (box: Box<AppMessage>): Promise<ReturnType> {
    return await new Promise((resolve) => {
      const handleOnOfter = async (): Promise<void> => {
        const afterCbs = this.registryAfter.get(type) ?? []
        if (afterCbs.length) {
          await Promise.allSettled(afterCbs.map(cb => cb(box)))
        }
      }
      if (!this.working && box.message?.force !== true) {
        const pendingBox: PendingBox = { box, resolve }
        this.pending.push(pendingBox)
        return
      }

      // @ts-ignore
      const type = box.message?.type || box.type
      const label = `Dispatcher: New box from "${box.channel}" says "${type}"`
      this.logger.groupCollapsed(label)
      this.logger.info(JSON.stringify(box, null, 2))
      this.logger.groupEnd(label)

      const record: RegistryRecord | undefined = this.registry.get(type)
      if (typeof record === 'undefined') {
        handleOnOfter().then(() => {
          resolve(undefined as any)
        })
        return
      }

      if (record.general.size === 0 && record.main.id === null) {
        handleOnOfter().then(() => {
          resolve(undefined as any)
        })
        return
      }
      const settledResultIterator = (result: PromiseSettledResult<unknown>): void => {
        if (result.status !== 'rejected') {
          return
        }

        this.logger.error(`Dispatcher: a listener for a message "${type}" thrown en error`, result.reason)
      }

      const configs: ListenerConfig[] = Array.from(record.general.values())

      const asyncPromises = configs
        .filter(config => !config.sync)
        .map(async (config: ListenerConfig) => {
          return config.handler(box)
        })

      Promise
        .allSettled(asyncPromises)
        .then(async (results: PromiseSettledResult<unknown>[]) => {
          results.forEach(settledResultIterator)
        })

      const syncPromises = configs
        .filter(config => config.sync)
        .map(async (config: ListenerConfig) => {
          return config.handler(box)
        })

      Promise
        .allSettled(syncPromises)
        .then(async (results: PromiseSettledResult<unknown>[]) => {
          results.forEach(settledResultIterator)
          return await Promise.resolve((record.main.listener != null)
            ? record.main.listener.handler(box)
            : undefined)
        }
        )
        .then(async (result) => {
          await handleOnOfter()
          resolve(result)
        })
    })
  }

  async work (): Promise<void> {
    this.working = true
    this.pending.forEach((pendingBox: PendingBox) => {
      this
        .sendBox(pendingBox.box)
        .then(result => {
          pendingBox.resolve(result)
        })
    })
    this.pending = []
  }

  onAfter <Message extends AppMessage> (
    type: Message['type'],
    callback: CallbackMessageListener<Message, void>
  ): number {
    let listeners: CallbackMessageListener<Message, void>[] = []
    if (this.registryAfter.has(type)) {
      listeners = this.registryAfter.get(type)
    }

    listeners.push(callback)
    this.registryAfter.set(type, listeners)

    return [...this.registryAfter.values()].flat().length
  }
}
