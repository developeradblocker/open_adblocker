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
import { inject, injectable } from '@/utils/di/di.types'
import {
  ApiConfig,
  ConfigServiceInterface,
  ConfigStorageInterface,
  InternalConfigIdentifiers
} from '@/modules/config/internal/config.types'
import { CONFIG_ALARM } from '@/modules/config/common/config.constants'
import { dayToMin } from '@/helpers/time/day-to-min'
import { dayToMs } from '@/helpers/time/day-to-ms'
import { UtilsIdentifiers } from '@/utils/utils-Identifiers'
import { LoggerInterface } from '@/utils/logger/logger.types'
import { Config } from '@/modules/config/common/config.types'

@injectable()
export class ConfigService implements ConfigServiceInterface {
  constructor (
    @inject(InternalConfigIdentifiers._storage)
    private readonly storage: ConfigStorageInterface,

    @inject(InternalConfigIdentifiers.url)
    private readonly url: string,

    @inject(InternalConfigIdentifiers.intervalDays)
    private readonly intervalDays: number,

    @inject(UtilsIdentifiers.logger)
    private readonly logger: LoggerInterface
  ) {}

  async get (): Promise<Config> {
    const { config } = await this.storage.get()
    return config
  }

  async update (): Promise<void> {
    const config = await this.storage.get()
    if (!this.shouldUpdate(config.updated)) {
      return
    }

    try {
      const response = await fetch(`${this.url}/rest/v3/configs/extensions/open-ad-blocker`)
      const config: ApiConfig = await response.json()
      await this.storage.set(config)
      await this.setupAlarm()
    } catch (error) {
      this.logger.error('ConfigService: failed to update config:', error)
    }
  }

  private shouldUpdate (updatedTs: number): boolean {
    if (!updatedTs) {
      return true
    }
    const timePassed = Date.now() - updatedTs
    const intervalInMs = dayToMs(this.intervalDays)
    return timePassed >= intervalInMs
  }

  private async setupAlarm (): Promise<void> {
    if (await chrome.alarms.get(CONFIG_ALARM)) {
      return
    }
    await chrome.alarms.create(CONFIG_ALARM, { periodInMinutes: dayToMin(this.intervalDays) })
  }
}
