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
import { OpenADBSettings, SETTINGS_VERSION, SettingsInterface } from '@/modules/settings/common/settings.types'
import { FiltersServiceInterface, InternalFiltersIdentifiers } from '@/modules/filters/internal/filters.types'
import { COOKIE_CLEANER_ID } from '../../../../../constants'
import { InternalWebRTCIdentifiers } from '@/modules/features/web-rtc/internal/web-rtc.types'
import { WebRTCInterface } from '@/modules/features/web-rtc/common/web-rtc.types'
import { WhitelistIdentifiers } from '@/modules/whitelist/internal/whitelist.types'
import { WhitelistInterface } from '@/modules/whitelist/common/whetelist.types'

@injectable()
export class SettingsService implements SettingsInterface {
  constructor (
    @inject(InternalFiltersIdentifiers.service)
    private filters: FiltersServiceInterface,
    @inject(InternalWebRTCIdentifiers.service)
    private webRtc: WebRTCInterface,
    @inject(WhitelistIdentifiers.service)
    private readonly whitelist: WhitelistInterface
  ) {
  }

  async export (): Promise<OpenADBSettings> {
    return {
      version: SETTINGS_VERSION,
      general: {
        cookieCleaner: await this.filters.isEnabled(COOKIE_CLEANER_ID),
        webRTC: await this.webRtc.getState()
      },
      filters: {
        enabledFilters: await this.filters.getEnabledFilters(),
        enabledGroups: [],
        manualBlocked: {
          enabled: true,
          rules: ''
        },
        whiteList: {
          enabled: true,
          domains: await this.whitelist.getDomains()
        }
      },
      additionalSettings: {
        showPopupAdsCount: false,
        showContextMenu: false
      }
    }
  }

  async import (settings: OpenADBSettings): Promise<boolean> {
    console.log('validate settings', settings)
    return false
  }
}
