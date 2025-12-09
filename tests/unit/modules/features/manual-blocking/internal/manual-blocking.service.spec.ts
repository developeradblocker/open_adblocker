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
import { ManualBlockingService } from '@/modules/features/manual-blocking/internal/services/manual-blocking.service'
import { UserRulesStorage } from '@/modules/features/manual-blocking/internal/storage/user-rules.storage'
import { dispatcher } from '@/utils/setup-worker'
import { ManualBlockingMessages } from '@/modules/features/manual-blocking/common/manual-blocking.messages'
import { logger } from '@/utils/logger/logger'

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))

jest.mock('@/utils/logger/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn()
  }
}))

describe('ManualBlockingService (internal)', () => {
  let service: ManualBlockingService
  const storage = {
    get: jest.fn(),
    set: jest.fn()
  } as unknown as jest.Mocked<UserRulesStorage>
  const sendMessageMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    storage.get = jest.fn().mockResolvedValue([])
    storage.set = jest.fn().mockResolvedValue([])
    sendMessageMock.mockResolvedValue(undefined)
    jest.mocked(dispatcher).mockReturnValue({
      sendMessage: sendMessageMock
    } as any)
    service = new ManualBlockingService(storage)
  })

  it('adds new rule and notifies dispatcher while skipping duplicates', async () => {
    storage.get.mockResolvedValueOnce(['example##.ad'])
    await service.addRule('example##.ad')
    expect(storage.set).not.toHaveBeenCalled()
    expect(sendMessageMock).not.toHaveBeenCalled()

    storage.get.mockResolvedValueOnce(['example##.ad'])
    await service.addRule('example##.ad-2')
    expect(storage.set).toHaveBeenCalledWith(['example##.ad', 'example##.ad-2'])
    expect(sendMessageMock).toHaveBeenCalledWith({ type: ManualBlockingMessages.rulesUpdated })
  })

  it('returns rules through getUserRules', async () => {
    storage.get.mockResolvedValueOnce(['rule'])
    await expect(service.getUserRules()).resolves.toEqual(['rule'])
  })

  it('resets rules and requests reload', async () => {
    storage.get.mockResolvedValueOnce(['keep', 'remove'])

    await service.resetRules(['remove'])

    expect(storage.set).toHaveBeenCalledWith(['keep'])
    expect(sendMessageMock).toHaveBeenCalledWith({
      type: ManualBlockingMessages.rulesUpdated,
      payload: { needReload: true }
    })
  })

  it('sets rules successfully with configurable reload flag', async () => {
    const result = await service.saveRules(['a'], true)

    expect(storage.set).toHaveBeenCalledWith(['a'])
    expect(sendMessageMock).toHaveBeenCalledWith({
      type: ManualBlockingMessages.rulesUpdated,
      payload: { needReload: true }
    })
    expect(result).toBe(true)
  })

  it('logs and returns false when storage set fails', async () => {
    const error = new Error('failed')
    storage.set.mockRejectedValueOnce(error)

    await expect(service.saveRules(['a'])).resolves.toBe(false)
    expect(logger.error).toHaveBeenCalledWith(
      'InternalManualBlocking: Failed to set rules due to error',
      error
    )
    expect(sendMessageMock).not.toHaveBeenCalled()
  })
})
