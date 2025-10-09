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
import { Config } from '@/modules/config/common/config.types'

export interface StoredConfig {
  updated: number
  config: Config
}

export interface ApiConfig {
  config: Config
}

export enum InternalConfigIdentifiers {
  /**
   * @link ConfigServiceInterface
   */
  service = 'Config.Service',

  /**
   * @link ConfigStorageInterface
   */
  _storage = 'Config.Storage',

  /**
   * @link string
   */
  url = 'Config.Url',

  /**
   * @link number
   */
  intervalDays = 'Config.IntervalDays',
}

export interface ConfigServiceInterface {
  update: () => Promise<void>
  get: () => Promise<Config>
}

export interface ConfigStorageInterface {
  get: () => Promise<StoredConfig>
  set: (config: ApiConfig) => Promise<void>
}
