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
import { onAdGuardReady } from '@/modules/aguard/internal/expose.messages'

const injections: Injection[] = [
  {
    key: InternalSettingsIdentifiers.service,
    use: SettingsService
  }
]

const handleOnAdGuardReady = async (): Promise<void> => {
  inject(injections)
  dispatcher().onWithClass(ExportSettingsListener)
  dispatcher().onWithClass(ImportSettingsListener)
}

export const setupInternalSettings = (): void => {
  onAdGuardReady(handleOnAdGuardReady)
}
