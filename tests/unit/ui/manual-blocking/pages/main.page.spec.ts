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
import { computed, defineComponent, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { storeToRefs } from 'pinia'
import { useUIManualBlocking } from '@/modules/features/manual-blocking/ui/manual-blocking.setup'
import { useBlockElementStore } from '@/ui/manual-blocking/store/block-element.store'

const manualBlockingService = {
  close: jest.fn(),
  startSelecting: jest.fn(),
  resetRules: jest.fn()
}

const blockElementStore = {
  removeRule: jest.fn()
}

jest.mock('@/modules/features/manual-blocking/ui/manual-blocking.setup', () => ({
  __esModule: true,
  useUIManualBlocking: jest.fn()
}))

jest.mock('@/ui/manual-blocking/store/block-element.store', () => ({
  __esModule: true,
  useBlockElementStore: jest.fn(() => blockElementStore)
}))

jest.mock('pinia', () => {
  const actual = jest.requireActual('pinia')
  return {
    ...actual,
    storeToRefs: jest.fn()
  }
})

let MainPage: any

beforeAll(async () => {
  MainPage = (await import('@/ui/manual-blocking/pages/main.vue')).default
})

const BaseButtonStub = defineComponent({
  props: {
    label: String
  },
  emits: ['click'],
  template: '<button class="base-button" @click="$emit(\'click\')">{{ label }}</button>'
})

const PrimaryLayoutStub = defineComponent({
  template: '<div><slot name="header"></slot><slot name="content"></slot></div>'
})

describe('Main manual-blocking page', () => {
  const mountComponent = (): VueWrapper<any> => mount(MainPage, {
    global: {
      stubs: {
        'primary-layout': PrimaryLayoutStub,
        'base-button': BaseButtonStub,
        'base-svg': defineComponent({ template: '<svg />' }),
        'draggable-heading': defineComponent({ template: '<div class="heading-stub" />' })
      }
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
    blockElementStore.removeRule.mockClear()
    manualBlockingService.close.mockClear()
    manualBlockingService.startSelecting.mockClear()
    manualBlockingService.resetRules.mockClear()
    jest.mocked(useUIManualBlocking).mockReturnValue(manualBlockingService as any)
    jest.mocked(useBlockElementStore).mockReturnValue(blockElementStore as any)
  })

  it('shows the list of applied rules and supports removal actions', async () => {
    const rules = ref(['rule-1', 'rule-2'])
    jest.mocked(storeToRefs).mockReturnValue({
      appliedRules: computed(() => rules.value)
    })
    const wrapper = mountComponent()

    await wrapper.find('.action-item--remove').trigger('click')
    expect(manualBlockingService.resetRules).toHaveBeenCalledWith(['rule-1'])
    expect(blockElementStore.removeRule).toHaveBeenCalledWith('rule-1')

    await wrapper.findAll('.base-button')[0].trigger('click') // Reset all
    expect(manualBlockingService.resetRules).toHaveBeenCalledWith(['rule-1', 'rule-2'])
    expect(manualBlockingService.close).toHaveBeenCalled()

    await wrapper.findAll('.base-button')[1].trigger('click') // Block another element
    expect(manualBlockingService.startSelecting).toHaveBeenCalled()
  })

  it('renders placeholder state and allows cancel', async () => {
    jest.mocked(storeToRefs).mockReturnValue({
      appliedRules: computed(() => [])
    })
    const wrapper = mountComponent()

    await wrapper.find('.base-button').trigger('click')
    expect(manualBlockingService.close).toHaveBeenCalled()
  })
})
