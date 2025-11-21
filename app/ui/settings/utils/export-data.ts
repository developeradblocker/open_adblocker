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
import { getVersion } from '@/ui/settings/utils/get-version'

export enum ExportTypes {
  settings = 'settings',
  userRules = 'userRules'
}

export enum ExportFormat {
  json = 'json',
  txt = 'txt',
}

export const buildFileName = (type: ExportTypes, format: ExportFormat): string => {
  const product = `open_adblocker_${type}`
  return `${product}_${getVersion()}_${Date.now()}.${format}`
}

export const exportData = async <T extends object | string>(type: ExportTypes, data: T, format: ExportFormat): Promise<void> => {
  const filename = buildFileName(type, format)
  const content = typeof data === 'string' ? data : JSON.stringify(data)
  const blob = new Blob([content])
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
