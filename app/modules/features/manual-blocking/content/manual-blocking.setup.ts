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
import { inject } from '@/utils/inject/inject'
import {
  ContentManualBlockingIdentifiers,
  ContentManualBlockingOptions
} from '@/modules/features/manual-blocking/content/manual-blocking.types'
import { IframeManager } from '@/modules/features/manual-blocking/content/services/iframe.manager'
import { dispatcher } from '@/utils/setup-worker'
import { StartManualAdBlockingListener } from '@/modules/features/manual-blocking/content/listeners/start.listener'
import { StopManualAdBlockingListener } from '@/modules/features/manual-blocking/content/listeners/stop.listener'
import { SelectorService } from '@/modules/features/manual-blocking/content/services/selector.service'
import { ChangeElementListener } from '@/modules/features/manual-blocking/content/listeners/change-element.listener'
import {
  EnterPreviewStateListener
} from '@/modules/features/manual-blocking/content/listeners/enter-preview-state.listener'
import { ExitPreviewStateListener } from '@/modules/features/manual-blocking/content/listeners/exit-preview-state.listener'
import { CloseManualAdBlockingListener } from '@/modules/features/manual-blocking/content/listeners/close.listener'
import { BlockElementListener } from '@/modules/features/manual-blocking/content/listeners/block-element.listener'
import { SelectElementListener } from '@/modules/features/manual-blocking/content/listeners/select-element.listener'

export const setupContentManualBlocking = (options: ContentManualBlockingOptions): void => {
  inject([
    {
      key: ContentManualBlockingIdentifiers.iframeManager,
      use: IframeManager
    },
    {
      key: ContentManualBlockingIdentifiers.service,
      use: SelectorService
    },
    {
      key: ContentManualBlockingIdentifiers.options,
      use: options,
      value: true
    }
  ])

  dispatcher().onWithClass(StartManualAdBlockingListener)
  dispatcher().onWithClass(StopManualAdBlockingListener)
  dispatcher().onWithClass(ChangeElementListener)
  dispatcher().onWithClass(EnterPreviewStateListener)
  dispatcher().onWithClass(ExitPreviewStateListener)
  dispatcher().onWithClass(CloseManualAdBlockingListener)
  dispatcher().onWithClass(BlockElementListener)
  dispatcher().onWithClass(SelectElementListener)
}
