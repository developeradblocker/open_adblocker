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
import BaseToggle from '@/ui/shared/components/base-toggle.vue'

describe('BaseToggle.vue', () => {
  let wrapper: VueWrapper<any>

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(BaseToggle, {
      props: {
        isActive: true
      }
    })
  }

  beforeEach(() => {
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
  })

  it('should emit toggle event', async () => {
    expect(wrapper.emitted('toggle')).toBeFalsy()
    await wrapper.trigger('click')
    expect(wrapper.emitted('toggle')).toEqual([[false]])
  })
})
