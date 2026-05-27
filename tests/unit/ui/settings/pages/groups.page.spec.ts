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
import GroupsPage from '@/ui/settings/pages/groups.page.vue'
import TransparentStub from '../../../../helpers/TransparentStub'
import { useSettingsStore } from '@/ui/settings/store/settings.store'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { useRouter } from 'vue-router'
import { ClickEventToAction } from '@/modules/user-activity/common/user-activity.types'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'
import BaseListItem from '@/ui/settings/components/base/base-list-item.vue'

jest.mock('@/ui/settings/store/settings.store')
jest.mock('@/modules/user-activity/external/utils')
jest.mock('vue-router')

describe('GroupsPage.vue', () => {
  let wrapper: VueWrapper<any>

  const visitPageMock = jest.fn()
  const clickActivityMock = jest.fn()
  const pushMock = jest.fn()
  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(GroupsPage, {
      global: {
        stubs: {
          BaseBox: TransparentStub(),
          BaseListItem: TransparentStub(),
          BaseSvg: true
        }
      }
    })
  }

  beforeEach(() => {
    void (useRouter as jest.Mock).mockReturnValue({
      push: pushMock
    })
    void (useUserActivity as jest.Mock).mockReturnValue({
      visitPage: visitPageMock,
      click: clickActivityMock
    })
    void (useSettingsStore as unknown as jest.Mock).mockReturnValue({
      filters: [{ filterId: 1, groupId: 1, filterName: 'filter1', filterDescription: 'filter1 description' }],
      enabledFilters: [1],
      groups: [{ groupId: 1, groupName: 'group1', groupDescription: 'group1 description' }]
    })
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
    expect(visitPageMock).toHaveBeenCalledTimes(1)
    expect(visitPageMock).toHaveBeenCalledWith(SETTINGS_ROUTE.GROUPS)
  })

  it('should be able to open group', async () => {
    await wrapper.findComponent(BaseListItem).trigger('click')
    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({ name: SETTINGS_ROUTE.FILTERS, params: { id: 1 } })
    expect(clickActivityMock).toHaveBeenCalledTimes(1)
    expect(clickActivityMock).toHaveBeenCalledWith('group_1', {
      page: SETTINGS_ROUTE.GROUPS,
      to: ClickEventToAction.openGroup
    })
  })
})
