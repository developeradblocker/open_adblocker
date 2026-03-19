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
import { mount } from '@vue/test-utils'
import Slider from '@/ui/manual-blocking/components/slider.vue'

describe('Slider.vue', () => {
  it('emits updated model value when user drags the thumb', async () => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: 1,
        minValue: 0,
        maxValue: 10,
        step: 1
      }
    })

    const input = wrapper.find('input[type="range"]')
    const inputEl = input.element as HTMLInputElement
    inputEl.value = '5'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([5])
  })

  it('renders ticks for every step across the range', () => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: 0,
        minValue: 0,
        maxValue: 4,
        step: 2
      }
    })
    const ticks = wrapper.findAll('.slider-container__tick')
    expect(ticks).toHaveLength(4 / 2 + 1)
    expect(ticks[0].attributes('style')).toContain('left: 0%')
  })
})
