import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import TransparentStub from '../../../../helpers/TransparentStub'
import { flushPromises } from '../../../../helpers/flushPromises'
import InitPage from '@/ui/toolbar-popup/pages/init.page.vue'
import { useAppService } from '@/modules/app/external/app.service'
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'
import { useRouter } from 'vue-router'
import Header from '@/ui/toolbar-popup/components/header.vue'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'

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
    expect(pushMock).toHaveBeenLastCalledWith({ name: ROUTE.MENU })
  })

  it('should establish connection and set app info', async () => {
    await flushPromises()
    expect(establishConnectionMock).toHaveBeenCalledTimes(1)
    expect(setAppInfoMock).toHaveBeenCalledTimes(1)
    expect(setAppInfoMock).toHaveBeenCalledWith(state)
    expect(pushMock).toHaveBeenCalledWith({ name: ROUTE.HOME })
  })

  it('should navigate on rate us when "needVisitRateUs" was set to true', async () => {
    state.needVisitRateUs = true
    doMount()
    await flushPromises()
    expect(pushMock).toHaveBeenCalledWith({ name: ROUTE.RATE_US })
  })
})
