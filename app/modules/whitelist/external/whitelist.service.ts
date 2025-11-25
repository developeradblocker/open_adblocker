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
import { useExternalPort } from '@/modules/port/external/port.setup'
import { ExternalPortChannel } from '@/modules/port/external/port.types'
import { injectable } from 'inversify'
import { WhitelistImportMessage, WhitelistMessages } from '../common/whitelist.messages'
import { ExternalWhitelistInterface } from './whitelist.types'

@injectable()
export class ExternalWhitelistService implements ExternalWhitelistInterface {
  private port: ExternalPortChannel

  constructor () {
    this.port = useExternalPort()
  }

  async import (domainString: string): Promise<Domain[]> {
    const message: WhitelistImportMessage = {
      type: WhitelistMessages.import,
      payload: {
        domainString
      }
    }
    return await this.port.sendMessage(message)
  }

  async export (): Promise<Domain[]> {
    return await this.port.sendMessage({
      type: WhitelistMessages.export
    })
  }
}
