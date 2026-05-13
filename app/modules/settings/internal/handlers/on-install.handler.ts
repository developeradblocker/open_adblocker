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
import { InternalSettingsIdentifiers } from '@/modules/settings/internal/settings.types'
import { MetadataServiceInterface } from '@/modules/settings/common/settings.types'
import { useInternalFilters } from '@/modules/filters/internal/filters.utils'
import { getFilterIdsByLocale } from '@/helpers/locale-detect.helper'
import { DEFAULT_ENABLED_FILTER_IDS } from '../../../../../constants'
import InstalledDetails = chrome.runtime.InstalledDetails

export const onInstallHandler = async (details: InstalledDetails): Promise<void> => {
  const metadataService = di.get<MetadataServiceInterface>(InternalSettingsIdentifiers.metadata)
  await metadataService.updateMetadata()

  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    const filters = await metadataService.getFilters()
    const localeFilterIds = getFilterIdsByLocale(filters)
    const initialFilters = [...new Set([...DEFAULT_ENABLED_FILTER_IDS, ...localeFilterIds])]
    await useInternalFilters().setup(initialFilters)
  }
}
