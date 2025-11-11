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
import { SettingsInterface } from '@/modules/settings/common/settings.types'
import { ImportSettingsMessage, SettingsMessages } from '@/modules/settings/common/settings.messages'
import { ImportSettingsListener } from '@/modules/settings/internal/listeners/import-settings.listener'
import { Box } from '@/utils/dispatcher/dispatcher.types'

jest.mock('@/modules/features/web-rtc/internal/web-rtc.utils')

describe('ImportSettingsListener', () => {
  let listener: ImportSettingsListener
  const importMock = jest.fn()
  const service = {
    import: importMock
  } as unknown as SettingsInterface
  beforeEach(() => {
    importMock.mockResolvedValue(false)
    listener = new ImportSettingsListener(service)
  })
  it('should be able to import settings', async () => {
    expect(listener.on()).toBe(SettingsMessages.import)
    expect(listener.main()).toBe(true)
    const message = {
      type: SettingsMessages.import,
      payload: 'test'
    }
    expect(await listener.handle({ message } as unknown as Box<ImportSettingsMessage>)).toEqual(false)
    expect(importMock).toHaveBeenCalledWith('test')
    expect(importMock).toHaveBeenCalledTimes(1)
  })
})
