import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import Toggle from '@/ui/toolbar-popup/components/adblocker/toggle.vue'
import ToggleButton from '@/ui/toolbar-popup/components/adblocker/toggle-button.vue'
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'
import { useExternalAdBlocker } from '@/modules/ad-blocker/external/ad-blocker.setup'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { ClickEventToAction, ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'

jest.mock('@/ui/toolbar-popup/store/app.store')
jest.mock('@/modules/user-activity/external/utils')
jest.mock('@/modules/ad-blocker/external/ad-blocker.setup')

describe('Toggle.vue', () => {
  let wrapper: VueWrapper<any>

  const toggleMock = jest.fn()
  const clickMock = jest.fn()
  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(Toggle)
  }

  beforeEach(() => {
    jest.mocked(useAppStore).mockReturnValue({
      app: {
        isServicePage: false,
        isPaused: false
      }
    } as any)
    jest.mocked(useExternalAdBlocker).mockReturnValue({
      toggle: toggleMock
    } as any)
    jest.mocked(useUserActivity).mockReturnValue({
      click: clickMock
    } as any)
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
    expect(wrapper.text()).toContain('Pause for this website')
  })

  it('should handle toggle state', async () => {
    expect(wrapper.getComponent(ToggleButton).props('loading')).toBe(false)
    await wrapper.getComponent(ToggleButton).trigger('click')
    expect(clickMock).toHaveBeenCalledTimes(1)
    expect(clickMock).toHaveBeenCalledWith(ElementsUI.adblockerToggle, {
      to: ClickEventToAction.pause,
      page: ROUTE.HOME
    })

    expect(toggleMock).toHaveBeenCalledTimes(1)
    expect(toggleMock).toHaveBeenCalledWith(true)
  })
})
