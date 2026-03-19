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
import { mount, VueWrapper } from '@vue/test-utils'
import { Route } from '@/ui/manual-blocking/router/route-names'
import { useUIManualBlocking } from '@/modules/features/manual-blocking/ui/manual-blocking.setup'
import { useRoute, useRouter } from 'vue-router'
import { useContentBroadcast } from '@/modules/broadcast/content/broadcast.setup'
import { useBlockElementStore } from '@/ui/manual-blocking/store/block-element.store'

const service = {
  enterPreview: jest.fn(),
  exitPreview: jest.fn(),
  startSelecting: jest.fn(),
  blockElement: jest.fn(),
  changeElement: jest.fn()
}

const pushMock = jest.fn()
const routeMock = {
  query: {
    elementIndex: '2',
    elementsInTraversedTree: '5'
  }
}

jest.mock('@/modules/features/manual-blocking/ui/manual-blocking.setup')
jest.mock('vue-router')
jest.mock('@/modules/broadcast/content/broadcast.setup')
jest.mock('@/ui/manual-blocking/store/block-element.store')
const blockElementStore = {
  sessionId: 'session-id',
  currentDomain: 'localhost'
}

const broadcastService = {
  sendMessage: jest.fn()
}
let SelectionPage: any

beforeAll(async () => {
  SelectionPage = (await import('@/ui/manual-blocking/pages/selection.vue')).default
})

const BaseButtonStub = defineComponent({
  props: {
    label: String
  },
  emits: ['click'],
  template: '<button class="base-button" @click="$emit(\'click\')">{{ label }}</button>'
})

const BaseCheckboxStub = defineComponent({
  props: {
    modelValue: Boolean,
    label: String
  },
  emits: ['update:modelValue'],
  template: '<label><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />{{ label }}</label>'
})

const SliderStub = defineComponent({
  name: 'slider',
  props: {
    modelValue: Number,
    maxValue: Number,
    minValue: Number
  },
  emits: ['update:modelValue'],
  template: '<input class="slider-stub" :value="modelValue" @input="$emit(\'update:modelValue\', Number($event.target.value))" />'
})

const PrimaryLayoutStub = defineComponent({
  template: '<div><slot name="header"></slot><slot name="content"></slot></div>'
})

describe('Selection manual-blocking page', () => {
  const mountComponent = (): VueWrapper => mount(SelectionPage, {
    global: {
      components: {
        slider: SliderStub
      },
      stubs: {
        'primary-layout': PrimaryLayoutStub,
        'draggable-heading': defineComponent({ template: '<div />' }),
        'base-button': BaseButtonStub,
        'base-checkbox': BaseCheckboxStub
      }
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
    pushMock.mockClear()
    Object.values(service).forEach(fn => fn.mockClear())
    jest.mocked(useUIManualBlocking).mockReturnValue(service as any)
    jest.mocked(useRoute).mockReturnValue(routeMock as any)
    jest.mocked(useRouter).mockReturnValue({ push: pushMock } as any)
    jest.mocked(useContentBroadcast).mockReturnValue(broadcastService as any)
    jest.mocked(useBlockElementStore).mockReturnValue(blockElementStore as any)
  })

  it('initializes slider params from the route query', async () => {
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    const sliderComponent = wrapper.findComponent({ name: 'slider' })
    expect(sliderComponent.props('modelValue')).toBe(2)
    expect(sliderComponent.props('maxValue')).toBe(5)
  })

  it('toggles preview mode and calls service hooks', async () => {
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()

    const previewButton = wrapper.findAll('.base-button')[0]
    await previewButton.trigger('click')
    expect(service.enterPreview).toHaveBeenCalled()
    await previewButton.trigger('click')
    expect(service.exitPreview).toHaveBeenCalled()
  })

  it('reselects or blocks elements and routes back to the main page', async () => {
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('.base-button')
    const reselectBtn = buttons[1]
    const blockBtn = buttons[2]
    await reselectBtn.trigger('click')
    expect(service.startSelecting).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith({ name: Route.main })

    await wrapper.findAll('input[type="checkbox"]')[0].setValue(true)
    await wrapper.findAll('input[type="checkbox"]')[1].setValue(true)
    await blockBtn.trigger('click')

    expect(service.blockElement).toHaveBeenCalledWith(true, true)
    expect(pushMock).toHaveBeenCalledWith({ name: Route.main })
  })

  it('updates selected element when slider changes', async () => {
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    const sliderComponent = wrapper.findComponent({ name: 'slider' })
    sliderComponent.vm.$emit('update:modelValue', 4)
    await wrapper.vm.$nextTick()
    expect(service.changeElement).toHaveBeenCalledWith(4)
  })
})
