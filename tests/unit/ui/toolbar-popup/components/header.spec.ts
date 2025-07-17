import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import Header from '@/ui/toolbar-popup/components/header.vue'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { useRoute } from 'vue-router'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { ClickEventToAction, ElementsUI } from '@/modules/user-activity/common/user-activity.types'

jest.mock('vue-router')
jest.mock('@/modules/user-activity/external/utils')

describe('Header.vue', () => {
  let wrapper: VueWrapper<any>

  const title = 'TESTING'

  const clickMock = jest.fn()
  const createMock = jest.fn()

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(Header, {
      global: {
        stubs: {
          BaseSvg: true
        }
      },
      props: {
        withBorder: true,
        title
      }
    })
  }

  beforeEach(() => {
    global.chrome = {
      tabs: {
        create: createMock
      }
    } as any
    jest.mocked(useUserActivity).mockImplementation(() => ({ click: clickMock }) as any)
    jest.mocked(useRoute).mockImplementation(() => ({ name: ROUTE.RATE_US }) as any)
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
    expect(wrapper.text()).toContain(title)
    expect(wrapper.classes()).toContain('header--with-border')
  })

  it('should handle logo click', async () => {
    await wrapper.get('[data-test="logo"]').trigger('click')
    expect(clickMock).toHaveBeenCalledTimes(1)
    expect(clickMock).toHaveBeenCalledWith(ElementsUI.logo, {
      to: 'https://openadblocker.com/',
      page: ROUTE.RATE_US
    })
    expect(createMock).toHaveBeenCalledWith({ url: 'https://openadblocker.com/' })
  })

  it('should handle menu click', async () => {
    await wrapper.get('[data-test="menu"]').trigger('click')
    expect(clickMock).toHaveBeenCalledTimes(1)
    expect(clickMock).toHaveBeenCalledWith(ElementsUI.menu, {
      page: ROUTE.RATE_US,
      to: ClickEventToAction.openMenu
    })

    expect(wrapper.emitted('menu-click')).toBeTruthy()
  })
})
