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
  setupContentManualBlocking
} from '@/modules/features/manual-blocking/content/manual-blocking.setup'
import { inject } from '@/utils/inject/inject'
import { dispatcher } from '@/utils/setup-worker'
import {
  ContentManualBlockingIdentifiers,
  type ContentManualBlockingOptions
} from '@/modules/features/manual-blocking/content/manual-blocking.types'
import { IframeManager } from '@/modules/features/manual-blocking/content/services/iframe.manager'
import { SelectorService } from '@/modules/features/manual-blocking/content/services/selector.service'
import { StartManualAdBlockingListener } from '@/modules/features/manual-blocking/content/listeners/start.listener'
import { StopManualAdBlockingListener } from '@/modules/features/manual-blocking/content/listeners/stop.listener'
import { ChangeElementListener } from '@/modules/features/manual-blocking/content/listeners/change-element.listener'
import { EnterPreviewStateListener } from '@/modules/features/manual-blocking/content/listeners/enter-preview-state.listener'
import { ExitPreviewStateListener } from '@/modules/features/manual-blocking/content/listeners/exit-preview-state.listener'
import { CloseManualAdBlockingListener } from '@/modules/features/manual-blocking/content/listeners/close.listener'
import { BlockElementListener } from '@/modules/features/manual-blocking/content/listeners/block-element.listener'
import { SelectElementListener } from '@/modules/features/manual-blocking/content/listeners/select-element.listener'

jest.mock('@/assistant/adguard-rules-constructor', () => ({
  __esModule: true,
  default: {
    constructRuleText: jest.fn()
  }
}), { virtual: true })

jest.mock('@/utils/inject/inject', () => ({
  inject: jest.fn()
}))

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))

describe('setupContentManualBlocking', () => {
  const onWithClassMock = jest.fn()
  const options: ContentManualBlockingOptions = {
    iframe: {
      url: 'manual-blocking.html',
      style: { width: '320px' }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    onWithClassMock.mockClear()
    jest.mocked(dispatcher).mockReturnValue({
      onWithClass: onWithClassMock
    } as any)
  })

  it('injects services/options and registers all listeners', () => {
    setupContentManualBlocking(options)

    expect(inject).toHaveBeenCalledWith([
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

    expect(onWithClassMock).toHaveBeenCalledWith(StartManualAdBlockingListener)
    expect(onWithClassMock).toHaveBeenCalledWith(StopManualAdBlockingListener)
    expect(onWithClassMock).toHaveBeenCalledWith(ChangeElementListener)
    expect(onWithClassMock).toHaveBeenCalledWith(EnterPreviewStateListener)
    expect(onWithClassMock).toHaveBeenCalledWith(ExitPreviewStateListener)
    expect(onWithClassMock).toHaveBeenCalledWith(CloseManualAdBlockingListener)
    expect(onWithClassMock).toHaveBeenCalledWith(BlockElementListener)
    expect(onWithClassMock).toHaveBeenCalledWith(SelectElementListener)
  })
})
