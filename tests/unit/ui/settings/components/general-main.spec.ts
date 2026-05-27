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
import GeneralMain from '@/ui/settings/components/general/general-main.vue'
import TransparentStub from '../../../../helpers/TransparentStub'
import { RATE_US_URL } from '@/modules/rate-us/constants'
import { useExternalSettings } from '@/modules/settings/external/settings.utils'
import { exportData, ExportFormat, ExportTypes } from '@/ui/settings/utils/export-data'
import { importData, ImportErrorReason } from '@/ui/settings/utils/import-data'
import BaseImport from '@/ui/settings/components/base/base-import.vue'
import { flushPromises } from '../../../../helpers/flushPromises'
import { useSettingsStore } from '@/ui/settings/store/settings.store'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'
import { ClickEventToAction, ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { SnackbarId } from '@/ui/shared/components/snackbar/base-snackbar.types'

jest.mock('@/modules/settings/external/settings.utils')
jest.mock('@/ui/settings/utils/import-data')
jest.mock('@/ui/settings/utils/export-data')
jest.mock('@/ui/settings/store/settings.store')
jest.mock('@/modules/user-activity/external/utils')

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
  const clickActivityMock = jest.fn()
  const settingsImportErrorMock = jest.fn()
  const exportMock = jest.fn()
  const setSettingsInfoMock = jest.fn()
  const getMock = jest.fn()
  const setShowLoaderMock = jest.fn()
  const setSnackbarMock = jest.fn()
  const resetSnackbarMock = jest.fn()

  const doMount = (): void => {
    if (wrapper?.exists()) {
      wrapper.unmount()
    }

    (useExternalSettings as jest.Mock).mockReturnValue({
      export: exportMock,
      import: importMock,
      get: getMock
    })

    void (useUserActivity as jest.Mock).mockReturnValue({
      click: clickActivityMock,
      settingsImportError: settingsImportErrorMock
    })

    void (useSettingsStore as unknown as jest.Mock).mockReturnValue({
      setSettingsInfo: setSettingsInfoMock,
      setShowLoader: setShowLoaderMock,
      setSnackbar: setSnackbarMock,
      resetSnackbar: resetSnackbarMock
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

    window.alert = jest.fn()
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
    expect(clickActivityMock).toHaveBeenCalledTimes(1)
    expect(clickActivityMock).toHaveBeenCalledWith(ElementsUI.rateUsButton, {
      page: SETTINGS_ROUTE.GENERAL,
      to: RATE_US_URL
    })
  })

  it('should handle on export click', async () => {
    await wrapper.get(elements.export).trigger('click')
    expect(exportMock).toHaveBeenCalledTimes(1)
    expect(exportData).toHaveBeenCalledTimes(1)
    expect(resetSnackbarMock).toHaveBeenCalledTimes(1)
    expect(exportData).toHaveBeenCalledWith(ExportTypes.settings, 'exported', ExportFormat.json)

    expect(clickActivityMock).toHaveBeenCalledTimes(1)
    expect(clickActivityMock).toHaveBeenCalledWith(ElementsUI.exportSettings, {
      page: SETTINGS_ROUTE.GENERAL,
      to: ClickEventToAction.exportSettings
    })
  })

  it('should trigger file input click on import button click (when fail)', async () => {
    const event = {
      target: {
        files: ['imported']
      }
    }
    await wrapper.findComponent(BaseImport).vm.$emit('change', event)
    expect(importMock).toHaveBeenCalledTimes(1)
    expect(importMock).toHaveBeenCalledWith('imported')

    expect(setShowLoaderMock).toHaveBeenCalledTimes(1)
    expect(setShowLoaderMock).toHaveBeenCalledWith(true)

    await flushPromises()
    expect(wrapper.text()).toContain('Something went wrong. Please try again or use another file')
    expect(setSettingsInfoMock).not.toHaveBeenCalled()

    expect(settingsImportErrorMock).toHaveBeenCalledTimes(1)
    expect(settingsImportErrorMock).toHaveBeenCalledWith(ImportErrorReason.validationError)

    expect(setShowLoaderMock).toHaveBeenCalledTimes(2)
    expect(setShowLoaderMock).toHaveBeenLastCalledWith(false)
  })

  it('should trigger file input click on import button click (when success)', async () => {
    const event = {
      target: {
        files: ['imported']
      }
    }
    importMock.mockResolvedValue(true)
    getMock.mockResolvedValue({ test: true })
    await wrapper.findComponent(BaseImport).vm.$emit('change', event)

    await wrapper.findComponent(elements.import).trigger('click')
    expect(clickActivityMock).toHaveBeenCalledTimes(1)
    expect(clickActivityMock).toHaveBeenCalledWith(ElementsUI.importSettings, {
      page: SETTINGS_ROUTE.GENERAL,
      to: ClickEventToAction.importSettings
    })
    expect(importMock).toHaveBeenCalledTimes(1)
    expect(importMock).toHaveBeenCalledWith('imported')

    await flushPromises()
    expect(setSettingsInfoMock).toHaveBeenCalledTimes(1)
    expect(setSettingsInfoMock).toHaveBeenCalledWith({
      test: true
    })

    expect(resetSnackbarMock).toHaveBeenCalledTimes(1)
    expect(setSnackbarMock).toHaveBeenCalledTimes(1)
    expect(setSnackbarMock).toHaveBeenCalledWith({
      message: 'Successfully imported settings',
      type: 'info',
      trackActivity: true,
      snackbarId: SnackbarId.importSettings
    })
  })
})
