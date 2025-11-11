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
import { AppMessageListener } from '@/utils/dispatcher/dispatcher.types'
import { inject, injectable } from '@/utils/di/di.types'
import { AdBlockerMessages, AdBlockerStateChanged } from '@/modules/ad-blocker/common/ad-blocker.messages'
import { SettingsInterface } from '@/modules/settings/common/settings.types'
import { InternalSettingsIdentifiers } from '@/modules/settings/internal/settings.types'
import { useInternalPort } from '@/modules/port/internal/port.setup'
import { SettingsMessages, SettingsUpdateStateMessage } from '@/modules/settings/common/settings.messages'

@injectable()
export class WhitelistStateChangedListener implements AppMessageListener<AdBlockerStateChanged> {
  constructor (
    @inject(InternalSettingsIdentifiers.service)
    private readonly service: SettingsInterface
  ) {
  }

  on (): AdBlockerMessages.stateChanged {
    return AdBlockerMessages.stateChanged
  }

  main (): false {
    return false
  }

  async handle (): Promise<void> {
    const port = useInternalPort()
    const message: SettingsUpdateStateMessage = {
      type: SettingsMessages.updateState,
      payload: await this.service.get()
    }
    await port.sendMessageToAllPorts(message)
  }
}
