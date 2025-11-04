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
import { ExportFormat } from '@/ui/settings/utils/export-data'

export enum ImportErrorReason {
  invalidFormat = 'invalidFormat',
  readingError = 'readingError',
  validationError = 'validationError'
}

export const ImportErrors: Record<ImportErrorReason, string> = {
  [ImportErrorReason.invalidFormat]: 'File format is invalid',
  [ImportErrorReason.readingError]: 'Something went wrong. Please try again or use another file',
  [ImportErrorReason.validationError]: 'Something went wrong. Please try again or use another file'
}
export const importData = async (file: File, ext: ExportFormat): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith(ext)) {
      reject(ImportErrorReason.invalidFormat)
    }
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = (event: Event): void => {
      if (event.target) {
        // @ts-ignore-error
        resolve(event.target.result)
      }
    }
    reader.onerror = (): void => {
      reject(ImportErrorReason.readingError)
    }
  })
}
