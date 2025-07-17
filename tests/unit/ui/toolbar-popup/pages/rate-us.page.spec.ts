import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import TransparentStub from '../../../../helpers/TransparentStub'
import RateUsPage from '@/ui/toolbar-popup/pages/rate-us.page.vue'
import Header from '@/ui/toolbar-popup/components/header.vue'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { useRouter } from 'vue-router'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import BaseButton from '@/ui/toolbar-popup/components/base-button.vue'
import { ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { RATE_US_URL } from '@/modules/rate-us/constants'

jest.mock('vue-router')
jest.mock('@/modules/user-activity/external/utils')

describe('RateUsPage.vue', () => {
  let wrapper: VueWrapper<any>

  const clickMock = jest.fn()
  const pushMock = jest.fn()
  const createMock = jest.fn()

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(RateUsPage, {
      global: {
        stubs: {
          PrimaryLayout: TransparentStub(),
          BaseSvg: true
        }
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useUserActivity).mockImplementation(() => ({
      click: clickMock
    }) as any)
    jest.mocked(useRouter).mockImplementation(() => ({
      push: pushMock
    }) as any)
    global.chrome = {
      tabs: {
        create: createMock
      }
    } as any
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

  it('should open rate us on button click', async () => {
    await wrapper.getComponent(BaseButton).trigger('click')
    expect(clickMock).toHaveBeenLastCalledWith(ElementsUI.rateUsButton, {
      to: RATE_US_URL,
      page: ROUTE.RATE_US
    })
    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith({
      url: RATE_US_URL
    })
  })
})
