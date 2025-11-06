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
import { useExternalSettings } from '@/modules/settings/external/settings.utils'
import { exportData, ExportFormat, ExportTypes } from '@/ui/settings/utils/export-data'
import { importData } from '@/ui/settings/utils/import-data'
import BaseImport from '@/ui/settings/components/base/base-import.vue'
import { flushPromises } from '../../../../helpers/flushPromises'

jest.mock('@/modules/settings/external/settings.utils')
jest.mock('@/ui/settings/utils/import-data')
jest.mock('@/ui/settings/utils/export-data')

describe('GeneralMain.vue', () => {
  let wrapper: VueWrapper<any>

  const createTabMock = jest.fn()
  const elements = {
    import: '[data-test="import"]',
    export: '[data-test="export"]',
    report: '[data-test="report"]',
    rate: '[data-test="rate"]'
  }

  const importMock = jest.fn()
  const exportMock = jest.fn()

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    (useExternalSettings as jest.Mock).mockReturnValue({
      export: exportMock,
      import: importMock
    })

    wrapper = shallowMount(GeneralMain, {
      global: {
        stubs: {
          BaseBox: TransparentStub(),
          BaseSvg: true,
          BaseImport: false
        }
      }
    })
  }

  beforeEach(() => {
    (importData as jest.Mock).mockResolvedValue('imported')
    exportMock.mockResolvedValue('exported')
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

  it('should handle on export click', async () => {
    await wrapper.get(elements.export).trigger('click')
    expect(exportMock).toHaveBeenCalledTimes(1)
    expect(exportData).toHaveBeenCalledTimes(1)
    expect(exportData).toHaveBeenCalledWith(ExportTypes.settings, 'exported', ExportFormat.json)
  })

  it('should trigger file input click on import button click', async () => {
    const event = {
      target: {
        files: ['imported']
      }
    }
    await wrapper.findComponent(BaseImport).vm.$emit('change', event)
    expect(importMock).toHaveBeenCalledTimes(1)
    expect(importMock).toHaveBeenCalledWith('imported')

    await flushPromises()
    expect(wrapper.text()).toContain('Something went wrong. Please try again or use another file')
  })
})
