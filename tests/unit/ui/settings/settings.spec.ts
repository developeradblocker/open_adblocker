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
import { flushPromises } from '../../../helpers/flushPromises'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'
import { setupExternalSettings } from '@/modules/settings/external/settings.setup'
import { setupExternalFilters } from '@/modules/filters/external/filters.setup'
import { createPinia } from 'pinia'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { setupExternalUserActivity } from '@/modules/user-activity/external/user-activity.setup'
import { ClickEventToAction, ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'

jest.mock('vue', () => ({
  defineComponent: jest.fn(),
  createApp: jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
    component: jest.fn().mockReturnThis(),
    mount: jest.fn().mockReturnThis()
  }))
}))

jest.mock('@/ui/settings/router/routes', () => ({
  routes: []
}))

jest.mock('@/modules/user-activity/external/utils', () => ({
  useUserActivity: jest.fn()
}))
jest.mock('vue-router', () => {
  return {
    createRouter: jest.fn(),
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

jest.mock('@/modules/filters/external/filters.setup', () => ({
  setupExternalFilters: jest.fn()
}))

jest.mock('@/modules/settings/external/settings.setup', () => ({
  setupExternalSettings: jest.fn()
}))

jest.mock('pinia', () => ({
  createPinia: jest.fn(),
  defineStore: jest.fn()
}))

jest.mock('@/modules/user-activity/external/user-activity.setup', () => ({
  setupExternalUserActivity: jest.fn()
}))

describe('Settings entry script', () => {
  const appInstance = {
    use: jest.fn(),
    component: jest.fn(),
    mount: jest.fn()
  }

  const clickActivityMock = jest.fn()

  beforeEach(() => {
    (useUserActivity as jest.Mock).mockReturnValue({
      click: clickActivityMock
    })
    jest.mocked(createApp).mockImplementation(() => appInstance as any)
  })
  it('should initialize and mount the Vue app properly', async () => {
    await jest.isolateModulesAsync(async () => {
      const mockWork = jest.fn()
      jest.mocked(dispatcher).mockReturnValue({ work: mockWork } as unknown as DispatcherInterface)
      require('../../../../app/ui/settings/settings')
      await flushPromises()
      expect(setupWorker).toHaveBeenCalledWith('Settings')
      expect(setupExternalPortChannel).toHaveBeenCalledWith({ name: 'Settings' })
      expect(setupExternalSettings).toHaveBeenCalledTimes(1)
      expect(setupExternalFilters).toHaveBeenCalledTimes(1)
      expect(setupExternalUserActivity).toHaveBeenCalledTimes(1)
      expect(dispatcher).toHaveBeenCalled()
      expect(mockWork).toHaveBeenCalled()
      expect(createPinia).toHaveBeenCalledTimes(1)
      expect(logger.info).toHaveBeenCalledWith('Settings started...')
      expect(createApp).toHaveBeenCalledTimes(1)

      expect(clickActivityMock).toHaveBeenCalledTimes(1)
      expect(clickActivityMock).toHaveBeenCalledWith(ElementsUI.settings, {
        page: SETTINGS_ROUTE.GENERAL,
        to: ClickEventToAction.openSettings
      })
    })
  })
})
