import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import TransparentStub from '../../../../helpers/TransparentStub'
import MenuPage from '@/ui/toolbar-popup/pages/menu.page.vue'
import Header from '@/ui/toolbar-popup/components/header.vue'
import { useRouter } from 'vue-router'

jest.mock('vue-router')

describe('MenuPage.vue', () => {
  let wrapper: VueWrapper<any>

  const backMock = jest.fn()

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(MenuPage, {
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
      back: backMock
    }) as any)
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
  })

  it('should navigate back on click', () => {
    wrapper.getComponent(Header).vm.$emit('menu-click')
    expect(backMock).toHaveBeenCalledTimes(1)
  })
})
