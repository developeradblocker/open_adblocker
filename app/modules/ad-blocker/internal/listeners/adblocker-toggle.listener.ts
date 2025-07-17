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
import { AdBlockerMessages, AdBlockerToggleMessage } from '../../common/ad-blocker.messages'
import { inject, injectable } from '@/utils/di/di.types'
import { InternalAdBlockerIdentifiers, InternalAdBlockerInterface } from '@/modules/ad-blocker/internal/ad-blocker.types'
import { counterByTab } from '@/modules/ad-blocker/internal/utils'
import { getActiveTabHelper } from '@/helpers/get-active-tab.helper'

@injectable()
export class AdBlockerToggleListener implements AppMessageListener<AdBlockerToggleMessage> {
  constructor (
    @inject(InternalAdBlockerIdentifiers.adBlocker)
    private adBlocker: InternalAdBlockerInterface
  ) {
  }

  on (): AdBlockerMessages.toggle {
    return AdBlockerMessages.toggle
  }

  main (): false {
    return false
  }

  async handle ({ message }: Box<AdBlockerToggleMessage>): Promise<void> {
    const tab = await getActiveTabHelper()
    await counterByTab().reset(tab.id)
    await this.adBlocker.toggle(message.payload)
    await chrome.tabs.reload()
  }
}
