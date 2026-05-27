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
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import TransparentStub from '../../../../helpers/TransparentStub'
import RateUsPage from '@/ui/toolbar-popup/pages/rate-us.page.vue'
import { POPUP_ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { useRouter } from 'vue-router'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { ClickEventToAction, ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { RATE_US_URL } from '@/modules/rate-us/constants'

jest.mock('vue-router')
jest.mock('@/modules/user-activity/external/utils')

describe('RateUsPage.vue', () => {
  let wrapper: VueWrapper<any>

  const clickMock = jest.fn()
  const pushMock = jest.fn()
  const createMock = jest.fn()
  const elements = {
    reminder: '[data-test="rate-us__action--reminder"]',
    rateUs: '[data-test="rate-us__action--rate-us"]'
  }

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(RateUsPage, {
      global: {
        stubs: {
          PrimaryLayout: TransparentStub(),
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
    jest.mocked(useRouter).mockImplementation(() => ({
      push: pushMock
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

  it('should navigate to home remind click', async () => {
    await wrapper.get(elements.reminder).trigger('click')
    expect(clickMock).toHaveBeenLastCalledWith(ElementsUI.rateUsReminder, {
      page: POPUP_ROUTE.RATE_US,
      to: ClickEventToAction.closePage
    })
    expect(pushMock).toHaveBeenLastCalledWith({ name: POPUP_ROUTE.HOME })
  })

  it('should open rate us on button click', async () => {
    await wrapper.get(elements.rateUs).trigger('click')
    expect(clickMock).toHaveBeenLastCalledWith(ElementsUI.rateUsButton, {
      to: RATE_US_URL,
      page: POPUP_ROUTE.RATE_US
    })
    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith({
      url: RATE_US_URL
    })
  })
})
