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
import { di } from '@/utils/setup-worker'
import {
  CounterByTabInterface,
  CounterTotalInterface,
  InternalAdBlockerIdentifiers,
  InternalAdBlockerInterface
} from '@/modules/ad-blocker/internal/ad-blocker.types'

/**
 * Get the AdBlocker instance
 *
 * @throws {DiException} if the internalAdblocker is called before the worker is set up
 * @returns {InternalAdBlockerInterface}
 */
export const internalAdblocker = (): InternalAdBlockerInterface => {
  return di.get(InternalAdBlockerIdentifiers.adBlocker)
}

/**
 * Get the CounterTotalInterface instance
 *
 * @throws {DiException} if the totalCounter is called before the worker is set up
 * @returns {CounterTotalInterface}
 */
export const totalCounter = (): CounterTotalInterface => {
  return di.get(InternalAdBlockerIdentifiers._totalCounter)
}

/**
 * Get the CounterTotalInterface instance
 *
 * @throws {DiException} if the counterByTab is called before the worker is set up
 * @returns {CounterByTabInterface}
 */
export const counterByTab = (): CounterByTabInterface => {
  return di.get(InternalAdBlockerIdentifiers._counterByTab)
}
