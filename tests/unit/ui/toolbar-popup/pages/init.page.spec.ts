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
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import TransparentStub from '../../../../helpers/TransparentStub'
import { flushPromises } from '../../../../helpers/flushPromises'
import InitPage from '@/ui/toolbar-popup/pages/init.page.vue'
import { useAppService } from '@/modules/app/external/app.service'
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'
import { useRouter } from 'vue-router'
import Header from '@/ui/toolbar-popup/components/header.vue'
import { POPUP_ROUTE } from '@/ui/toolbar-popup/router/route-names'

jest.mock('@/modules/app/external/app.service')
jest.mock('@/ui/toolbar-popup/store/app.store')
jest.mock('vue-router')

describe('InitPage.vue', () => {
  let wrapper: VueWrapper<any>

  const pushMock = jest.fn()
  const establishConnectionMock = jest.fn()
  const setAppInfoMock = jest.fn()
  const getStateMock = jest.fn()

  const state: any = {}

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(InitPage, {
      global: {
        stubs: {
          PrimaryLayout: TransparentStub()
        }
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    getStateMock.mockResolvedValue(state)
    jest.mocked(useRouter).mockImplementation(() => ({
      push: pushMock
    }) as any)
    jest.mocked(useAppStore).mockImplementation(() => ({
      setAppInfo: setAppInfoMock
    }) as any)
    jest.mocked(useAppService).mockImplementation(() => ({
      establishConnection: establishConnectionMock,
      getState: getStateMock
    }) as any)
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
  })

  it('should navigate to menu on click', () => {
    wrapper.getComponent(Header).vm.$emit('menu-click')
    expect(pushMock).toHaveBeenLastCalledWith({ name: POPUP_ROUTE.MENU })
  })

  it('should establish connection and set app info', async () => {
    await flushPromises()
    expect(establishConnectionMock).toHaveBeenCalledTimes(1)
    expect(setAppInfoMock).toHaveBeenCalledTimes(1)
    expect(setAppInfoMock).toHaveBeenCalledWith(state)
    expect(pushMock).toHaveBeenCalledWith({ name: POPUP_ROUTE.HOME })
  })

  it('should navigate on rate us when "needVisitRateUs" was set to true', async () => {
    state.needVisitRateUs = true
    doMount()
    await flushPromises()
    expect(pushMock).toHaveBeenCalledWith({ name: POPUP_ROUTE.RATE_US })
  })
})
