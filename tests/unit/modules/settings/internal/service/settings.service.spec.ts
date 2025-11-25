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
import { SettingsService } from '@/modules/settings/internal/service/settings.service'
import { FiltersServiceInterface } from '@/modules/filters/internal/filters.types'
import { WebRTCInterface } from '@/modules/features/web-rtc/common/web-rtc.types'
import { WhitelistInterface } from '@/modules/whitelist/common/whetelist.types'
import { ExportedSettings, MetadataServiceInterface, SETTINGS_VERSION } from '@/modules/settings/common/settings.types'
import { COOKIE_CLEANER_ID } from '../../../../../../constants'
import { structureValidator } from '@/modules/settings/internal/validators/structure.validator'
import { privacyValidator } from '@/modules/settings/internal/validators/privacy.validator'
import { getConfiguration } from '@/modules/aguard/internal/adguard.setup'
import { tsWebExtension } from '@/modules/aguard/internal/utils'
import { InternalManualBlockingServiceInterface } from '@/modules/features/manual-blocking/internal/manual-blocking.types'

jest.mock('@/modules/settings/internal/validators/structure.validator')
jest.mock('@/modules/settings/internal/validators/privacy.validator')
jest.mock('@/modules/aguard/internal/adguard.setup', () => ({
  getConfiguration: jest.fn().mockResolvedValue({} as any)
}))
jest.mock('@/utils/logger/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))
jest.mock('@/modules/aguard/internal/utils', () => ({
  tsWebExtension: jest.fn().mockReturnValue({
    configure: jest.fn()
  })
}))

describe('SettingsService', () => {
  let service: SettingsService
  let mockFilters: jest.Mocked<FiltersServiceInterface>
  let mockWebRtc: jest.Mocked<WebRTCInterface>
  let mockWhitelist: jest.Mocked<WhitelistInterface>
  let mockMetadata: jest.Mocked<MetadataServiceInterface>
  let mockUserRules: jest.Mocked<InternalManualBlockingServiceInterface>

  const metadata = {
    filters: [],
    groups: []
  }
  const enabledFilters = [1, 2, 3]
  const domains = ['example.com', 'test.com']

  const configureMock = jest.fn()
  beforeEach(() => {
    (tsWebExtension as jest.Mock).mockReturnValue({
      configure: configureMock
    })
    mockFilters = {
      isEnabled: jest.fn(),
      getEnabledFilters: jest.fn(),
      setup: jest.fn()
    } as any

    mockWebRtc = {
      getState: jest.fn(),
      setup: jest.fn()
    } as any

    mockWhitelist = {
      getDomains: jest.fn(),
      setup: jest.fn()
    } as any

    mockUserRules = {
      getUserRules: jest.fn(),
      setRules: jest.fn()
    } as any

    mockMetadata = {
      getMetadata: jest.fn()
    } as any

    jest.mocked(structureValidator).mockResolvedValue(undefined)
    jest.mocked(privacyValidator).mockResolvedValue(undefined)
    jest.mocked(getConfiguration).mockResolvedValue({} as any)
    jest.mocked(mockMetadata.getMetadata).mockResolvedValue({ metadata })

    mockFilters.isEnabled.mockResolvedValue(true)
    mockFilters.getEnabledFilters.mockResolvedValue(enabledFilters)
    mockWebRtc.getState.mockResolvedValue(false)
    mockWhitelist.getDomains.mockResolvedValue(domains)
    service = new SettingsService(
      mockFilters,
      mockMetadata,
      mockWebRtc,
      mockWhitelist,
      mockUserRules
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('export', () => {
    it('should export settings with all required fields', async () => {
      const result = await service.export()

      expect(result).toEqual({
        version: SETTINGS_VERSION,
        general: {
          cookieCleaner: true,
          webRTC: false
        },
        filters: {
          enabledFilters,
          whiteList: {
            domains
          }
        }
      })
    })
  })

  describe('import', () => {
    const validSettings: ExportedSettings = {
      version: SETTINGS_VERSION,
      general: {
        cookieCleaner: true,
        webRTC: false
      },
      filters: {
        enabledFilters: [1, 2, 3],
        whiteList: {
          domains: ['example.com']
        }
      }
    }

    beforeEach(() => {
      mockFilters.setup.mockResolvedValue(undefined)
      mockWebRtc.setup.mockResolvedValue(undefined)
      mockWhitelist.setup.mockResolvedValue(undefined)
      configureMock.mockResolvedValue(undefined)
    })

    it('should import valid settings successfully', async () => {
      const content = JSON.stringify(validSettings)

      const result = await service.import(content)

      expect(result).toBe(true)
      expect(privacyValidator).toHaveBeenCalledTimes(1)
      expect(structureValidator).toHaveBeenCalledTimes(1)
      expect(mockFilters.setup).toHaveBeenCalledWith([1, 2, 3, COOKIE_CLEANER_ID])
      expect(mockWebRtc.setup).toHaveBeenCalledWith(false)
      expect(mockWhitelist.setup).toHaveBeenCalledWith(['example.com'])
      expect(configureMock).toHaveBeenCalled()
    })

    it('should return false on invalid JSON', async () => {
      const content = 'invalid json'

      const result = await service.import(content)

      expect(result).toBe(false)
      expect(mockFilters.setup).not.toHaveBeenCalled()
    })

    it('should return false when privacy validator fails', async () => {
      jest.mocked(privacyValidator).mockRejectedValue(new Error('Privacy validation failed'))
      const content = JSON.stringify(validSettings)

      const result = await service.import(content)

      expect(result).toBe(false)
      expect(mockFilters.setup).not.toHaveBeenCalled()
    })

    it('should return false when structure validator fails', async () => {
      jest.mocked(structureValidator).mockRejectedValue(new Error('Structure validation failed'))
      const content = JSON.stringify(validSettings)

      const result = await service.import(content)

      expect(result).toBe(false)
      expect(mockFilters.setup).not.toHaveBeenCalled()
    })

    it('should return false when populateLocalSettings fails', async () => {
      mockFilters.setup.mockRejectedValue(new Error('Setup failed'))
      const content = JSON.stringify(validSettings)

      const result = await service.import(content)

      expect(result).toBe(false)
    })

    it('should configure tsWebExtension after populating settings', async () => {
      const content = JSON.stringify(validSettings)
      const mockConfig = { some: 'config' }
      jest.mocked(getConfiguration).mockResolvedValue(mockConfig as any)

      await service.import(content)

      expect(getConfiguration).toHaveBeenCalled()
      expect(configureMock).toHaveBeenCalledWith(mockConfig)
    })
  })

  describe('get', () => {
    it('should be able to retrieve metadata', async () => {
      const result = await service.get()
      expect(result).toEqual({
        version: SETTINGS_VERSION,
        general: {
          cookieCleaner: true,
          webRTC: false
        },
        filters: {
          enabledFilters,
          whiteList: {
            domains
          }
        },
        metadata
      })
    })
  })
})
