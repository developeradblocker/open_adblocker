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

import { dispatcher } from '@/utils/setup-worker'
import { Injection } from '@/utils/inject/inject.types'
import { inject } from '@/utils/inject/inject'
import { InternalSettingsIdentifiers } from '@/modules/settings/internal/settings.types'
import { SettingsService } from '@/modules/settings/internal/service/settings.service'
import { ExportSettingsListener } from '@/modules/settings/internal/listeners/export-settings.listener'
import { ImportSettingsListener } from '@/modules/settings/internal/listeners/import-settings.listener'
import { GetSettingsListener } from '@/modules/settings/internal/listeners/get-settings.listener'
import { FiltersStateChangedListener } from '@/modules/settings/internal/listeners/state-changed/filters.listener'
import { WebRTCStateChangedListener } from '@/modules/settings/internal/listeners/state-changed/web-rtc.listener'
import { WhitelistStateChangedListener } from '@/modules/settings/internal/listeners/state-changed/whitelist.listener'
import { MetadataService } from '@/modules/settings/internal/service/metadata.service'
import { MetadataStorage } from '@/modules/settings/internal/storage/metadata.storage'
import { onInstallHandler } from '@/modules/settings/internal/handlers/on-install.handler'

const injections: Injection[] = [
  {
    key: InternalSettingsIdentifiers.service,
    use: SettingsService
  },
  {
    key: InternalSettingsIdentifiers.metadata,
    use: MetadataService
  },
  {
    key: InternalSettingsIdentifiers._metadataStorage,
    use: MetadataStorage
  }
]

export const setupInternalSettings = (): void => {
  chrome.runtime.onInstalled.addListener(onInstallHandler)
  inject(injections)
  dispatcher().onWithClass(ExportSettingsListener)
  dispatcher().onWithClass(ImportSettingsListener)
  dispatcher().onWithClass(GetSettingsListener)
  dispatcher().onWithClass(FiltersStateChangedListener)
  dispatcher().onWithClass(WebRTCStateChangedListener)
  dispatcher().onWithClass(WhitelistStateChangedListener)
}
