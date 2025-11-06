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
import { setupInternalSettings } from '@/modules/settings/internal/settings.setup'
import { inject } from '@/utils/inject/inject'
import { dispatcher } from '@/utils/setup-worker'
import { onAdGuardReady } from '@/modules/aguard/internal/expose.messages'
import { ExportSettingsListener } from '@/modules/settings/internal/listeners/export-settings.listener'
import { ImportSettingsListener } from '@/modules/settings/internal/listeners/import-settings.listener'
import { InternalSettingsIdentifiers } from '@/modules/settings/internal/settings.types'
import { SettingsService } from '@/modules/settings/internal/service/settings.service'
import { Box } from '@/utils/dispatcher/dispatcher.types'
import { AdGuardOnReadyMessage } from '@/modules/aguard/common/adguard.messages'

jest.mock('@/utils/inject/inject')
jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))
jest.mock('@/modules/aguard/internal/expose.messages')
jest.mock('@/modules/aguard/internal/adguard.setup', () => ({}))
jest.mock('@/modules/settings/internal/listeners/export-settings.listener')
jest.mock('@/modules/settings/internal/listeners/import-settings.listener')

const mockedInject = jest.mocked(inject)
const mockedDispatcher = jest.mocked(dispatcher)
const mockedOnAdGuardReady = jest.mocked(onAdGuardReady)

describe('settings.setup', () => {
  let mockDispatcherInstance: {
    onWithClass: jest.Mock
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockDispatcherInstance = {
      onWithClass: jest.fn()
    }
    mockedDispatcher.mockReturnValue(mockDispatcherInstance as any)
  })

  describe('setupInternalSettings', () => {
    it('should register onAdGuardReady callback', () => {
      setupInternalSettings()

      expect(mockedOnAdGuardReady).toHaveBeenCalledTimes(1)
      expect(mockedOnAdGuardReady).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  describe('handleOnAdGuardReady', () => {
    it('should inject dependencies and register listeners', async () => {
      setupInternalSettings()

      const handleOnAdGuardReady = mockedOnAdGuardReady.mock.calls[0][0]

      await handleOnAdGuardReady({} as unknown as Box<AdGuardOnReadyMessage>)

      expect(mockedInject).toHaveBeenCalledTimes(1)
      expect(mockedInject).toHaveBeenCalledWith([
        {
          key: InternalSettingsIdentifiers.service,
          use: SettingsService
        }
      ])

      expect(mockedDispatcher).toHaveBeenCalled()

      expect(mockDispatcherInstance.onWithClass).toHaveBeenCalledTimes(2)
      expect(mockDispatcherInstance.onWithClass).toHaveBeenCalledWith(ExportSettingsListener)
      expect(mockDispatcherInstance.onWithClass).toHaveBeenCalledWith(ImportSettingsListener)
    })
  })
})
