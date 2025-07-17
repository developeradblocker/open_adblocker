import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import ToggleButton from '@/ui/toolbar-popup/components/adblocker/toggle-button.vue'
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'

jest.mock('@/ui/toolbar-popup/store/app.store')

describe('ToggleButton.vue', () => {
  let wrapper: VueWrapper<any>

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(ToggleButton, {
      props: {
        loading: false
      },
      global: {
        stubs: {
          BaseSvg: true
        }
      }
    })
  }

  beforeEach(() => {
    jest.mocked(useAppStore).mockReturnValue({
      app: {
        isServicePage: false,
        isPaused: false
      }
    } as any)
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
    expect(wrapper.classes()).not.toContain('ad-blocker-toggle-button--disabled')
    expect(wrapper.classes()).not.toContain('ad-blocker-toggle-button--paused')
    expect(wrapper.classes()).not.toContain('ad-blocker-toggle-button--loading')
  })
})
