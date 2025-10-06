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
import { FiltersMessages, FiltersUpdatedMessage } from '@/modules/filters/common/filters.messages'
import { inject, injectable } from '@/utils/di/di.types'
import { AdGuardIdentifiers } from '@/modules/aguard/internal/adguaird.types'
import { TsWebExtension } from '@adguard/tswebextension/mv3'
import { ConfigurationMV3 } from '@adguard/tswebextension/dist/types/lib/mv3/background/configuration'

@injectable()
export class FiltersUpdatedListener implements AppMessageListener<FiltersUpdatedMessage> {
  constructor (
    @inject(AdGuardIdentifiers._tsWebExtension)
    private readonly tsWebExtension: TsWebExtension,

    @inject(AdGuardIdentifiers._config)
    private readonly config: ConfigurationMV3
  ) {
  }

  on (): FiltersMessages.filtersUpdated {
    return FiltersMessages.filtersUpdated
  }

  main (): false {
    return false
  }

  async handle ({ message }: Box<FiltersUpdatedMessage>): Promise<void> {
    const { enabledFilters } = message.payload
    this.config.staticFiltersIds = enabledFilters
    await this.tsWebExtension.configure(this.config)
  }
}
