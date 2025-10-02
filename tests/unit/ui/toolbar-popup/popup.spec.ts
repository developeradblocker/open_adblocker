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
import { createApp } from 'vue'
import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { logger } from '@/utils/logger/logger'
import { setupExternalPortChannel } from '@/modules/port/external/port.setup'
import { setupExternalAdBlocker } from '@/modules/ad-blocker/external/ad-blocker.setup'
import { setupExternalApp } from '@/modules/app/external/app.setup'
import { setupExternalUserActivity } from '@/modules/user-activity/external/user-activity.setup'
import { flushPromises } from '../../../helpers/flushPromises'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'
import { createRouter } from 'vue-router'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { setupExternalWebRTC } from '@/modules/features/web-rtc/external/web-rtc.setup'

jest.mock('vue', () => ({
  defineComponent: jest.fn(),
  createApp: jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
    component: jest.fn().mockReturnThis(),
    mount: jest.fn().mockReturnThis()
  }))
}))

jest.mock('pinia', () => ({
  createPinia: jest.fn(),
  defineStore: jest.fn()
}))

jest.mock('vue-router', () => {
  return {
    createRouter: jest.fn(() => ({
      afterEach: jest.fn()
    })),
    createWebHashHistory: jest.fn()
  }
})

jest.mock('vue-inline-svg', () => ({}))

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn(() => ({
    work: jest.fn()
  })),
  setupWorker: jest.fn()
}))

jest.mock('@/utils/logger/logger', () => ({
  logger: { info: jest.fn() }
}))

jest.mock('@/modules/port/external/port.setup', () => ({
  setupExternalPortChannel: jest.fn()
}))

jest.mock('@/modules/ad-blocker/external/ad-blocker.setup', () => ({
  setupExternalAdBlocker: jest.fn()
}))

jest.mock('@/modules/app/external/app.setup', () => ({
  setupExternalApp: jest.fn()
}))

jest.mock('@/modules/user-activity/external/user-activity.setup', () => ({
  setupExternalUserActivity: jest.fn()
}))

jest.mock('@/modules/features/web-rtc/external/web-rtc.setup', () => ({
  setupExternalWebRTC: jest.fn()
}))

jest.mock('@/modules/user-activity/external/utils', () => ({
  useUserActivity: jest.fn(() => ({
    visitPage: jest.fn()
  }))
}))

describe('Popup entry script', () => {
  const appInstance = {
    use: jest.fn(),
    component: jest.fn(),
    mount: jest.fn()
  }
  const afterEachMock = jest.fn()
  const visitPageMock = jest.fn()

  beforeEach(() => {
    jest.mocked(createApp).mockImplementation(() => appInstance as any)
    jest.mocked(createRouter).mockImplementation(() => ({ afterEach: afterEachMock }) as any)
    jest.mocked(useUserActivity).mockImplementation(() => ({ visitPage: visitPageMock }) as any)
  })
  it('should initialize and mount the Vue app properly', async () => {
    await jest.isolateModulesAsync(async () => {
      const mockWork = jest.fn()
      jest.mocked(dispatcher).mockReturnValue({ work: mockWork } as unknown as DispatcherInterface)
      require('../../../../app/ui/toolbar-popup/popup')
      await flushPromises()
      expect(setupWorker).toHaveBeenCalledWith('PW')
      expect(setupExternalPortChannel).toHaveBeenCalledWith({ name: 'PW' })
      expect(setupExternalAdBlocker).toHaveBeenCalled()
      expect(setupExternalUserActivity).toHaveBeenCalled()
      expect(setupExternalWebRTC).toHaveBeenCalled()
      expect(setupExternalApp).toHaveBeenCalled()
      expect(dispatcher).toHaveBeenCalled()
      expect(mockWork).toHaveBeenCalled()
      expect(logger.info).toHaveBeenCalledWith('Popup started...')
      expect(createApp).toHaveBeenCalledTimes(1)

      expect(afterEachMock).toHaveBeenCalledTimes(1)
      const callback = afterEachMock.mock.calls[0][0]
      callback({ name: ROUTE.HOME })
      expect(visitPageMock).toHaveBeenCalledTimes(2)
      expect(visitPageMock).toHaveBeenNthCalledWith(1, ROUTE.INIT)
      expect(visitPageMock).toHaveBeenNthCalledWith(2, ROUTE.HOME)
    })
  })
})
