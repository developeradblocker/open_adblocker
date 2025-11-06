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
import { inject, injectable } from '@/utils/di/di.types'
import {
  ExportedSettings,
  OpenADBSettings,
  SETTINGS_VERSION,
  SettingsInterface
} from '@/modules/settings/common/settings.types'
import {
  FiltersServiceInterface, GroupsServiceInterface,
  InternalFiltersIdentifiers, MetadataServiceInterface
} from '@/modules/filters/internal/filters.types'
import { COOKIE_CLEANER_ID } from '../../../../../constants'
import { InternalWebRTCIdentifiers } from '@/modules/features/web-rtc/internal/web-rtc.types'
import { WebRTCInterface } from '@/modules/features/web-rtc/common/web-rtc.types'
import { WhitelistIdentifiers } from '@/modules/whitelist/internal/whitelist.types'
import { WhitelistInterface } from '@/modules/whitelist/common/whetelist.types'
import { logger } from '@/utils/logger/logger'
import { structureValidator } from '@/modules/settings/internal/validators/structure.validator'
import { privacyValidator } from '@/modules/settings/internal/validators/privacy.validator'
import { AdGuardIdentifiers } from '@/modules/aguard/internal/adguaird.types'
import { TsWebExtension } from '@adguard/tswebextension/mv3'
import { getConfiguration } from '@/modules/aguard/internal/adguard.setup'

@injectable()
export class SettingsService implements SettingsInterface {
  constructor (
    @inject(InternalFiltersIdentifiers.filters)
    private filters: FiltersServiceInterface,
    @inject(InternalFiltersIdentifiers.groups)
    private groups: GroupsServiceInterface,
    @inject(InternalFiltersIdentifiers.metadata)
    private metadata: MetadataServiceInterface,
    @inject(InternalWebRTCIdentifiers.service)
    private webRtc: WebRTCInterface,
    @inject(WhitelistIdentifiers.service)
    private readonly whitelist: WhitelistInterface,
    @inject(AdGuardIdentifiers._tsWebExtension)
    private readonly tsWebExtension: TsWebExtension
  ) {
  }

  async export (): Promise<ExportedSettings> {
    return {
      version: SETTINGS_VERSION,
      general: {
        cookieCleaner: await this.filters.isEnabled(COOKIE_CLEANER_ID),
        webRTC: await this.webRtc.getState()
      },
      filters: {
        enabledFilters: await this.filters.getEnabledFilters(),
        enabledGroups: await this.groups.getEnabledGroups(),
        whiteList: {
          domains: await this.whitelist.getDomains()
        }
      }
    }
  }

  async import (content: string): Promise<boolean> {
    try {
      const settings: ExportedSettings = JSON.parse(content)
      await privacyValidator(settings)
      await structureValidator(settings)

      await this.populateLocalSettings(settings)
      await this.tsWebExtension.configure(await getConfiguration())
      return true
    } catch (error) {
      logger.error('Import settings: ', error)
      return false
    }
  }

  async get (): Promise<OpenADBSettings> {
    const main = await this.export()
    const { metadata } = await this.metadata.getMetadata()
    const { filters, groups } = metadata
    return {
      ...main,
      metadata: { filters, groups }
    }
  }

  private async populateLocalSettings (settings: ExportedSettings): Promise<void> {
    const filters = settings.filters.enabledFilters
    if (settings.general.cookieCleaner) {
      filters.push(COOKIE_CLEANER_ID)
    }
    await this.filters.setup(settings.filters.enabledFilters)
    await this.groups.setup(settings.filters.enabledGroups)
    await this.webRtc.setup(settings.general.webRTC)
    await this.whitelist.setup(settings.filters.whiteList.domains)
  }
}
