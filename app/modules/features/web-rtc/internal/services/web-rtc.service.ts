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
import { injectable } from 'inversify'
import { WebRTCInterface } from '@/modules/features/web-rtc/common/web-rtc.types'
import { checkWebRTCPermissions } from '@/modules/features/web-rtc/common/web-rtc.utils'
import { logger } from '@/utils/logger/logger'
import { WebRTCMessages, WebRTCStateChangedMessage } from '@/modules/features/web-rtc/common/web-rtc.messages'
import { dispatcher } from '@/utils/setup-worker'

@injectable()
export class WebRTCService implements WebRTCInterface {
  async setup (state: boolean): Promise<boolean> {
    try {
      if (state) {
        await chrome.privacy.network.webRTCIPHandlingPolicy.set({ value: chrome.privacy.IPHandlingPolicy.DISABLE_NON_PROXIED_UDP })
      } else {
        await chrome.privacy.network.webRTCIPHandlingPolicy.set({ value: chrome.privacy.IPHandlingPolicy.DEFAULT })
      }

      return true
    } catch (error) {
      logger.warn('WebRTCLeakPrevention: An error has occurred during setting the policy', error)
      return false
    }
  }

  async toggle (state: boolean): Promise<void> {
    const wasSetup = await this.setup(state)
    if (wasSetup) {
      const message: WebRTCStateChangedMessage = {
        type: WebRTCMessages.stateChanged,
        payload: {
          state
        }
      }
      await dispatcher().sendMessage(message)
    }
  }

  async getState (): Promise<boolean> {
    if (await checkWebRTCPermissions()) {
      const webRTCIpHandlingPolicy = await chrome.privacy.network.webRTCIPHandlingPolicy.get({})
      return webRTCIpHandlingPolicy.value === chrome.privacy.IPHandlingPolicy.DISABLE_NON_PROXIED_UDP
    } else {
      return false
    }
  }
}
