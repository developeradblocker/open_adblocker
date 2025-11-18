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
import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import InlineSvg from 'vue-inline-svg'
import './style.less'
import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { setupContentBroadcast } from '@/modules/broadcast/content/broadcast.setup'
import { setupUIManuallyBlockingAds } from '@/modules/manually-blocking-ads/ui/manually-blocking-ads.setup'
import { createPinia, Pinia } from 'pinia'
import { useBlockElementStore } from '@/ui/manually-blocking-ads/store/block-element.store'

setupWorker('ManuallyBlockingAds')
setupContentBroadcast()
setupUIManuallyBlockingAds();

(async (): Promise<void> => {
  const app = createApp(App)
  const pinia: Pinia = createPinia()

  const params: URLSearchParams = new URLSearchParams(window.location.search)
  const payload: string[] = JSON.parse(params.get('payload'))
  app.use(router)
  app.use(pinia)
  app.component('BaseSvg', InlineSvg)
  useBlockElementStore().$patch({
    appliedRules: payload
  })
  await dispatcher().work()
  app.mount('#manually-blocking-ads')
})()
