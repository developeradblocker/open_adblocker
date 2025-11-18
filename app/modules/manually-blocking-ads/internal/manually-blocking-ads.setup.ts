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
import {
  ManuallyBlockingAdsService
} from '@/modules/manually-blocking-ads/internal/services/manually-blocking-ads.service'
import {
  InternalManuallyBlockingAdsIdentifiers, InternalManuallyBlockingAdsServiceInterface
} from '@/modules/manually-blocking-ads/internal/manually-blocking-ads.types'
import { di, dispatcher } from '@/utils/setup-worker'
import { TriggerStartManualAdBlockingListener } from '@/modules/manually-blocking-ads/internal/listeners/trigger-start.listener'
import { UserRulesStorage } from '@/modules/manually-blocking-ads/internal/storage/user-rules.storage'
import { AddRuleListener } from '@/modules/manually-blocking-ads/internal/listeners/add-rule.listener'
import { ResetRulesListener } from '@/modules/manually-blocking-ads/internal/listeners/reset-rules.listener'

export const setupInternalManuallyBlockingAds = (): void => {
  inject([
    {
      key: InternalManuallyBlockingAdsIdentifiers.service,
      use: ManuallyBlockingAdsService
    },
    {
      key: InternalManuallyBlockingAdsIdentifiers._storage,
      use: UserRulesStorage
    }
  ])

  dispatcher().onWithClass(TriggerStartManualAdBlockingListener)
  dispatcher().onWithClass(AddRuleListener)
  dispatcher().onWithClass(ResetRulesListener)
}

export const useInternalManuallyBlockingAds = (): InternalManuallyBlockingAdsServiceInterface => di.get(InternalManuallyBlockingAdsIdentifiers.service)
