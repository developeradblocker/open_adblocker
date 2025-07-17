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

/**
 * Dispatcher - this is the main dispatcher that listening all messages
 * that come from different places such as
 *  - from content scripts
 *  - from ports (long-lived connection)
 *  - from browser's API
 *
 *  There are 2 types of message listeners "main" and "general"
 *      main - a listener that returns a value back to a sender.
 *             The main listener always be invoked last even if the listener is registered the firstly
 *             [WARNING] Only one main listener can be registered for specific message type
 *   general - a listener that just observe messages and do not return any value back
 *             to a sender. There is no limitation of amount listeners that can be registered for specific message type
 *
 *  All messages are packed in boxes and on each box has a sender property.
 *  A box might include extra details about sender such "tabId" or "port name"
 *  and this details depends on the sender property
 *
 */
export interface DispatcherInterface {
  /**
   * This method registers a listener for specific message type with an instance by a provided class decorated
   * with @injectable decorator and implement a AppMessageListener interface.
   * An instance of the class will be created immediately and a listener id is returned
   *
   * @example
   *
   *  interface HelloMessage extends AppMessage {
   *    type: 'hello'
   *  }
   *
   *  @injectable() // this decorator is necessary
   *  class HelloMessageListener implements AppMessageListener<HelloMessage, string> {
   *
   *    on (): 'hello' {
   *      return 'hello'
   *    }
   *
   *    main (): true {
   *      return true
   *    }
   *
   *    async handle (box: Box<HelloMessage>): Promise<string> {
   *      return 'hello'
   *    }
   *  }
   *
   *
   * @param listener - a class decorated with @injectable decorator and implement a AppMessageListener interface
   * @throws DispatcherException - if tried to register the second main listener for the same message type
   * @return - listener id
   */
  onWithClass: (listener: AppMessageListenerConstructor) => number

  /**
   * This method registers a listener for a specific message type as a callback function
   *
   * @param type - a message type
   * @param callback - a function that handles message
   * @param main - it determines a listener type "main" or "general"
   * @param sync - it determines how a listener should handle a message by default its sync
   * @throws DispatcherException - if tried to register the second main listener for the same message type
   * @return - listener id
   */
  on: <Message extends AppMessage, ReturnType = undefined>(
    type: Message['type'],
    callback: CallbackMessageListener<Message, ReturnType>,
    main: TypeListener<ReturnType>,
    sync?: boolean
  ) => number

  /**
   * This method removes a listener by id
   *
   * @param listenerId - a listener's id
   * @throws DispatcherException - if a listener with provided id is not registered
   */
  remove: (listenerId: number) => void

  /**
   * Checks if a listener with a provided id is registered
   *
   * @param listenerId - a listener's id
   */
  has: (listenerId: number) => boolean

  /**
   * This method automatically packs a message into a box and sends the message to all registered listeners and
   * return a value from the main listener if such is registered
   *
   * @param message - a message
   * @return - a value from the main listener if such is registered otherwise undefined
   */
  sendMessage: <ReturnType>(message: AppMessage) => Promise<ReturnType>

  /**
   * This method sends a box with a message to all registered listeners
   *
   * @param box
   * @return - a value from the main listener if such is registered otherwise undefined
   */
  sendBox: <ReturnType>(box: Box<AppMessage>) => Promise<ReturnType>

  work: () => Promise<void>

  onAfter: <Message extends AppMessage>(
    type: Message['type'],
    callback: CallbackMessageListener<Message, void>,
  ) => number
}

/**
 * A base format message that uses for communication between different parts of the application.
 */
export interface AppMessage {
  readonly type: string
  readonly force?: boolean
}

/**
 * Box with a message and sender's name
 */
export interface BaseBox<Message extends AppMessage> {
  /**
   * Any message
   */
  readonly message: Message

  /**
   * channel name
   */
  readonly channel: string
}

export type Box <Message extends AppMessage> = BaseBox<Message>

/**
 * A Class Listener that listening a specific type message from any sender.
 *
 * requirements:
 * - a class has to be decorated with @injectable decorator
 * - if a class implements a main listener then a return type is required and a method "main" must return "true"
 * - if a class implements a general listener then a return type is NOT required and a method "main" must return "false"
 */
export interface AppMessageListener<Message extends AppMessage, ReturnType = void | never> {
  /**
   * A message type that a listener handles
   */
  on: () => Message['type']

  /**
   * The method handles all messages from any sender
   *
   * @param box
   */
  handle: (box: Box<Message>) => [ReturnType] extends undefined
    ? Promise<void>
    : Promise<ReturnType>

  /**
   * It determines a listener type:
   * true - a main type
   * false - a general type
   */
  main: () => TypeListener<ReturnType>

  /**
   * It determines how a listener should handle a message
   * by default it's true
   */
  sync?: () => boolean
}

/**
 * Function constructor that should create with "new" an instance that implements BrotherMessageListener
 */
export type AppMessageListenerConstructor<
  Message extends AppMessage = any
> = new (...args: any[]) => AppMessageListener<Message, any>

// void is only valid as a return type or generic type variable.
export type TypeListener<ReturnType> = ReturnType extends undefined ? false : ReturnType extends void ? false : true

// // void is only valid as a return type or generic type variable.
export type CallbackMessageListener<Message extends AppMessage, ReturnType> = (box: BaseBox<Message>) => ReturnType extends undefined ? void : ReturnType
