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
import BaseImport from '@/ui/settings/components/base/base-import.vue'

describe('BaseImport.vue', () => {
  let wrapper: VueWrapper<any>

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(BaseImport, {
      props: {
        accept: 'json'
      },
      slots: {
        default: `<template #default="{ input }">
          <button :data-test-input="!!input">Click</button>
        </template>`
      }
    })
  }

  beforeEach(() => {
    doMount()
  })

  afterEach(() => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }
  })

  it('should render', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render input element with correct accept attribute', () => {
    const input = wrapper.find('[data-test="file"]')
    expect(input.exists()).toBeTruthy()
    expect(input.attributes('accept')).toBe('json')
  })

  it('should emit change event when file is selected', async () => {
    const input = wrapper.find('[data-test="file"]')

    await input.trigger('change')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('should provide inputRef to slot', () => {
    const button = wrapper.find('button')
    expect(button.exists()).toBeTruthy()
    expect(button.attributes('data-test-input')).toBe('true')
  })
})
