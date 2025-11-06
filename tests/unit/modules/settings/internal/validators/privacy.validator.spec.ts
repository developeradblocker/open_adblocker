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
import { privacyValidator } from '@/modules/settings/internal/validators/privacy.validator'
import { OpenADBSettings, SETTINGS_VERSION } from '@/modules/settings/common/settings.types'
import { checkWebRTCPermissions } from '@/modules/features/web-rtc/common/web-rtc.utils'

jest.mock('@/modules/features/web-rtc/common/web-rtc.utils')

describe('privacyValidator', () => {
  const mockCheckWebRTCPermissions = jest.mocked(checkWebRTCPermissions)

  const validSettings: OpenADBSettings = {
    version: SETTINGS_VERSION,
    general: {
      cookieCleaner: false,
      webRTC: false
    },
    filters: {
      enabledFilters: [],
      enabledGroups: [],
      whiteList: {
        domains: []
      }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should pass validation when webRTC is false', async () => {
    const settings: OpenADBSettings = {
      ...validSettings,
      general: {
        ...validSettings.general,
        webRTC: false
      }
    }

    await expect(privacyValidator(settings)).resolves.toBeUndefined()
    expect(mockCheckWebRTCPermissions).not.toHaveBeenCalled()
  })

  it('should pass validation when webRTC is true and permissions are granted', async () => {
    mockCheckWebRTCPermissions.mockResolvedValue(true)
    const settings: OpenADBSettings = {
      ...validSettings,
      general: {
        ...validSettings.general,
        webRTC: true
      }
    }

    await expect(privacyValidator(settings)).resolves.toBeUndefined()
    expect(mockCheckWebRTCPermissions).toHaveBeenCalledTimes(1)
  })

  it('should throw error when webRTC is true but permissions are not granted', async () => {
    mockCheckWebRTCPermissions.mockResolvedValue(false)
    const settings: OpenADBSettings = {
      ...validSettings,
      general: {
        ...validSettings.general,
        webRTC: true
      }
    }

    await expect(privacyValidator(settings)).rejects.toThrow('Permissions for webRTC are not granted')
    expect(mockCheckWebRTCPermissions).toHaveBeenCalledTimes(1)
  })

  it('should throw error when webRTC value is not a boolean', async () => {
    const settings = {
      ...validSettings,
      general: {
        ...validSettings.general,
        webRTC: 'invalid' as any
      }
    }

    await expect(privacyValidator(settings)).rejects.toThrow('Invalid webRTC value')
    expect(mockCheckWebRTCPermissions).not.toHaveBeenCalled()
  })

  it('should throw error when webRTC value is undefined', async () => {
    const settings = {
      ...validSettings,
      general: {
        ...validSettings.general,
        webRTC: undefined as any
      }
    }

    await expect(privacyValidator(settings)).rejects.toThrow('Invalid webRTC value')
  })

  it('should throw error when general is undefined', async () => {
    const settings = {
      ...validSettings,
      general: undefined as any
    }

    await expect(privacyValidator(settings)).rejects.toThrow('Invalid webRTC value')
  })

  it('should throw error when webRTC is null', async () => {
    const settings = {
      ...validSettings,
      general: {
        ...validSettings.general,
        webRTC: null as any
      }
    }

    await expect(privacyValidator(settings)).rejects.toThrow('Invalid webRTC value')
  })
})
