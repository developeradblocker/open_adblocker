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
import FiltersPage from '@/ui/settings/pages/filters.page.vue'
import TransparentStub from '../../../../helpers/TransparentStub'
import { useExternalFilters } from '@/modules/filters/external/filters.utils'
import { useSettingsStore } from '@/ui/settings/store/settings.store'
import BaseToggle from '@/ui/shared/components/base-toggle.vue'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { useRouter } from 'vue-router'
import { ClickEventToAction, ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'

jest.mock('@/modules/filters/external/filters.utils')
jest.mock('@/ui/settings/store/settings.store')
jest.mock('@/modules/user-activity/external/utils')
jest.mock('vue-router')

describe('FiltersPage.vue', () => {
  let wrapper: VueWrapper<any>

  const elements = {
    back: '[data-test="back"]',
    filter: '[data-test="filter"]'
  }

  const toggleMock = jest.fn()
  const toggleActivityMock = jest.fn()
  const clickActivityMock = jest.fn()
  const toggleFilterMock = jest.fn()
  const backMock = jest.fn()
  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(FiltersPage, {
      props: {
        id: '1'
      },
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
    (useExternalFilters as jest.Mock).mockReturnValue({
      toggle: toggleMock
    })
    void (useRouter as jest.Mock).mockReturnValue({
      back: backMock
    })
    void (useUserActivity as jest.Mock).mockReturnValue({
      toggle: toggleActivityMock,
      click: clickActivityMock
    })
    void (useSettingsStore as unknown as jest.Mock).mockReturnValue({
      toggleFilter: toggleFilterMock,
      enabledFilters: [1, 2],
      groups: [{ groupId: 1, groupName: 'group1', groupDescription: 'group1 description' }],
      filters: [{ groupId: 1, name: 'filter1', filterId: 1, description: 'filter1 description' }]
    })
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
    expect(wrapper.text())
      .toContain('group1')
    expect(wrapper.text())
      .toContain('group1 description')
  })

  it('should be able to return back', async () => {
    await wrapper.get(elements.back).trigger('click')
    expect(backMock).toHaveBeenCalledTimes(1)
    expect(clickActivityMock).toHaveBeenCalledTimes(1)
    expect(clickActivityMock).toHaveBeenCalledWith(ElementsUI.filterBack, {
      page: SETTINGS_ROUTE.FILTERS,
      to: ClickEventToAction.filterBack
    })
  })

  it('should render filters', async () => {
    const filters = wrapper.findAllComponents(elements.filter)
    expect(filters).toHaveLength(1)
    expect(filters[0].attributes()).toEqual(expect.objectContaining({
      title: 'filter1',
      description: 'filter1 description'
    }))

    await wrapper.findComponent(BaseToggle).vm.$emit('toggle', false)
    expect(toggleMock).toHaveBeenCalledTimes(1)
    expect(toggleMock).toHaveBeenCalledWith(1)
    expect(toggleFilterMock).toHaveBeenCalledTimes(1)
    expect(toggleFilterMock).toHaveBeenCalledWith(1)
    expect(toggleActivityMock).toHaveBeenCalledTimes(1)
    expect(toggleActivityMock).toHaveBeenCalledWith('filter_1', false)
  })
})
