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
import { AppMessageListener, Box } from '@/utils/dispatcher/dispatcher.types'
import { inject, injectable } from '@/utils/di/di.types'
import { AdGuardIdentifiers } from '@/modules/aguard/internal/adguard.types'
import { ConfigurationMV3 } from '@adguard/tswebextension/dist/types/lib/mv3/background/configuration'
import { WebRTCMessages, WebRTCStateChangedMessage } from '@/modules/features/web-rtc/common/web-rtc.messages'

@injectable()
export class WebRTCStateChangedListener implements AppMessageListener<WebRTCStateChangedMessage> {
  constructor (
    @inject(AdGuardIdentifiers._config)
    private readonly config: ConfigurationMV3
  ) {
  }

  on (): WebRTCMessages.stateChanged {
    return WebRTCMessages.stateChanged
  }

  main (): false {
    return false
  }

  async handle ({ message }: Box<WebRTCStateChangedMessage>): Promise<void> {
    const { state } = message.payload
    this.config.settings.stealth.blockWebRTC = state
  }
}
