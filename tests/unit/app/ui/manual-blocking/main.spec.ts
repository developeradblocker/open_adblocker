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
import { setupContentBroadcast } from '@/modules/broadcast/content/broadcast.setup'
import { setupUIManualBlocking } from '@/modules/features/manual-blocking/ui/manual-blocking.setup'
import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'
import { flushPromises } from '../../../../helpers/flushPromises'
import { useBlockElementStore } from '@/ui/manual-blocking/store/block-element.store'

const dispatcherWorkMock = jest.fn()

jest.mock('vue', () => ({
  defineComponent: jest.fn(),
  createApp: jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
    component: jest.fn().mockReturnThis(),
    mount: jest.fn().mockReturnThis()
  }))
}))

jest.mock('vue-inline-svg', () => ({}))

jest.mock('@/modules/broadcast/content/broadcast.setup', () => ({
  setupContentBroadcast: jest.fn()
}))

jest.mock('@/modules/features/manual-blocking/ui/manual-blocking.setup', () => ({
  setupUIManualBlocking: jest.fn()
}))

jest.mock('@/ui/manual-blocking/store/block-element.store', () => {
  return {
    useBlockElementStore: jest.fn()
  }
})

jest.mock('@/utils/setup-worker', () => ({
  setupWorker: jest.fn(),
  dispatcher: jest.fn(() => ({
    work: jest.fn()
  }))
}))

jest.mock('@/ui/manual-blocking/router', () => ({}))

jest.mock('pinia', () => {
  const actual = jest.requireActual('pinia')
  return {
    ...actual,
    createPinia: jest.fn(() => ({}))
  }
})

describe('manual-blocking UI entrypoint', () => {
  const appInstance = {
    use: jest.fn(),
    component: jest.fn(),
    mount: jest.fn()
  }
  const storeInstance = {
    $patch: jest.fn(),
    appliedRules: []
  }

  it('bootstraps worker/services and mounts the Vue app', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.mocked(createApp).mockReturnValue(appInstance as any)
      jest.mocked(dispatcher).mockReturnValue({ work: dispatcherWorkMock } as unknown as DispatcherInterface)
      jest.mocked(useBlockElementStore).mockReturnValue(storeInstance as any)
      require('../../../../../app/ui/manual-blocking/main')
      await flushPromises()
      expect(setupWorker).toHaveBeenCalledWith('ManuallyBlockingAds')
      expect(setupContentBroadcast).toHaveBeenCalled()
      expect(setupUIManualBlocking).toHaveBeenCalled()
      expect(createApp).toHaveBeenCalled()
      expect(dispatcherWorkMock).toHaveBeenCalled()
    })
  })
})
