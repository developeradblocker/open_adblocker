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
import { buildFileName, exportData, ExportFormat, ExportTypes } from '@/ui/settings/utils/export-data'
import { getVersion } from '@/ui/settings/utils/get-version'

jest.mock('@/ui/settings/utils/get-version')

describe('export-data', () => {
  const mockGetVersion = jest.mocked(getVersion)

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetVersion.mockReturnValue('1.0.0')
  })

  describe('buildFileName', () => {
    it('should build filename for settings in JSON format', () => {
      const mockDate = 1234567890
      jest.spyOn(Date, 'now').mockReturnValue(mockDate)

      const result = buildFileName(ExportTypes.settings, ExportFormat.json)

      expect(result).toBe('open_adblocker_settings_1.0.0_1234567890.json')
      expect(mockGetVersion).toHaveBeenCalledTimes(1)
    })

    it('should build filename for settings in TXT format', () => {
      const mockDate = 9876543210
      jest.spyOn(Date, 'now').mockReturnValue(mockDate)

      const result = buildFileName(ExportTypes.settings, ExportFormat.txt)

      expect(result).toBe('open_adblocker_settings_1.0.0_9876543210.txt')
    })

    it('should include version in filename', () => {
      mockGetVersion.mockReturnValue('2.5.3')
      jest.spyOn(Date, 'now').mockReturnValue(1111111111)

      const result = buildFileName(ExportTypes.settings, ExportFormat.json)

      expect(result).toContain('2.5.3')
    })
  })

  describe('exportData', () => {
    let mockLink: any
    let mockBlob: any
    let mockURL: any

    beforeEach(() => {
      mockLink = {
        style: {},
        href: '',
        download: '',
        click: jest.fn(),
        remove: jest.fn()
      }

      mockBlob = {}
      mockURL = 'blob:mock-url'

      global.Blob = jest.fn(() => mockBlob) as any
      global.URL.createObjectURL = jest.fn(() => mockURL)
      global.URL.revokeObjectURL = jest.fn()
      document.createElement = jest.fn(() => mockLink)
      document.body.appendChild = jest.fn()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should export data as JSON file', async () => {
      const testData = { test: 'data', value: 123 }
      jest.spyOn(Date, 'now').mockReturnValue(1234567890)

      await exportData(ExportTypes.settings, testData, ExportFormat.json)

      expect(global.Blob).toHaveBeenCalledWith(['{"test":"data","value":123}'])
      expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(mockLink.style.display).toBe('none')
      expect(mockLink.href).toBe(mockURL)
      expect(mockLink.download).toBe('open_adblocker_settings_1.0.0_1234567890.json')
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink)
      expect(mockLink.click).toHaveBeenCalledTimes(1)
      expect(mockLink.remove).toHaveBeenCalledTimes(1)
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockURL)
    })

    it('should stringify data correctly', async () => {
      const complexData = {
        nested: { key: 'value' },
        array: [1, 2, 3],
        boolean: true
      }

      await exportData(ExportTypes.settings, complexData, ExportFormat.json)

      expect(global.Blob).toHaveBeenCalledWith([JSON.stringify(complexData)])
    })

    it('should create and clean up link element', async () => {
      await exportData(ExportTypes.settings, {}, ExportFormat.json)

      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink)
      expect(mockLink.click).toHaveBeenCalled()
      expect(mockLink.remove).toHaveBeenCalled()
    })

    it('should revoke object URL after download', async () => {
      await exportData(ExportTypes.settings, {}, ExportFormat.json)

      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockURL)
    })
  })
})
