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
import BaseSnackbar from '@/ui/shared/components/snackbar/base-snackbar.vue'

describe('BaseSnackbar.vue', () => {
  let wrapper: VueWrapper<any>

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(BaseSnackbar, {
      global: {
        stubs: {
          BaseSvg: true
        }
      },
      props: {
        value: {
          message: 'test message',
          type: 'info'
        }
      }
    })
  }

  beforeEach(() => {
    doMount()
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
    expect(wrapper.text()).toContain('test message')
    expect(wrapper.get('.snackbar').classes()).toContain('snackbar--info')
  })

  it('should call "close" on btn click', async () => {
    await wrapper.get('[data-test="close"]').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should call "close" on timeout', async () => {
    await jest.advanceTimersByTimeAsync(4000)
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
