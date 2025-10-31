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
import { createPinia } from 'pinia'
import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { logger } from '@/utils/logger/logger'
import { setupExternalPortChannel } from '@/modules/port/external/port.setup'
import InlineSvg from 'vue-inline-svg'

import { routes } from '@/ui/settings/router/routes'

/**
 * Settings Worker (PW)
 */
setupWorker('Settings')
setupExternalPortChannel({ name: 'Settings' });

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
  app.mount('#settings-app')
})()
