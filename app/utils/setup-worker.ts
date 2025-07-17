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

import './dispatcher/dispatcher'
import { UtilsIdentifiers } from './utils-Identifiers'
import { Di } from '@/utils/di/di'
import type { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'
import { Dispatcher } from '@/utils/dispatcher/dispatcher'
import { logger } from '@/utils/logger/logger'
import { logging } from '@/utils/env.constants'

/**
 * Dependency Injection container for the entire application.
 */
export const di = new Di()

/**
 * Set up the environment for the worker.
 * Binds the worker name and logger to the DI container.
 * @param name
 */
export const setupWorker = (name: string): void => {
  di.bindConstantValue(UtilsIdentifiers.di, di)
  di.bindConstantValue(UtilsIdentifiers.worker, name)
  di.bindConstantValue(UtilsIdentifiers.logger, logger)
  logger
    .setWorkerName(name)
    .setLogging(logging)
  const dispatcher: DispatcherInterface = di.resolve(Dispatcher)
  di.bindConstantValue(UtilsIdentifiers.dispatcher, dispatcher)
}

/**
 * Get the dispatcher instance
 *
 * @throws {DiException} if the dispatcher is called before the worker is set up
 * @returns {DispatcherInterface}
 */
export const dispatcher = (): DispatcherInterface => {
  return di.get<DispatcherInterface>(UtilsIdentifiers.dispatcher)
}
