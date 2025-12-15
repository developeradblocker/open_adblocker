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
import { StartManualAdBlockingListener } from '@/modules/features/manual-blocking/content/listeners/start.listener'
import { StopManualAdBlockingListener } from '@/modules/features/manual-blocking/content/listeners/stop.listener'
import { ChangeElementListener } from '@/modules/features/manual-blocking/content/listeners/change-element.listener'
import { EnterPreviewStateListener } from '@/modules/features/manual-blocking/content/listeners/enter-preview-state.listener'
import { ExitPreviewStateListener } from '@/modules/features/manual-blocking/content/listeners/exit-preview-state.listener'
import { CloseManualAdBlockingListener } from '@/modules/features/manual-blocking/content/listeners/close.listener'
import { BlockElementListener } from '@/modules/features/manual-blocking/content/listeners/block-element.listener'
import { SelectElementListener } from '@/modules/features/manual-blocking/content/listeners/select-element.listener'
import {
  ManualBlockingBlockElementMessage,
  ManualBlockingChangeElementMessage,
  ManualBlockingMessages,
  ManualBlockingStartMessage
} from '@/modules/features/manual-blocking/common/manual-blocking.messages'
import { Box } from '@/utils/dispatcher/dispatcher.types'

jest.mock('@/assistant/adguard-rules-constructor', () => ({
  __esModule: true,
  default: {
    constructRuleText: jest.fn()
  }
}), { virtual: true })

describe('Content manual blocking listeners', () => {
  const iframeManager = {
    start: jest.fn(),
    stop: jest.fn()
  }
  const selector = {
    start: jest.fn(),
    stop: jest.fn(),
    changeElement: jest.fn(),
    enterPreview: jest.fn(),
    exitPreview: jest.fn(),
    onClose: jest.fn(),
    blockElement: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    Object.values(selector).forEach((mock) => {
      if (typeof mock === 'function') {
        (mock as jest.Mock).mockClear()
      }
    })
  })

  it('StartManualAdBlockingListener starts iframe and selector', async () => {
    const listener = new StartManualAdBlockingListener(iframeManager as any, selector as any)

    expect(listener.on()).toBe(ManualBlockingMessages.start)
    expect(listener.main()).toBe(false)

    await listener.handle({
      message: {
        type: ManualBlockingMessages.start,
        payload: { tabId: 1, appliedRules: ['rule'], sessionId: 'session-id' }
      }
    } as Box<ManualBlockingStartMessage>)

    expect(iframeManager.start).toHaveBeenCalledWith(['rule'], 'session-id')
    expect(selector.start).toHaveBeenCalledTimes(1)
  })

  it('StopManualAdBlockingListener stops iframe and selector', async () => {
    const listener = new StopManualAdBlockingListener(iframeManager as any, selector as any)
    await listener.handle()
    expect(iframeManager.stop).toHaveBeenCalled()
    expect(selector.stop).toHaveBeenCalled()
  })

  it('ChangeElementListener forwards payload', async () => {
    const listener = new ChangeElementListener(selector as any)
    await listener.handle({
      message: {
        type: ManualBlockingMessages.changeElement,
        payload: { newIndex: 3 }
      }
    } as Box<ManualBlockingChangeElementMessage>)
    expect(selector.changeElement).toHaveBeenCalledWith(3)
  })

  it('Enter/Exit/Select listeners call respective selector methods', async () => {
    await new EnterPreviewStateListener(selector as any).handle()
    expect(selector.enterPreview).toHaveBeenCalled()

    await new ExitPreviewStateListener(selector as any).handle()
    expect(selector.exitPreview).toHaveBeenCalled()

    await new SelectElementListener(selector as any).handle()
    expect(selector.start).toHaveBeenCalled()
  })

  it('CloseManualAdBlockingListener stops iframe and resets selector', async () => {
    const listener = new CloseManualAdBlockingListener(iframeManager as any, selector as any)
    await listener.handle()
    expect(iframeManager.stop).toHaveBeenCalled()
    expect(selector.onClose).toHaveBeenCalled()
  })

  it('BlockElementListener forwards payload to selector', async () => {
    const listener = new BlockElementListener(selector as any)
    await listener.handle({
      message: {
        type: ManualBlockingMessages.blockElement,
        payload: { allWebsites: true, blockSimilar: false }
      }
    } as Box<ManualBlockingBlockElementMessage>)
    expect(selector.blockElement).toHaveBeenCalledWith(true, false)
  })
})
