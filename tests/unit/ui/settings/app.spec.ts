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
import App from '@/ui/settings/app.vue'
import { useExternalPort } from '@/modules/port/external/port.setup'
import { useExternalSettings } from '@/modules/settings/external/settings.utils'
import { useSettingsStore } from '@/ui/settings/store/settings.store'
import { flushPromises } from '../../../helpers/flushPromises'
import { useRoute } from 'vue-router'

jest.mock('@/modules/port/external/port.setup')
jest.mock('@/modules/settings/external/settings.utils')
jest.mock('@/ui/settings/store/settings.store')
jest.mock('vue-router')

describe('App.vue', () => {
  let wrapper: VueWrapper<any>

  const establishMock = jest.fn()
  const getMock = jest.fn()
  const setSettingsInfoMock = jest.fn()

  const mockSettings = {
    version: '1.0.0',
    general: {
      cookieCleaner: true,
      webRTC: false
    },
    filters: {
      enabledFilters: [1, 2, 3],
      whiteList: {
        domains: ['example.com']
      }
    },
    metadata: {
      filters: [],
      groups: []
    }
  }

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(App, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
            props: ['to']
          },
          RouterView: true
        }
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()

    establishMock.mockResolvedValue(undefined)
    getMock.mockResolvedValue(mockSettings)

    void (useExternalPort as jest.Mock).mockReturnValue({
      establish: establishMock
    })

    void (useRoute as jest.Mock).mockReturnValue({
      name: 'SETTINGS_GROUPS',
      path: '/groups'
    })
    void (useExternalSettings as jest.Mock).mockReturnValue({
      get: getMock
    })
    void (useSettingsStore as unknown as jest.Mock).mockReturnValue({
      setSettingsInfo: setSettingsInfoMock
    })

    doMount()
  })

  afterEach(() => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }
  })

  it('should render the app component', () => {
    doMount()
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render navigation links', () => {
    const links = wrapper.findAll('.app__nav-link')
    expect(links).toHaveLength(2)
    expect(links[0].text()).toBe('General')
    expect(links[1].text()).toBe('Filters')
  })

  it('should establish port connection on mount', async () => {
    await flushPromises()
    expect(establishMock).toHaveBeenCalledTimes(1)
  })

  it('should fetch settings on mount', async () => {
    await flushPromises()
    expect(getMock).toHaveBeenCalledTimes(1)
  })

  it('should set settings info in store on mount', async () => {
    await flushPromises()
    expect(setSettingsInfoMock).toHaveBeenCalledWith(mockSettings)
  })

  it('should mark Filters link as active when path includes groups', () => {
    const links = wrapper.findAll('.app__nav-link')
    expect(links[0].classes()).not.toContain('app__nav-link--active')
    expect(links[1].classes()).toContain('app__nav-link--active')
  })
})
