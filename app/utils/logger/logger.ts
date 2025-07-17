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

import { type LoggerInterface, LogLevel } from './logger.types'
import { injectable } from 'inversify'

type Context = (...args: any[]) => void

@injectable()
export class Logger implements LoggerInterface {
  private collapseCounter = 0

  private workerName: string

  private logging: boolean

  info (...msg: any[]): void {
    this.write(console.info, LogLevel.INFO, msg)
  }

  warn (...msg: any[]): void {
    this.write(console.warn, LogLevel.WARN, msg)
  }

  error (...msg: any[]): void {
    this.write(console.error, LogLevel.ERROR, msg)
  }

  group (...label: any[]): void {
    this.write(console.group, LogLevel.INFO, label)
    this.collapseCounter++
  }

  groupCollapsed (...label: any[]): void {
    this.write(console.groupCollapsed, LogLevel.INFO, label)
    this.collapseCounter++
  }

  groupEnd (...label: any[]): void {
    this.write(console.groupEnd, LogLevel.INFO, label)

    // we should prevent minus counting
    if (this.collapseCounter !== 0) {
      this.collapseCounter--
    }
  }

  setWorkerName (name: string): this {
    this.workerName = name
    return this
  }

  setLogging (state: boolean): this {
    this.logging = state
    return this
  }

  private write (context: Context, level: LogLevel, msg: any[]): void {
    if (!this.logging) {
      return
    }
    if (typeof msg[0] === 'string' && this.collapseCounter === 0) {
      const [message, ...args] = msg
      context.apply(console, [`[${this.workerName}] ${message}`, ...args])
      return
    }

    context.apply(console, msg)
  }
}

export const logger = new Logger()
