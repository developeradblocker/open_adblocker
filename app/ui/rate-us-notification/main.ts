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
import InlineSvg from 'vue-inline-svg'
import './style.less'
import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { setupContentBroadcast, useContentBroadcast } from '@/modules/broadcast/content/broadcast.setup'
import { setupUIRateUs } from '@/modules/rate-us/ui/rate-us.setup'
import { UserActivityMessage, UserActivityMessages } from '@/modules/user-activity/common/user-activity.messages'
import { UserActivityType, UserPageVisited } from '@/modules/user-activity/common/user-activity.types'
import { POPUP_ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { RATE_US_ALARM_NAME } from '@/modules/rate-us/constants'
import { v4 as uuidv4 } from 'uuid'

setupWorker('RateUsNotification')
setupContentBroadcast()
setupUIRateUs();

(async (): Promise<void> => {
  const app = createApp(App)
  const sessionId = uuidv4()
  app.component('BaseSvg', InlineSvg)
  app.provide('sessionId', sessionId)
  await dispatcher().work()
  app.mount('#rate-us')

  const activity: UserPageVisited = {
    sessionId,
    type: UserActivityType.visitPage,
    page: POPUP_ROUTE.RATE_US
  }
  const message: UserActivityMessage = {
    type: UserActivityMessages.activity,
    payload: activity
  }
  useContentBroadcast().sendMessageToIframes(message)
  await chrome.alarms.clear(RATE_US_ALARM_NAME)
})()
