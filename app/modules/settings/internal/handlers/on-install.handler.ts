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
import { useInternalFilters } from '@/modules/filters/internal/filters.utils'
import { getFilterIdsByLocale } from '@/helpers/locale-detect.helper'
import InstalledDetails = chrome.runtime.InstalledDetails
import { useInternalMetadata } from '@/modules/settings/internal/settings.utils'
import { onAdGuardReady } from '@/modules/aguard/internal/expose.messages'
import { DEFAULT_ENABLED_FILTER_IDS } from '../../../../../constants'
import { tsWebExtension } from '@/modules/aguard/internal/utils'
import { getConfiguration } from '@/modules/aguard/internal/adguard.setup'
import { AdGuardIdentifiers } from '@/modules/aguard/internal/adguard.types'
import { ConfigurationMV3 } from '@adguard/tswebextension/dist/types/lib/mv3/background/configuration'
import { di } from '@/utils/setup-worker'

export const onInstallHandler = (details: InstalledDetails): void => {
  const metadataService = useInternalMetadata()
  metadataService.updateMetadata()
  onAdGuardReady(async () => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      const filters = await metadataService.getFilters()
      const localeFilterIds = getFilterIdsByLocale(filters)
      const initialFilters = Array.from(new Set([...DEFAULT_ENABLED_FILTER_IDS, ...localeFilterIds]))
      await useInternalFilters().setup(initialFilters)
      const config = di.get<ConfigurationMV3>(AdGuardIdentifiers._config)
      config.staticFiltersIds = initialFilters
      await tsWebExtension().configure(await getConfiguration())
    }
  })
}
