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
import 'reflect-metadata'
import { setupContentManuallyBlockingAds } from '@/modules/manually-blocking-ads/content/manually-blocking-ads.setup'
import { ContentManuallyBlockingAdsOptions } from '@/modules/manually-blocking-ads/content/manually-blocking-ads.types'
import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { setupContentBroadcast } from '@/modules/broadcast/content/broadcast.setup'

const commonStyles: Partial<CSSStyleDeclaration> = {
  position: 'fixed',
  borderRadius: '4px',
  boxShadow: '0px 3px 12px 0px rgba(0, 0, 0, 0.10)',
  backgroundColor: '#fff',
  border: 'solid 1px #D9D9DD',
  transition: 'right 2s'
}

const manuallyBlockingAdsOptions: ContentManuallyBlockingAdsOptions = {
  iframe: {
    url: '/content/manually-blocking-ads/index.html',
    style: {
      display: 'block',
      width: '280px',
      height: '420px',
      ...commonStyles
    }
  }
}

setupWorker('CSW')
setupContentBroadcast()
setupContentManuallyBlockingAds(manuallyBlockingAdsOptions)

void (async () => {
  await dispatcher().work()
})()
