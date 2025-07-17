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
import {
  setupExternalAdBlocker
} from '@/modules/ad-blocker/external/ad-blocker.setup'
import { useExternalPort } from '@/modules/port/external/port.setup'
import { AdBlockerMessages } from '@/modules/ad-blocker/common/ad-blocker.messages'
import { ExternalPortChannel } from '@/modules/port/external/port.types'

jest.mock('@/modules/port/external/port.setup', () => ({
  useExternalPort: jest.fn()
}))

describe('setupExternalAdBlocker', () => {
  let mockPort: ExternalPortChannel

  beforeEach(() => {
    jest.clearAllMocks()
    mockPort = { sendMessage: jest.fn() } as unknown as ExternalPortChannel
    jest.mocked(useExternalPort).mockImplementation(() => mockPort)
  })

  it('returns the same instance when called multiple times', () => {
    const adBlocker1 = setupExternalAdBlocker()
    const adBlocker2 = setupExternalAdBlocker()

    expect(adBlocker1).toBe(adBlocker2)
  })

  it('throws an error if "useExternalAdBlocker" is called before setup', () => {
    jest.isolateModules(() => {
      const { useExternalAdBlocker } = require('@/modules/ad-blocker/external/ad-blocker.setup')
      expect(() => useExternalAdBlocker()).toThrow(
        'AdBlocker is not set up. Please call "setupExternalAdBlocker" first.'
      )
    })
  })

  it('sends a toggle message with the correct payload', async () => {
    await jest.isolateModulesAsync(async () => {
      const { setupExternalAdBlocker, useExternalAdBlocker } = require('@/modules/ad-blocker/external/ad-blocker.setup')
      setupExternalAdBlocker()
      const adBlocker = useExternalAdBlocker()
      await adBlocker.toggle(true)

      expect(mockPort.sendMessage).toHaveBeenCalledWith({
        type: AdBlockerMessages.toggle,
        payload: true
      })
    })
  })

  it('handles multiple toggle calls with different states', async () => {
    await jest.isolateModulesAsync(async () => {
      const { setupExternalAdBlocker, useExternalAdBlocker } = require('@/modules/ad-blocker/external/ad-blocker.setup')
      setupExternalAdBlocker()
      const adBlocker = useExternalAdBlocker()
      await adBlocker.toggle(true)
      await adBlocker.toggle(false)

      expect(mockPort.sendMessage).toHaveBeenCalledTimes(2)
      expect(mockPort.sendMessage).toHaveBeenNthCalledWith(1, {
        type: AdBlockerMessages.toggle,
        payload: true
      })
      expect(mockPort.sendMessage).toHaveBeenNthCalledWith(2, {
        type: AdBlockerMessages.toggle,
        payload: false
      })
    })
  })
})
