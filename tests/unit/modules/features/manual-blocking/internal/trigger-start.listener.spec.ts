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
import { TriggerStartManualBlockingListener } from '@/modules/features/manual-blocking/internal/listeners/trigger-start.listener'
import { ManualBlockingMessages, ManualBlockingTriggerStartMessage } from '@/modules/features/manual-blocking/common/manual-blocking.messages'
import { logger } from '@/utils/logger/logger'
import Tab = chrome.tabs.Tab
import { Box } from '@/utils/dispatcher/dispatcher.types'
jest.mock('@/utils/logger/logger', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn()
  }
}))

describe('TriggerStartManualBlockingListener', () => {
  const broadcast = {
    sendMessage: jest.fn()
  }
  const service = {
    getUserRules: jest.fn()
  }
  let queryMock: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    broadcast.sendMessage.mockClear()
    service.getUserRules.mockReset().mockResolvedValue([])
    queryMock = jest.fn()
    const chromeMock = {
      tabs: {
        query: queryMock
      }
    } as any
    global.chrome = chromeMock
  })

  it('logs a warning when no active tabs are available', async () => {
    const listener = new TriggerStartManualBlockingListener(broadcast as any, service as any)
    queryMock.mockImplementation(async () => [])

    await listener.handle({ message: { type: ManualBlockingMessages.triggerStart, payload: { sessionId: 'session-id' } } } as Box<ManualBlockingTriggerStartMessage>)
    expect(logger.warn).toHaveBeenCalledWith('No active tab found')
    expect(broadcast.sendMessage).not.toHaveBeenCalled()
  })

  it('filters rules by current domain and sends a start message', async () => {
    const listener = new TriggerStartManualBlockingListener(broadcast as any, service as any)
    const tabs = [{ id: 10, url: 'https://www.example.com:9999/path' }] as unknown as Tab[]
    queryMock.mockImplementation(async () => tabs)
    service.getUserRules.mockResolvedValueOnce([
      'example.com##.ad',
      'other.com##.ad',
      '##.global'
    ])

    await listener.handle({ message: { type: ManualBlockingMessages.triggerStart, payload: { sessionId: 'session-id' } } } as Box<ManualBlockingTriggerStartMessage>)

    expect(broadcast.sendMessage).toHaveBeenCalledWith(10, {
      type: ManualBlockingMessages.start,
      payload: {
        tabId: 10,
        appliedRules: ['example.com##.ad', '##.global'],
        sessionId: 'session-id'
      }
    })
  })
})
