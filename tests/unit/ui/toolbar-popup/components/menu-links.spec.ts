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
import MenuLinks from '@/ui/toolbar-popup/components/menu-links.vue'
import { POPUP_ROUTE } from '@/ui/toolbar-popup/router/route-names'
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
      page: POPUP_ROUTE.MENU,
      to: url
    })

    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith({ url })
  })
})
