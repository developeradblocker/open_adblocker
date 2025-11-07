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
import GeneralMain from '@/ui/settings/components/general/general-main.vue'
import TransparentStub from '../../../../helpers/TransparentStub'
import { RATE_US_URL } from '@/modules/rate-us/constants'

describe('GeneralMain.vue', () => {
  let wrapper: VueWrapper<any>

  const createTabMock = jest.fn()
  const elements = {
    import: '[data-test="import"]',
    export: '[data-test="export"]',
    report: '[data-test="report"]',
    rate: '[data-test="rate"]'
  }

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    wrapper = shallowMount(GeneralMain, {
      global: {
        stubs: {
          BaseBox: TransparentStub(),
          BaseSvg: true
        }
      }
    })
  }

  beforeEach(() => {
    doMount()

    global.chrome = {
      tabs: {
        create: createTabMock
      }
    } as any
  })

  it('should render', () => {
    expect(wrapper.exists())
      .toBeTruthy()
  })

  it('should create new tab on rate us clicked', async () => {
    await wrapper.get(elements.rate).trigger('click')
    expect(createTabMock).toHaveBeenCalledTimes(1)
    expect(createTabMock).toHaveBeenCalledWith({
      url: RATE_US_URL
    })
  })
})
