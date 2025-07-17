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
import { DiException } from './di.exception'
import { inject, injectable } from 'inversify'
export { DiException }
/**
 * Reason for reimporting:
 * in the future, it'll give an ability to enhance these decorators
 */
export { injectable, inject }

/**
 * Dependency Injection
 */
export interface DiInterface {
  /**
   * It binds a class decorated with @injectable decorator on unique key
   *
   * binding features:
   * - it's singleton: for a bound class returns always the same instance
   * - lazy load: an instance for a bound class will be created on the fly
   *   on first retrieving the instance with a get method
   *
   * @param key - has to be unique binding identifier that binds a class
   * @param injectableClass - a class decorated with @injectable decorator
   * @throws DiException - if tried binding a class with already bound key
   */
  bind: (key: string, injectableClass: InjectableClass<unknown>) => void

  /**
   * It binds a value as is that does not require resolving dependencies
   *
   * @param key - has to be unique binding identifier that binds a value
   * @param value - any value that does not require resolving dependencies
   * @throws DiException - if tried binding a value with already bound key
   */
  bindConstantValue: (key: string, value: unknown) => any

  /**
   * It returns bound value or an instance from a bound class
   *
   * @param key - unique binding identifier
   * @throws DiException - throw an DiException if there is no bound a value or a class
   */
  get: <Type>(key: string) => Type

  /**
   * It checks if something is bound on the specific key
   *
   * @param key - binding identifier
   */
  has: (key: string) => boolean

  /**
  * It removes binding on the specific key
  *
  * @param key - unique binding identifier
  * @throws DiException - throw an DiException if there is no bound a value or a class
  */
  remove: (key: string) => void

  /**
   * it resolves and creates an instance from a class decorated with @injectable decorator
   *
   * @param injectableClass
   * @throws DiException - throw an DiException if dependencies could be resolved
   */
  resolve: <Type>(injectableClass: InjectableClass<Type>) => Type
}

/**
 * a class decorated with @injectable decorator
 */
export type InjectableClass<Type> = new(...args: any[]) => Type
