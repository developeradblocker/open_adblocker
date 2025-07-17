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

export interface LoggerInterface {
  /**
   * Log Level: "info"
   *
   * @param msg
   */
  info: (...msg: any[]) => void

  /**
   * Log Level: "Warn"
   *
   * @param msg
   */
  warn: (...msg: any[]) => void

  /**
   * Log Level: "Error"
   *
   * @param msg
   */
  error: (...msg: any[]) => void

  /**
   * Log Level: "Info"
   *
   * @param msg
   */
  group: (...label: any[]) => void

  /**
   * Log Level: "Info"
   *
   * @param msg
   */
  groupCollapsed: (...label: any[]) => void

  /**
   * Log Level: "Info"
   *
   * @param msg
   */
  groupEnd: (...label: any[]) => void

  setWorkerName: (name: string) => this

  setLogging: (state: boolean) => this
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}
