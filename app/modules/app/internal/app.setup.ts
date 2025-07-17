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

import { GetStateListener } from './listeners/get-state.listener'
import { onHandledAllRequiredMessages } from '@/utils/on-handled-all-required-messages'
import { requiredMessages } from '@/service_worker/required-messages'
import { AppMessages, AppOnReadyMessage, AppUpdateStateMessage } from '@/modules/app/common/app.messages'
import { dispatcher } from '@/utils/setup-worker'
import { InternalAppIdentifiers } from '@/modules/app/internal/app.types'
import { InternalAppService } from '@/modules/app/internal/services/app.service'
import { useInternalPort } from '@/modules/port/internal/port.setup'
import { internalApp } from '@/modules/app/internal/utils'
import { onBlockedAd, onToggledAdBlocker } from '@/modules/ad-blocker/internal/expose.messages'
import { Injection } from '@/utils/inject/inject.types'
import { inject } from '@/utils/inject/inject'

const injections: Injection[] = [
  {
    key: InternalAppIdentifiers.service,
    use: InternalAppService
  }
]

export const setupInternalApp = (): void => {
  onHandledAllRequiredMessages(requiredMessages, handleOnAppReady)
}

export const handleOnAppReady = async (): Promise<void> => {
  inject(injections)
  dispatcher().onWithClass(GetStateListener)

  onBlockedAd(handleStateUpdated)
  onToggledAdBlocker(handleStateUpdated)

  const message: AppOnReadyMessage = {
    type: AppMessages.ready,
    force: true
  }
  await dispatcher().sendMessage(message)
}

export const handleStateUpdated = async (): Promise<void> => {
  const port = useInternalPort()
  const message: AppUpdateStateMessage = {
    type: AppMessages.updateState,
    payload: await internalApp().getState()
  }
  await port.sendMessageToAllPorts(message)
}
