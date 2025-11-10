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
import { inject } from '@/utils/inject/inject'
import { UIManuallyBlockingAdsIdentifiers } from '@/modules/manually-blocking-ads/ui/manually-blocking-ads.types'
import { UiAdsBlockerService } from '@/modules/manually-blocking-ads/ui/services/ui-ads-blocker.service'
import { di, dispatcher } from '@/utils/setup-worker'
import { ElementSelectedListener } from '@/modules/manually-blocking-ads/ui/listeners/element-selected.listener'

export const setupUIManuallyBlockingAds = (): void => {
  inject([
    {
      key: UIManuallyBlockingAdsIdentifiers.service,
      use: UiAdsBlockerService
    }
  ])

  dispatcher().onWithClass(ElementSelectedListener)
}

export const useUIManuallyBlockingAds = (): UiAdsBlockerService => di.get(UIManuallyBlockingAdsIdentifiers.service)
