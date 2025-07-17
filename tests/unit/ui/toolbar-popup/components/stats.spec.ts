import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import Stats from '@/ui/toolbar-popup/components/adblocker/stats.vue'
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'

jest.mock('@/ui/toolbar-popup/store/app.store')

describe('Stats.vue', () => {
  let wrapper: VueWrapper<any>

  const totalBlocked = '200'
  const blockedByTab = '100'
  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(Stats)
  }

  beforeEach(() => {
    jest.mocked(useAppStore).mockReturnValue({
      app: {
        totalBlocked,
        isServicePage: false,
        isPaused: false,
        blockedByTab
      }
    } as any)
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
    expect(wrapper.text()).toContain(blockedByTab)
    expect(wrapper.text()).toContain(totalBlocked)
  })
})
