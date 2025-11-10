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
  ContentManuallyBlockingAdsIdentifiers,
  ContentManuallyBlockingAdsOptions
} from '@/modules/manually-blocking-ads/content/manually-blocking-ads.types'
import { IframeManager } from '@/modules/manually-blocking-ads/content/services/iframe.manager'
import { dispatcher } from '@/utils/setup-worker'
import { StartManualAdBlockingListener } from '@/modules/manually-blocking-ads/content/listeners/start.listener'
import { StopManualAdBlockingListener } from '@/modules/manually-blocking-ads/content/listeners/stop.listener'
import { SelectorService } from '@/modules/manually-blocking-ads/content/services/selector.service'

export const setupContentManuallyBlockingAds = (options: ContentManuallyBlockingAdsOptions): void => {
  inject([
    {
      key: ContentManuallyBlockingAdsIdentifiers.iframeManager,
      use: IframeManager
    },
    {
      key: ContentManuallyBlockingAdsIdentifiers.service,
      use: SelectorService
    },
    {
      key: ContentManuallyBlockingAdsIdentifiers.options,
      use: options,
      value: true
    }
  ])
  console.log(dispatcher())
  debugger
  dispatcher().onWithClass(StartManualAdBlockingListener)
  dispatcher().onWithClass(StopManualAdBlockingListener)
}
