/**
 * @file
 * This file is part of Open Ad Blocker Browser Extension (https://github.com/developeradblocker/open_adblocker).
 *
 * Open Ad Blocker Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Open Ad Blocker Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Open Ad Blocker Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */
import { type VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { shallowMount } from '@vue/test-utils'
import Features from '@/ui/toolbar-popup/components/adblocker/features.vue'
import TransparentStub from '../../../../helpers/TransparentStub'
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { useWebRTC } from '@/modules/features/web-rtc/external/web-rtc.utils'
import { ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { checkWebRTCPermissions, requestWebRTCPermissions } from '@/modules/features/web-rtc/common/web-rtc.utils'

jest.mock('@/ui/toolbar-popup/store/app.store')
jest.mock('@/modules/user-activity/external/utils')
jest.mock('@/modules/features/web-rtc/external/web-rtc.utils')
jest.mock('@/modules/features/web-rtc/common/web-rtc.utils')
describe('Features.vue', () => {
  let wrapper: VueWrapper<any>

  const updateFieldMock = jest.fn()
  const activityToggleMock = jest.fn()
  const webRTCToggleMock = jest.fn()
  const closeMock = jest.fn()
  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(Features, {
      attachTo: document.body,
      global: {
        stubs: {
          Feature: TransparentStub()
        }
      }
    })

    window.close = closeMock
  }

  beforeEach(() => {
    jest.mocked(useAppStore).mockReturnValue({
      app: {
        isWebRTCEnabled: false
      },
      updateField: updateFieldMock
    } as any)
    jest.mocked(useUserActivity).mockReturnValue({
      toggle: activityToggleMock
    } as any)
    jest.mocked(useWebRTC).mockReturnValue({
      toggle: webRTCToggleMock
    } as any)
    jest.mocked(checkWebRTCPermissions).mockResolvedValue(true)
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
  })

  it('should handle webrtc toggle', async () => {
    expect(wrapper.find('#web-rtc-toggle').exists()).toBeTruthy()
    await wrapper.get('#web-rtc-toggle').trigger('click')
    expect(activityToggleMock).toHaveBeenCalledTimes(1)
    expect(activityToggleMock).toHaveBeenCalledWith(ElementsUI.web_rtc, true)
    expect(webRTCToggleMock).toHaveBeenCalledTimes(1)
    expect(webRTCToggleMock).toHaveBeenCalledWith(true)
    expect(updateFieldMock).toHaveBeenCalledTimes(1)
    expect(updateFieldMock).toHaveBeenCalledWith('isWebRTCEnabled', true)
    expect(requestWebRTCPermissions).not.toHaveBeenCalled()
    expect(closeMock).not.toHaveBeenCalled()

    jest.mocked(checkWebRTCPermissions).mockResolvedValue(false)
    await wrapper.get('#web-rtc-toggle').trigger('click')
    expect(requestWebRTCPermissions).toHaveBeenCalledTimes(1)
    expect(closeMock).toHaveBeenCalledTimes(1)
  })
})
