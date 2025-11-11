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
import Header from '@/ui/toolbar-popup/components/header.vue'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { useRoute } from 'vue-router'
import { POPUP_ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { ClickEventToAction, ElementsUI } from '@/modules/user-activity/common/user-activity.types'

jest.mock('vue-router')
jest.mock('@/modules/user-activity/external/utils')

describe('Header.vue', () => {
  let wrapper: VueWrapper<any>

  const title = 'TESTING'

  const clickMock = jest.fn()
  const createMock = jest.fn()
  const queryMock = jest.fn()
  const updateMock = jest.fn()
  const getURLMock = jest.fn().mockImplementation((key: string) => `MOCKED__${key}`)

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(Header, {
      global: {
        stubs: {
          BaseSvg: true
        }
      },
      props: {
        withBorder: true,
        title,
        withSettings: true
      }
    })
  }

  beforeEach(() => {
    global.chrome = {
      runtime: {
        getURL: getURLMock
      },
      tabs: {
        create: createMock,
        query: queryMock,
        update: updateMock
      }
    } as any
    jest.mocked(useUserActivity).mockImplementation(() => ({ click: clickMock }) as any)
    jest.mocked(useRoute).mockImplementation(() => ({ name: POPUP_ROUTE.RATE_US }) as any)
    jest.mocked(queryMock).mockResolvedValue([{ id: 1 }])
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
    expect(wrapper.text()).toContain(title)
    expect(wrapper.classes()).toContain('header--with-border')
  })

  it('should handle settings click', async () => {
    await wrapper.get('[data-test="settings"]').trigger('click')
    expect(updateMock).toHaveBeenCalledTimes(1)
    expect(updateMock).toHaveBeenCalledWith(1, { active: true })
  })

  it('should handle logo click', async () => {
    await wrapper.get('[data-test="logo"]').trigger('click')
    expect(clickMock).toHaveBeenCalledTimes(1)
    expect(clickMock).toHaveBeenCalledWith(ElementsUI.logo, {
      to: 'https://openadblocker.com/',
      page: POPUP_ROUTE.RATE_US
    })
    expect(createMock).toHaveBeenCalledWith({ url: 'https://openadblocker.com/' })
  })

  it('should handle menu click', async () => {
    await wrapper.get('[data-test="menu"]').trigger('click')
    expect(clickMock).toHaveBeenCalledTimes(1)
    expect(clickMock).toHaveBeenCalledWith(ElementsUI.menu, {
      page: POPUP_ROUTE.RATE_US,
      to: ClickEventToAction.openMenu
    })

    expect(wrapper.emitted('menu-click')).toBeTruthy()
  })
})
