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
import { AppMessageListener } from '@/utils/dispatcher/dispatcher.types'
import { WhitelistInterface } from '../../common/whetelist.types'
import { WhitelistExportMessage, WhitelistMessages } from '../../common/whitelist.messages'
import { WhitelistIdentifiers } from '../whitelist.types'

@injectable()
export class WhitelistExportListener implements AppMessageListener<WhitelistExportMessage, Domain[]> {
  constructor (
      @inject(WhitelistIdentifiers.service)
      private readonly service: WhitelistInterface
  ) {}

  on (): WhitelistMessages.export {
    return WhitelistMessages.export
  }

  main (): true {
    return true
  }

  async handle (): Promise<Domain[]> {
    return await this.service.getDomains()
  }
}
