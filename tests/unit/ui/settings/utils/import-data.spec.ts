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
import { importData, ImportErrorReason } from '@/ui/settings/utils/import-data'
import { ExportFormat } from '@/ui/settings/utils/export-data'

describe('importData', () => {
  let mockFileReader: any

  beforeEach(() => {
    mockFileReader = {
      readAsText: jest.fn(),
      onload: null,
      onerror: null,
      result: null
    }

    global.FileReader = jest.fn(() => mockFileReader) as any
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully import a valid JSON file', async () => {
    const fileContent = '{"test": "data"}'
    const file = new File([fileContent], 'test.json', { type: 'application/json' })

    const promise = importData(file, ExportFormat.json)

    mockFileReader.result = fileContent
    mockFileReader.onload({ target: mockFileReader })

    const result = await promise
    expect(result).toBe(fileContent)
    expect(mockFileReader.readAsText).toHaveBeenCalledWith(file, 'UTF-8')
  })

  it('should successfully import a valid TXT file', async () => {
    const fileContent = 'some text content'
    const file = new File([fileContent], 'test.txt', { type: 'text/plain' })

    const promise = importData(file, ExportFormat.txt)

    mockFileReader.result = fileContent
    mockFileReader.onload({ target: mockFileReader })

    const result = await promise
    expect(result).toBe(fileContent)
  })

  it('should reject with invalidFormat when file extension does not match', async () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })

    await expect(importData(file, ExportFormat.json)).rejects.toBe(ImportErrorReason.invalidFormat)
    expect(mockFileReader.readAsText).not.toHaveBeenCalled()
  })

  it('should reject with readingError when FileReader fails', async () => {
    const file = new File(['content'], 'test.json', { type: 'application/json' })

    const promise = importData(file, ExportFormat.json)

    mockFileReader.onerror()

    await expect(promise).rejects.toBe(ImportErrorReason.readingError)
  })

  it('should handle file with .json extension for JSON format', async () => {
    const fileContent = '{"key": "value"}'
    const file = new File([fileContent], 'settings.json', { type: 'application/json' })

    const promise = importData(file, ExportFormat.json)

    mockFileReader.result = fileContent
    mockFileReader.onload({ target: mockFileReader })

    const result = await promise
    expect(result).toBe(fileContent)
  })
})
