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
import TransparentStub from '../../../../helpers/TransparentStub'
import HomePage from '@/ui/toolbar-popup/pages/home.page.vue'
import Header from '@/ui/toolbar-popup/components/header.vue'
import { POPUP_ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/ui/toolbar-popup/components/notification/notification.store'
import { NotificationTypes } from '@/ui/toolbar-popup/components/notification/notification.types'

jest.mock('vue-router')
jest.mock('@/ui/toolbar-popup/components/notification/notification.store')

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
    jest.mocked(useNotificationStore).mockReturnValue({
      message: '',
      duration: 20,
      type: NotificationTypes.info,
      isVisible: false
    } as any)
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
  })

  it('should navigate to menu on click', () => {
    wrapper.getComponent(Header).vm.$emit('menu-click')
    expect(pushMock).toHaveBeenLastCalledWith({ name: POPUP_ROUTE.MENU })
  })
})
