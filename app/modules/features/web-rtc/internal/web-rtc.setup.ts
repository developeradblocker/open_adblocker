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
import { dispatcher } from '@/utils/setup-worker'
import { InternalWebRTCIdentifiers } from '@/modules/features/web-rtc/internal/web-rtc.types'
import { WebRTCService } from '@/modules/features/web-rtc/internal/services/web-rtc.service'
import { Injection } from '@/utils/inject/inject.types'
import { inject } from '@/utils/inject/inject'
import { WebRTCToggleListener } from '@/modules/features/web-rtc/internal/listeners/web-rtc-toggle.listener'
import { onPermissionsAddedHandler } from '@/modules/features/web-rtc/internal/handlers/on-permissions-added.handler'

const injections: Injection[] = [
  {
    key: InternalWebRTCIdentifiers.service,
    use: WebRTCService
  }
]
export const setupInternalWebRTC = (): void => {
  inject(injections)
  chrome.permissions.onAdded.addListener(onPermissionsAddedHandler)
  dispatcher().onWithClass(WebRTCToggleListener)
}
