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
import { inject, injectable } from '@/utils/di/di.types'
import { AppMessageListener, Box } from '@/utils/dispatcher/dispatcher.types'
import { WhitelistInterface } from '../../common/whetelist.types'
import { WhitelistImportMessage, WhitelistMessages } from '../../common/whitelist.messages'
import { WhitelistIdentifiers } from '../whitelist.types'
import { dispatcher } from '@/utils/setup-worker'

@injectable()
export class WhitelistImportListener implements AppMessageListener<WhitelistImportMessage, Domain[]> {
  constructor (
      @inject(WhitelistIdentifiers.service)
      private readonly service: WhitelistInterface
  ) {}

  on (): WhitelistMessages.import {
    return WhitelistMessages.import
  }

  main (): true {
    return true
  }

  async handle ({ message }: Box<WhitelistImportMessage>): Promise<Domain[]> {
    const res = await this.service.import(message.payload.domainString)
    dispatcher().sendMessage({
      type: WhitelistMessages.listUpdated
    })
    return res
  }
}
