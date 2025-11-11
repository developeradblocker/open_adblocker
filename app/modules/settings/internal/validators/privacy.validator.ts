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
import { ExportedSettings } from '@/modules/settings/common/settings.types'
import { checkWebRTCPermissions } from '@/modules/features/web-rtc/common/web-rtc.utils'

export const privacyValidator = async (settings: ExportedSettings): Promise<void> => {
  const { webRTC } = settings?.general ?? {}
  if (typeof webRTC !== 'boolean') {
    throw new Error('Invalid webRTC value')
  }

  if (!webRTC) {
    return
  }

  const permissions = await checkWebRTCPermissions()
  if (!permissions) {
    throw new Error('Permissions for webRTC are not granted')
  }
}
