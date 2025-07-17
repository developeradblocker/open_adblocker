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
import {
  CounterByTabInterface,
  CounterTotalInterface,
  InternalAdBlockerIdentifiers,
  InternalAdBlockerInterface
} from '@/modules/ad-blocker/internal/ad-blocker.types'
import { inject, injectable } from '@/utils/di/di.types'
import { BlockedAdsCounter, Domain } from '@/common/types'
import { AdGuardIdentifiers, AdGuardServiceInterface } from '@/modules/aguard/internal/adguaird.types'
import { getActiveTabHelper } from '@/helpers/get-active-tab.helper'
import { getDomainHelper } from '@/helpers/get-domain.helper'

@injectable()
export class InternalAdBlockerService implements InternalAdBlockerInterface {
  constructor (
    @inject(AdGuardIdentifiers.adGuardService)
    private readonly adGuard: AdGuardServiceInterface,

    @inject(InternalAdBlockerIdentifiers._counterByTab)
    private readonly counterByTab: CounterByTabInterface,

    @inject(InternalAdBlockerIdentifiers._totalCounter)
    private readonly totalCounter: CounterTotalInterface
  ) {
  }

  /**
   * Check if the ad blocker is paused for a specific domain
   * @param domain
   */
  async isPaused (domain: Domain): Promise<boolean> {
    return await this.adGuard.isPaused(domain)
  }

  /**
   * Toggle the ad blocker state for a specific domain
   *
   * true - disable ad blocker
   * false - enable ad blocker
   * @param state
   */
  async toggle (state: boolean): Promise<void> {
    const tab = await getActiveTabHelper()
    if (!tab?.url) {
      return
    }
    const domain = getDomainHelper(tab.url)
    state
      ? await this.adGuard.addToAllowlist(domain)
      : await this.adGuard.removeFromAllowlist(domain)
  }

  /**
   * Get number of blocked ads on the specified tab
   * @param tabId
   */
  async getAdCounterByTabId (tabId: number): Promise<BlockedAdsCounter> {
    return await this.counterByTab.get(tabId)
  }

  /**
   * Get number of total blocked ads
   */
  async getTotalAdCounter (): Promise<BlockedAdsCounter> {
    return await this.totalCounter.get()
  }
}
