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
import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { logger } from '@/utils/logger/logger'
import { setupInternalPortChannel } from '@/modules/port/internal/port.setup'
import { setupInternalAdBlocker } from '@/modules/ad-blocker/internal/ad-blocker.setup'
import { setupInternalRateUs } from '@/modules/rate-us/internal/rate-us.setup'
import { setupInternalApp } from '@/modules/app/internal/app.setup'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'
import { setupPopupIcon } from '@/modules/popup-icon/internal/popup-icon.setup'
import { setupInternalWhitelist } from '@/modules/whitelist/internal/whitelist.setup'
import { setupAdGuard } from '@/modules/aguard/internal/adguard.setup'
import { setupUserActivity } from '@/modules/user-activity/internal/user-activity.setup'
import { flushPromises } from '../helpers/flushPromises'
import { onHandledAllRequiredMessages } from '@/utils/on-handled-all-required-messages'
import { AppMessages } from '@/modules/app/common/app.messages'
import { helloAndGoodbyeSetup } from '@/modules/hello-and-goodbye/internal/hello-and-goodbye.setup'

jest.mock('@/utils/setup-worker', () => ({
  setupWorker: jest.fn(),
  dispatcher: jest.fn()
}))
jest.mock('@/utils/logger/logger', () => ({
  logger: {
    info: jest.fn()
  }
}))
jest.mock('@/modules/port/internal/port.setup', () => ({
  setupInternalPortChannel: jest.fn()
}))

jest.mock('@/modules/ad-blocker/internal/ad-blocker.setup', () => ({
  setupInternalAdBlocker: jest.fn()
}))
jest.mock('@/modules/rate-us/internal/rate-us.setup', () => ({
  setupInternalRateUs: jest.fn()
}))
jest.mock('@/modules/app/internal/app.setup', () => ({
  setupInternalApp: jest.fn()
}))
jest.mock('@/modules/popup-icon/internal/popup-icon.setup', () => ({
  setupPopupIcon: jest.fn()
}))
jest.mock('@/modules/whitelist/internal/whitelist.setup', () => ({
  setupInternalWhitelist: jest.fn()
}))
jest.mock('@/modules/aguard/internal/adguard.setup', () => ({
  setupAdGuard: jest.fn()
}))
jest.mock('@/modules/user-activity/internal/user-activity.setup', () => ({
  setupUserActivity: jest.fn()
}))

jest.mock('@/utils/on-handled-all-required-messages', () => ({
  onHandledAllRequiredMessages: jest.fn()
}))

const list = ['ITEM_1']

jest.mock('@/service_worker/required-messages', () => ({
  requiredMessages: list
}))

jest.mock('@/modules/hello-and-goodbye/internal/hello-and-goodbye.setup', () => ({
  helloAndGoodbyeSetup: jest.fn()
}))

describe('serviceWorkerSetup', () => {
  let mockWork: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockWork = jest.fn()
    const mockedDispatcher = {
      work: mockWork
    } as unknown as DispatcherInterface
    jest.mocked(dispatcher).mockImplementation(() => mockedDispatcher)
  })

  it('initializes the service worker and logs preparation and working messages', async () => {
    await jest.isolateModulesAsync(async () => {
      // @ts-ignore
      mockWork.mockResolvedValue(undefined)
      await require('@/service_worker/worker')
      expect(logger.info).toHaveBeenCalledWith('Service Worker preparing')
      expect(jest.mocked(setupWorker)).toHaveBeenCalledWith('SW')
      expect(setupAdGuard).toHaveBeenCalled()
      expect(helloAndGoodbyeSetup).toHaveBeenCalled()
      expect(setupInternalPortChannel).toHaveBeenCalled()
      expect(setupInternalAdBlocker).toHaveBeenCalled()
      expect(setupUserActivity).toHaveBeenCalled()
      expect(setupInternalRateUs).toHaveBeenCalled()
      expect(setupInternalApp).toHaveBeenCalled()
      expect(setupPopupIcon).toHaveBeenCalled()
      expect(setupInternalWhitelist).toHaveBeenCalled()
      await flushPromises()
      const expectedList = [...list, AppMessages.ready]
      expect(onHandledAllRequiredMessages).toHaveBeenCalledWith(expectedList, expect.any(Function))
      jest.mocked(onHandledAllRequiredMessages).mock.calls[0][1]()
      expect(mockWork).toHaveBeenCalled()
      expect(logger.info).toHaveBeenCalledWith('Service Worker start working')
      expect(logger.info).toHaveBeenCalledTimes(2)
    })
  })
})
