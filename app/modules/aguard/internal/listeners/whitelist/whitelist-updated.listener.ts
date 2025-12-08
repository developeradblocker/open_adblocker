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
import { getDomainsWithSubDomains } from '@/helpers/get-domains-with-subdomains.helper'
import { AdGuardIdentifiers } from '@/modules/aguard/internal/adguaird.types'
import { WhitelistInterface } from '@/modules/whitelist/common/whetelist.types'
import { WhitelistMessages, WhitelistUpdatedMessage } from '@/modules/whitelist/common/whitelist.messages'
import { WhitelistIdentifiers } from '@/modules/whitelist/internal/whitelist.types'
import { inject, injectable } from '@/utils/di/di.types'
import { AppMessageListener } from '@/utils/dispatcher/dispatcher.types'
import { ConfigurationMV3 } from '@adguard/tswebextension/dist/types/lib/mv3/background/configuration'
import { TsWebExtension } from '@adguard/tswebextension/mv3'

@injectable()
export class WhitelistUpdatedListener implements AppMessageListener<WhitelistUpdatedMessage> {
  constructor (
    @inject(AdGuardIdentifiers._tsWebExtension)
    private readonly tsWebExtension: TsWebExtension,

    @inject(AdGuardIdentifiers._config)
    private readonly config: ConfigurationMV3,

    @inject(WhitelistIdentifiers.service)
    private readonly service: WhitelistInterface
  ) {
  }

  on (): WhitelistMessages.listUpdated {
    return WhitelistMessages.listUpdated
  }

  main (): false {
    return false
  }

  async handle (): Promise<void> {
    this.config.allowlist = getDomainsWithSubDomains(await this.service.getDomains())
    await this.tsWebExtension.configure(this.config)
  }
}
