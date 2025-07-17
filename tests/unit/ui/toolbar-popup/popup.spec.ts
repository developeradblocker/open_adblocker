import { createApp } from 'vue'
import { dispatcher, setupWorker } from '@/utils/setup-worker'
import { logger } from '@/utils/logger/logger'
import { setupExternalPortChannel } from '@/modules/port/external/port.setup'
import { setupExternalAdBlocker } from '@/modules/ad-blocker/external/ad-blocker.setup'
import { setupExternalApp } from '@/modules/app/external/app.setup'
import { setupUserActivity } from '@/modules/user-activity/external/user-activity.setup'
import { flushPromises } from '../../../helpers/flushPromises'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'
import { createRouter } from 'vue-router'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { useUserActivity } from '@/modules/user-activity/external/utils'

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
  // const originalModule = jest.requireActual('vue-router')
  return {
    // ...originalModule,
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
  setupUserActivity: jest.fn()
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
      expect(setupUserActivity).toHaveBeenCalled()
      expect(setupExternalApp).toHaveBeenCalled()
      expect(dispatcher).toHaveBeenCalled()
      expect(mockWork).toHaveBeenCalled()
      expect(logger.info).toHaveBeenCalledWith('Popup started...')
      expect(createApp).toHaveBeenCalledTimes(1)

      expect(afterEachMock).toHaveBeenCalledTimes(1)
      const callback = afterEachMock.mock.calls[0][0]
      callback({ name: ROUTE.INIT })
      expect(visitPageMock).toHaveBeenCalledTimes(1)
      expect(visitPageMock).toHaveBeenCalledWith(ROUTE.INIT)
    })
  })
})
