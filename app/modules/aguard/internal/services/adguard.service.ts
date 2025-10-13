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
import { AdGuardIdentifiers, AdGuardServiceInterface } from '@/modules/aguard/internal/adguaird.types'
import { Domain } from '@/common/types'
import { inject, injectable } from '@/utils/di/di.types'
import { TsWebExtension } from '@adguard/tswebextension/mv3'
import { ConfigurationMV3 } from '@adguard/tswebextension/dist/types/lib/mv3/background/configuration'
import { WhitelistIdentifiers } from '@/modules/whitelist/internal/whitelist.types'
import { WhitelistInterface } from '@/modules/whitelist/common/whetelist.types'

@injectable()
export class AdGuardService implements AdGuardServiceInterface {
  constructor (
    @inject(AdGuardIdentifiers._config)
    private readonly config: ConfigurationMV3,

    @inject(AdGuardIdentifiers._tsWebExtension)
    private readonly tsWebExtension: TsWebExtension,

    @inject(WhitelistIdentifiers.service)
    private readonly whitelist: WhitelistInterface
  ) {
  }

  /**
   * check if ad blocking is paused for the specified domain
   * @param domain
   */
  async isPaused (domain: Domain): Promise<boolean> {
    return await this.whitelist.hasDomain(domain)
  }

  /**
   * disable ad blocking for the specified domain
   * @param domain
   */
  async addToAllowlist (domain: Domain): Promise<void> {
    if (await this.whitelist.hasDomain(domain)) {
      return
    }
    await this.whitelist.addDomain(domain)
    this.config.allowlist.push(domain)
    await this.tsWebExtension.configure(this.config)
  }

  /**
   * enable ad blocking for the specified domain
   * @param domain
   */
  async removeFromAllowlist (domain: Domain): Promise<void> {
    if (!(await this.whitelist.hasDomain(domain))) {
      return
    }

    const updatedList = await this.whitelist.removeDomain(domain)
    this.config.allowlist = updatedList
    await this.tsWebExtension.configure(this.config)
  }
}
