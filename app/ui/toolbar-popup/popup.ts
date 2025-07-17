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

import { createRouter, createWebHashHistory, RouteLocationNormalized, RouterOptions } from 'vue-router'
import App from './app.vue'
import { createPinia } from 'pinia'
import { routes } from './router/routes'
import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { logger } from '@/utils/logger/logger'
import { setupExternalPortChannel } from '@/modules/port/external/port.setup'
import InlineSvg from 'vue-inline-svg'
import './style.less'
import { v4 as uuidv4 } from 'uuid'

import { setupExternalAdBlocker } from '@/modules/ad-blocker/external/ad-blocker.setup'
import { setupExternalApp } from '@/modules/app/external/app.setup'
import { setupUserActivity } from '@/modules/user-activity/external/user-activity.setup'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { PageUI } from '@/modules/user-activity/common/user-activity.types'

/**
 * Popup Worker (PW)
 */
setupWorker('PW')
setupExternalPortChannel({ name: 'PW' })
setupExternalAdBlocker()
setupUserActivity(uuidv4())
setupExternalApp();

(async (): Promise<void> => {
  await dispatcher().work()
  logger.info('Popup started...')
  const routerOpts: RouterOptions = {
    history: createWebHashHistory(),
    routes
  }
  const app = createApp(App)
  const router = createRouter(routerOpts)
  app.use(router)

  router.afterEach((to: RouteLocationNormalized): void => {
    const activity = useUserActivity()
    activity.visitPage(to.name as PageUI)
  })

  app.use(createPinia())
  app.component('BaseSvg', InlineSvg)
  app.mount('#app')
})()
