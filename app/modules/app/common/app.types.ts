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

import { BlockedAdsCounter, ValuesOf } from '@/common/types'

export interface AppServiceInterface {
  /**
   * Fetches the current state of the application.
   */
  getState: () => Promise<AppState>

  establishConnection: () => Promise<void>
}

export interface AppState {
  /**
   * Total number of blocked ads across all tabs in current session.
   */
  totalBlocked: BlockedAdsCounter

  /**
   * Number of blocked ads in the current tab.
   */
  blockedByTab: BlockedAdsCounter

  /**
   * defines if page is as basic html, or browser-services
   */
  isServicePage: boolean

  /**
   * Indicates whether the ad blocker is currently paused on this domain
   */
  isPaused: boolean

  /**
   * Indicates whether the user needs to visit the rate us page.
   */
  needVisitRateUs: boolean
}

export type AppFields = ValuesOf<AppState>
export type AppField = keyof AppFields
export type AppFieldValues = AppState[AppField]

export const AppStateFields: AppFields = {
  totalBlocked: 'totalBlocked',
  isServicePage: 'isServicePage',
  blockedByTab: 'blockedByTab',
  isPaused: 'isPaused',
  needVisitRateUs: 'needVisitRateUs'
} as const
