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
import { createApp } from 'vue'

import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router'
import App from './app.vue'
import './style.less'
import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { logger } from '@/utils/logger/logger'
import { setupExternalPortChannel, useExternalPort } from '@/modules/port/external/port.setup'
import InlineSvg from 'vue-inline-svg'

import { routes } from '@/ui/settings/router/routes'
import { setupExternalSettings } from '@/modules/settings/external/settings.setup'
import { setupExternalFilters } from '@/modules/filters/external/filters.setup'
import { createPinia } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { setupExternalUserActivity } from '@/modules/user-activity/external/user-activity.setup'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'
import { ClickEventToAction, ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { useSettingsStore } from './store/settings.store'
import { useExternalSettings } from '@/modules/settings/external/settings.utils'
import { setupExternalManualBlocking } from '@/modules/features/manual-blocking/external/manual-blocking.setup'
import { setupExternalWhitelist } from '@/modules/whitelist/external/whitelist.setup'
import './validations/validators'

/**
 * Settings Worker (Settings)
 */
setupWorker('Settings')
setupExternalPortChannel({ name: 'Settings' })
setupExternalUserActivity(uuidv4())
setupExternalFilters()
setupExternalManualBlocking()
setupExternalWhitelist()
setupExternalSettings();

(async (): Promise<void> => {
  await dispatcher().work()
  logger.info('Settings started...')
  const routerOpts: RouterOptions = {
    history: createWebHashHistory(),
    routes
  }
  const app = createApp(App)
  const router = createRouter(routerOpts)
  app.use(router)
  app.use(createPinia())

  app.component('BaseSvg', InlineSvg)

  const $settings = useExternalSettings()
  const $port = useExternalPort()
  const $store = useSettingsStore()

  await $port.establish()
  const settings = await $settings.get()
  $store.setSettingsInfo(settings)

  app.mount('#settings-app')

  useUserActivity().click(ElementsUI.settings, {
    page: SETTINGS_ROUTE.GENERAL,
    to: ClickEventToAction.openSettings
  })
})()
