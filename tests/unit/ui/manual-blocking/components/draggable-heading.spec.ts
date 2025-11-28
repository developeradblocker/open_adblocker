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
import { defineComponent } from 'vue'
import { shallowMount } from '@vue/test-utils'
import DraggableHeading from '@/ui/manual-blocking/components/draggable-heading.vue'
import { useUIManualBlocking } from '@/modules/features/manual-blocking/ui/manual-blocking.setup'
import { startDragging } from '@/ui/manual-blocking/helpers/drag-n-drop.helper'

jest.mock('@/modules/features/manual-blocking/ui/manual-blocking.setup', () => ({
  useUIManualBlocking: jest.fn()
}))

jest.mock('@/ui/manual-blocking/helpers/drag-n-drop.helper', () => ({
  startDragging: jest.fn(),
  finishDragging: jest.fn()
}))

const BaseSvgStub = defineComponent({
  emits: ['click', 'pointerdown', 'pointerup'],
  props: {
    src: {
      type: String,
      required: false
    }
  },
  template: '<button :class="$attrs.class" @click="$emit(\'click\', $event)" @pointerdown="$emit(\'pointerdown\', $event)" @pointerup="$emit(\'pointerup\', $event)"></button>'
})

describe('DraggableHeading.vue', () => {
  const closeMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useUIManualBlocking).mockReturnValue({
      close: closeMock
    } as any)
  })

  it('delegates close clicks to manual blocking service', async () => {
    const wrapper = shallowMount(DraggableHeading, {
      props: { title: 'test' },
      global: {
        stubs: {
          'base-svg': BaseSvgStub
        }
      }
    })

    await wrapper.find('button.draggable-heading__close').trigger('click')
    expect(closeMock).toHaveBeenCalled()
  })

  it('starts dragging when the header is grabbed', async () => {
    const wrapper = shallowMount(DraggableHeading, {
      props: { title: 'test' },
      global: {
        stubs: {
          'base-svg': BaseSvgStub
        }
      }
    })

    await wrapper.find('.draggable-heading').trigger('pointerdown', {
      button: 0,
      clientX: 10,
      clientY: 20
    })

    expect(startDragging).toHaveBeenCalledWith(expect.objectContaining({
      button: 0,
      clientX: 10,
      clientY: 20
    }))
  })
})
