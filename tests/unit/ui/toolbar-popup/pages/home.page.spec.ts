import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import TransparentStub from '../../../../helpers/TransparentStub'
import HomePage from '@/ui/toolbar-popup/pages/home.page.vue'
import Header from '@/ui/toolbar-popup/components/header.vue'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { useRouter } from 'vue-router'

jest.mock('vue-router')

describe('HomePage.vue', () => {
  let wrapper: VueWrapper<any>

  const pushMock = jest.fn()

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(HomePage, {
      global: {
        stubs: {
          PrimaryLayout: TransparentStub()
        }
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useRouter).mockImplementation(() => ({
      push: pushMock
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
})
