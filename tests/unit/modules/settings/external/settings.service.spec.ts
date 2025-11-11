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
import { useExternalPort } from '@/modules/port/external/port.setup'
import { ExternalPortChannel } from '@/modules/port/external/port.types'
import { SettingsService } from '@/modules/settings/external/service/settings.service'
import { SettingsMessages } from '@/modules/settings/common/settings.messages'

jest.mock('@/modules/port/external/port.setup')

describe('SettingsService', () => {
  let service: SettingsService
  const mockPort = { sendMessage: jest.fn() } as unknown as ExternalPortChannel
  beforeEach(() => {
    jest.mocked(useExternalPort).mockImplementation(() => mockPort)
    service = new SettingsService()
  })

  it('should be able to export settings', async () => {
    jest.mocked(mockPort.sendMessage).mockResolvedValue({ settings: true })
    expect(mockPort.sendMessage).not.toHaveBeenCalled()
    expect(await service.export()).toEqual({ settings: true })
    expect(mockPort.sendMessage).toHaveBeenCalledWith({
      type: SettingsMessages.export
    })
  })

  it('should be able to import settings', async () => {
    jest.mocked(mockPort.sendMessage).mockResolvedValue(false)
    expect(mockPort.sendMessage).not.toHaveBeenCalled()
    expect(await service.import('text')).toEqual(false)
    expect(mockPort.sendMessage).toHaveBeenCalledWith({
      type: SettingsMessages.import,
      payload: 'text'
    })
  })
})
