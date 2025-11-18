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
import { inject, injectable } from '@/utils/di/di.types'
import {
  InternalManuallyBlockingAdsIdentifiers,
  InternalManuallyBlockingAdsServiceInterface
} from '@/modules/manually-blocking-ads/internal/manually-blocking-ads.types'
import { UserRulesStorage } from '@/modules/manually-blocking-ads/internal/storage/user-rules.storage'
import { dispatcher } from '@/utils/setup-worker'
import {
  ManuallyBlockingAdsMessages,
  ManuallyBlockingAdsRulesUpdatedMessage
} from '@/modules/manually-blocking-ads/common/manually-blocking-ads.messages'

@injectable()
export class ManuallyBlockingAdsService implements InternalManuallyBlockingAdsServiceInterface {
  constructor (
    @inject(InternalManuallyBlockingAdsIdentifiers._storage)
    private readonly storage: UserRulesStorage
  ) {
  }

  async addRule (ruleText: string): Promise<void> {
    const existing = await this.storage.get()
    if (existing.includes(ruleText)) {
      return
    }
    existing.push(ruleText)
    await this.storage.set(existing)
    await dispatcher().sendMessage({ type: ManuallyBlockingAdsMessages.rulesUpdated })
  }

  async getUserRules (): Promise<string[]> {
    return this.storage.get()
  }

  async resetRules (rules: string[]): Promise<void> {
    const existingRules = await this.storage.get()
    const newRules = existingRules
      .filter(rule => !rules.includes(rule))
    await this.storage.set(newRules)

    const message: ManuallyBlockingAdsRulesUpdatedMessage = {
      type: ManuallyBlockingAdsMessages.rulesUpdated,
      payload: {
        needReload: true
      }
    }
    await dispatcher().sendMessage(message)
  }
}
