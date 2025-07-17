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

import { AdBlockerServiceInterface } from '@/modules/ad-blocker/common/ad-blocker.types'
import { BlockedAdsCounter, Domain } from '@/common/types'

export enum InternalAdBlockerIdentifiers {
  /**
   * {@link InternalAdBlockerInterface}
   * @public
   */
  adBlocker = 'adBlocker.adBlocker',

  /**
   * {@link CounterByTabInterface}
   * @private
   */
  _counterByTab = 'adBlocker._counterByTab',

  /**
   * {@link CounterTotalInterface}
   * @private
   */
  _totalCounter = 'adBlocker._totalCounter'
}

export interface InternalAdBlockerInterface extends AdBlockerServiceInterface {
  /**
   * Toggle the ad blocker state for specific domain
   *
   * true - disable ad blocker
   * false - enable ad blocker
   * @param state
   */
  isPaused: (domain: Domain) => Promise<boolean>

  /**
   * Get number of blocked ads on the specified tab
   * @param tabId
   */
  getAdCounterByTabId: (tabId: number) => Promise<BlockedAdsCounter>

  /**
   * Get number of total blocked ads
   */
  getTotalAdCounter: () => Promise<BlockedAdsCounter>
}

export interface CounterByTabInterface {
  /**
   * Increment number of blocked ads on the specified tab
   * @param tabId
   */
  increment: (tabId: number) => Promise<void>

  /**
   * Get number of blocked ads on the specified tab
   * @param tabId
   */
  get: (tabId: number) => Promise<BlockedAdsCounter>

  /**
   * Reset the number of blocked ads to zero on the specified tab
   * @param tabId
   */
  reset: (tabId: number) => Promise<void>
}

export interface CounterTotalInterface {
  /**
   * Increment number of total blocked ads
   */
  increment: () => Promise<void>

  /**
   * Get number of total blocked ads
   */
  get: () => Promise<BlockedAdsCounter>
}
