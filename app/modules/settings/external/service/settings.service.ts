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
import { injectable } from '@/utils/di/di.types'
import { useExternalPort } from '@/modules/port/external/port.setup'
import { ExternalPortChannel } from '@/modules/port/external/port.types'
import { ExportedSettings, OpenADBSettings, SettingsInterface } from '@/modules/settings/common/settings.types'
import {
  ExportSettingsMessage, GetSettingsMessage,
  ImportSettingsMessage,
  SettingsMessages
} from '@/modules/settings/common/settings.messages'

@injectable()
export class SettingsService implements SettingsInterface {
  private readonly port: ExternalPortChannel
  constructor () {
    this.port = useExternalPort()
  }

  async export (): Promise<ExportedSettings> {
    const message: ExportSettingsMessage = {
      type: SettingsMessages.export
    }

    return await this.port.sendMessage<ExportedSettings>(message)
  }

  async import (content: string): Promise<boolean> {
    const message: ImportSettingsMessage = {
      type: SettingsMessages.import,
      payload: content
    }

    return await this.port.sendMessage<boolean>(message)
  }

  async get (): Promise<OpenADBSettings> {
    const message: GetSettingsMessage = {
      type: SettingsMessages.get
    }

    return await this.port.sendMessage<OpenADBSettings>(message)
  }
}
