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
import { Domain } from '@/common/types'
import { AppMessage } from '@/utils/dispatcher/dispatcher.types'

export enum WhitelistMessages {
  import = 'Whitelist.Import',
  export = 'Whitelist.Export',
  listUpdated = 'Whitelist.Updated'
}

export interface WhitelistImportMessage extends AppMessage {
  type: WhitelistMessages.import,
  payload: {
      rawDomain: Domain
  }
}

export interface WhitelistExportMessage extends AppMessage {
  type: WhitelistMessages.export
}

export interface WhitelistUpdatedMessage extends AppMessage {
  type: WhitelistMessages.listUpdated
}
