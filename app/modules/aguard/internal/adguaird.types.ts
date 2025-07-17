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
import { type Domain } from '@/common/types'

export enum AdGuardIdentifiers {
  /**
   * {@link AdGuardServiceInterface}
   * @public
   */
  adGuardService = 'AdGuard.adGuardService',

  /**
   * {@link ConfigurationMV3}
   * @private
   */
  _config = 'AdGuard._config',

  /**
   * {@link TsWebExtension }
   * @private
   */
  _tsWebExtension = 'adGuard_tsWebExtension'
}

export interface AdGuardServiceInterface {
  /**
   * disable ad blocking for the specified domain
   * @param domain
   */
  addToAllowlist: (domain: Domain) => Promise<void>

  /**
   * enable ad blocking for the specified domain
   * @param domain
   */
  removeFromAllowlist: (domain: Domain) => Promise<void>

  /**
   * check if ad blocking is paused for the specified domain
   * @param domain
   */
  isPaused: (domain: Domain) => Promise<boolean>
}
