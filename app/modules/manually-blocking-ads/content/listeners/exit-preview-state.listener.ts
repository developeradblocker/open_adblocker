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
import { AppMessageListener } from '@/utils/dispatcher/dispatcher.types'
import {
  ManuallyBlockingAdsExitPreviewMessage,
  ManuallyBlockingAdsMessages
} from '@/modules/manually-blocking-ads/common/manually-blocking-ads.messages'
import { inject, injectable } from '@/utils/di/di.types'
import {
  ContentManuallyBlockingAdsIdentifiers
} from '@/modules/manually-blocking-ads/content/manually-blocking-ads.types'
import { SelectorService } from '@/modules/manually-blocking-ads/content/services/selector.service'

@injectable()
export class ExitPreviewStateListener implements AppMessageListener<ManuallyBlockingAdsExitPreviewMessage> {
  constructor (
    @inject(ContentManuallyBlockingAdsIdentifiers.service)
    private readonly selector: SelectorService
  ) {}

  on (): ManuallyBlockingAdsMessages.exitPreview {
    return ManuallyBlockingAdsMessages.exitPreview
  }

  main (): false {
    return false
  }

  async handle (): Promise<void> {
    this.selector.exitPreview()
  }
}
