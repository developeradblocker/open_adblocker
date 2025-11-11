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
import GeneralPage from '@/ui/settings/pages/general.page.vue'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'

jest.mock('@/modules/user-activity/external/utils')

describe('GeneralPage.vue', () => {
  let wrapper: VueWrapper<any>

  const visitPageMock = jest.fn()
  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(GeneralPage)
  }

  beforeEach(() => {
    (useUserActivity as jest.Mock).mockReturnValue({
      visitPage: visitPageMock
    })
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
    expect(visitPageMock).toHaveBeenCalledTimes(1)
    expect(visitPageMock).toHaveBeenCalledWith(SETTINGS_ROUTE.GENERAL)
  })
})
