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
import {
  ImportSettingsMessage,
  SettingsMessages
} from '@/modules/settings/common/settings.messages'
import { SettingsInterface } from '@/modules/settings/common/settings.types'
import { InternalSettingsIdentifiers } from '@/modules/settings/internal/settings.types'

@injectable()
export class ImportSettingsListener implements AppMessageListener<ImportSettingsMessage, boolean> {
  constructor (
    @inject(InternalSettingsIdentifiers.service)
    private settings: SettingsInterface
  ) {
  }

  on (): SettingsMessages.import {
    return SettingsMessages.import
  }

  main (): true {
    return true
  }

  async handle ({ message }: Box<ImportSettingsMessage>): Promise<boolean> {
    return await this.settings.import(message.payload)
  }
}
