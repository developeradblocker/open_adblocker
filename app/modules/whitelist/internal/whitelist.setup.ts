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

import { InternalWhitelistService } from '@/modules/whitelist/internal/whitelist.service'
import { WhitelistIdentifiers } from '@/modules/whitelist/internal/whitelist.types'
import { inject } from '@/utils/inject/inject'
import { Injection } from '@/utils/inject/inject.types'
import { dispatcher } from '@/utils/setup-worker'
import { WhitelistExportListener } from './listeners/export.listener'
import { WhitelistImportListener } from './listeners/import.listener'

const injections: Injection[] = [
  {
    key: WhitelistIdentifiers.service,
    use: InternalWhitelistService
  }
]

export const setupInternalWhitelist = (): void => {
  inject(injections)

  dispatcher().onWithClass(WhitelistImportListener)
  dispatcher().onWithClass(WhitelistExportListener)
}
