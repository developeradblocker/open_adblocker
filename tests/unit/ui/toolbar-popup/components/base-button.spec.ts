import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import BaseButton from '@/ui/toolbar-popup/components/base-button.vue'

describe('BaseButton.vue', () => {
  let wrapper: VueWrapper<any>

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(BaseButton, {
      props: {
        label: 'BTN'
      }
    })
  }

  beforeEach(() => {
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
    expect(wrapper.text()).toContain('BTN')
    expect(wrapper.classes()).not.toContain('base-button--disabled')
  })
})
