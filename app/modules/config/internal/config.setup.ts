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
import { InternalConfigIdentifiers } from '@/modules/config/internal/config.types'
import { ConfigService } from '@/modules/config/internal/service/config.service'
import { ConfigStorage } from '@/modules/config/internal/storage/config.storage'
import { Injection } from '@/utils/inject/inject.types'
import { inject } from '@/utils/inject/inject'
import { useInternalConfig } from '@/modules/config/internal/config.utils'
import { dispatcher } from '@/utils/setup-worker'
import { ConfigMessages, ConfigOnReadyMessage } from '@/modules/config/common/config.messages'
import { CONFIG_ALARM } from '@/modules/config/common/config.constants'
import Alarm = chrome.alarms.Alarm;

export const setupInternalConfig = (url: string, intervalDays: number): void => {
  const injections: Injection[] = [
    {
      key: InternalConfigIdentifiers.service,
      use: ConfigService
    },
    {
      key: InternalConfigIdentifiers._storage,
      use: ConfigStorage
    },
    {
      key: InternalConfigIdentifiers.url,
      use: url,
      value: true
    },
    {
      key: InternalConfigIdentifiers.intervalDays,
      use: intervalDays,
      value: true
    }
  ]
  inject(injections)
  setupConfigAsync()
}

const setupConfigAsync = async (): Promise<void> => {
  settingAlarm()
  await useInternalConfig().update()
  const message: ConfigOnReadyMessage = {
    type: ConfigMessages.ready,
    force: true
  }
  await dispatcher().sendMessage(message)
}

const settingAlarm = (): void => {
  chrome.alarms.onAlarm.addListener(({ name }: Alarm) => {
    if (name === CONFIG_ALARM) {
      useInternalConfig().update()
    }
  })
}
