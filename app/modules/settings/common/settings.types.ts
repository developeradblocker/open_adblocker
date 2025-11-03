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

export interface SettingsInterface {
  export: () => Promise<OpenADBSettings>
  import: (settings: OpenADBSettings) => Promise<boolean>
}

export const SETTINGS_VERSION = '1.0'

export interface GeneralSettings {
  cookieCleaner: boolean
  webRTC: boolean
}

export interface AdditionalSettings {
  showPopupAdsCount: boolean
  showContextMenu: boolean
}

export interface ManualBlockedSettings {
  enabled: boolean
  rules: string
}

export interface WhiteListSettings {
  enabled: boolean
  domains: string[]
}

export interface FiltersSettings {
  enabledFilters: number[]
  enabledGroups: number[]
  manualBlocked: ManualBlockedSettings
  whiteList: WhiteListSettings
}

export interface OpenADBSettings {
  version: string
  general: GeneralSettings
  filters: FiltersSettings
  additionalSettings: AdditionalSettings
}
