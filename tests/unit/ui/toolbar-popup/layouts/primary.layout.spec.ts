import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import PrimaryLayout from '@/ui/toolbar-popup/layouts/primary.layout.vue'

describe('PrimaryLayout.vue', () => {
  let wrapper: VueWrapper<any>

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(PrimaryLayout, {
      global: {
        stubs: {
          BaseSvg: true
        }
      },
      props: {
        loading: true
      }
    })
  }

  beforeEach(() => {
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
    expect(wrapper.text()).toContain('Loading')
  })
})
