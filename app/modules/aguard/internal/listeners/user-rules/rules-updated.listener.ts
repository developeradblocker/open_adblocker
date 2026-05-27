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
import { inject, injectable } from '@/utils/di/di.types'
import { AdGuardIdentifiers } from '@/modules/aguard/internal/adguaird.types'
import { TsWebExtension } from '@adguard/tswebextension/mv3'
import { ConfigurationMV3 } from '@adguard/tswebextension/dist/types/lib/mv3/background/configuration'
import {
  ManualBlockingMessages,
  ManualBlockingRulesUpdatedMessage
} from '@/modules/features/manual-blocking/common/manual-blocking.messages'
import { FilterList } from '@adguard/tsurlfilter'
import {
  InternalManualBlockingIdentifiers,
  InternalManualBlockingServiceInterface
} from '@/modules/features/manual-blocking/internal/manual-blocking.types'

@injectable()
export class RulesUpdatedListener implements AppMessageListener<ManualBlockingRulesUpdatedMessage> {
  constructor (
    @inject(AdGuardIdentifiers._tsWebExtension)
    private readonly tsWebExtension: TsWebExtension,

    @inject(AdGuardIdentifiers._config)
    private readonly config: ConfigurationMV3,

    @inject(InternalManualBlockingIdentifiers.service)
    private readonly service: InternalManualBlockingServiceInterface
  ) {
  }

  on (): ManualBlockingMessages.rulesUpdated {
    return ManualBlockingMessages.rulesUpdated
  }

  main (): false {
    return false
  }

  async handle ({ message }: Box<ManualBlockingRulesUpdatedMessage>): Promise<void> {
    const userRules = await this.service.getUserRules()

    const userRulesFilter = new FilterList(userRules.join('\n'))
    this.config.userrules = {
      content: userRulesFilter.getContent(),
      conversionData: userRulesFilter.getConversionData()
    }
    await this.tsWebExtension.configure(this.config)

    if (message.payload.needReload) {
      await chrome.tabs.reload()
    }
  }
}
