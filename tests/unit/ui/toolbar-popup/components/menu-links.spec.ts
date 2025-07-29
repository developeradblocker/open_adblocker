import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import MenuLinks from '@/ui/toolbar-popup/components/menu-links.vue'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { ElementsUI } from '@/modules/user-activity/common/user-activity.types'

jest.mock('@/modules/user-activity/external/utils')

describe('MenuLinks.vue', () => {
  let wrapper: VueWrapper<any>

  const clickMock = jest.fn()
  const createMock = jest.fn()

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(MenuLinks, {
      global: {
        stubs: {
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

  it('should open new tab on link clicked', async () => {
    const url = 'https://openadblocker.com/'
    await wrapper.get('[data-test="link"]').trigger('click')
    expect(clickMock).toHaveBeenCalledTimes(1)
    expect(clickMock).toHaveBeenCalledWith(ElementsUI.about, {
      page: ROUTE.MENU,
      to: url
    })

    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith({ url })
  })
})
