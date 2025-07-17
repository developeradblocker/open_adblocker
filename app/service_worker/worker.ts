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

import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { logger } from '@/utils/logger/logger'
import { setupInternalAdBlocker } from '@/modules/ad-blocker/internal/ad-blocker.setup'
import { setupInternalPortChannel } from '@/modules/port/internal/port.setup'
import { setupInternalApp } from '@/modules/app/internal/app.setup'
import { setupInternalRateUs } from '@/modules/rate-us/internal/rate-us.setup'
import { setupPopupIcon } from '@/modules/popup-icon/internal/popup-icon.setup'
import { setupAdGuard } from '@/modules/aguard/internal/adguard.setup'
import { onHandledAllRequiredMessages } from '@/utils/on-handled-all-required-messages'
import { requiredMessages } from '@/service_worker/required-messages'
import { AppMessages } from '@/modules/app/common/app.messages'
import { setupInternalWhitelist } from '@/modules/whitelist/internal/whitelist.setup'
import { setupUserActivity } from '@/modules/user-activity/internal/user-activity.setup'

logger.info('Service Worker preparing')
/**
 * Service Worker (SW)
 */
setupWorker('SW')
setupAdGuard()
setupInternalPortChannel()
setupInternalWhitelist()
setupInternalAdBlocker()
setupUserActivity()
setupInternalRateUs()
setupInternalApp()
setupPopupIcon();

(async (): Promise<void> => {
  /**
   * dispatcher has to release messages only when all required messages are handled
   */
  const requiredMessagesWithApp = [
    ...requiredMessages,
    AppMessages.ready
  ]
  onHandledAllRequiredMessages(requiredMessagesWithApp, async (): Promise<void> => {
    logger.info('Service Worker start working')
    await dispatcher().work()
  })
})()
