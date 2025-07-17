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
import { Container } from 'inversify'
import { DiException, type DiInterface, type InjectableClass } from './di.types'

/**
 * @inheritDoc
 */
export class Di implements DiInterface {
  private readonly container: Container

  constructor () {
    this.container = new Container()
  }

  /**
   * @inheritDoc
   */
  bind (key: string, injectableClass: InjectableClass<unknown>): void {
    if (this.has(key)) {
      throw new DiException(`Already bound key "${key}"`)
    }

    this
      .container
      .bind(key)
      .to(injectableClass)
      .inSingletonScope()
  }

  /**
   * @inheritDoc
   */
  bindConstantValue (key: string, value: unknown): void {
    if (this.has(key)) {
      throw new DiException(`Already bound key "${key}"`)
    }
    this
      .container
      .bind(key)
      .toConstantValue(value)
  }

  /**
   * @inheritDoc
   */
  get<Type> (key: string): Type {
    if (!this.has(key)) {
      throw new DiException(`No matching bindings found for key "${key}"`)
    }
    try {
      return this.container.get<Type>(key)
    } catch (e) {
      throw new DiException((e as Error).message)
    }
  }

  /**
   * @inheritDoc
   */
  has (key: string): boolean {
    return this.container.isBound(key)
  }

  /**
   * @inheritDoc
   */
  remove (key: string): void {
    if (!this.has(key)) {
      throw new DiException(`Could not remove key "${key}"`)
    }
    this.container.unbindSync(key)
  }

  /**
   * @inheritDoc
   */
  resolve<Type> (injectableClass: InjectableClass<Type>): Type {
    try {
      return this.container.get<Type>(injectableClass, { autobind: true })
    } catch (e) {
      throw new DiException((e as Error).message)
    }
  }
}
