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
import { FiltersMessages } from '@/modules/filters/common/filters.messages'

jest.mock('@/modules/port/external/port.setup', () => ({
  useExternalPort: jest.fn()
}))

describe('setupExternalFilters', () => {
  let mockPort: ExternalPortChannel

  beforeEach(() => {
    jest.clearAllMocks()
    mockPort = { sendMessage: jest.fn() } as unknown as ExternalPortChannel
    jest.mocked(useExternalPort).mockImplementation(() => mockPort)
  })

  it('sends a toggle message with the correct payload', async () => {
    await jest.isolateModulesAsync(async () => {
      const { setupExternalFilters } = require('@/modules/filters/external/filters.setup')
      const { useExternalFilters } = require('@/modules/filters/external/filters.utils')
      setupExternalFilters()
      const filters = useExternalFilters()
      await filters.toggle(19)

      expect(mockPort.sendMessage).toHaveBeenCalledWith({
        type: FiltersMessages.toggle,
        payload: {
          id: 19
        }
      })
    })
  })

  it('handles multiple toggle calls with different states', async () => {
    await jest.isolateModulesAsync(async () => {
      const { setupExternalFilters } = require('@/modules/filters/external/filters.setup')
      const { useExternalFilters } = require('@/modules/filters/external/filters.utils')
      setupExternalFilters()
      const filters = useExternalFilters()
      await filters.toggle(12)
      await filters.toggle(13)

      expect(mockPort.sendMessage).toHaveBeenCalledTimes(2)
      expect(mockPort.sendMessage).toHaveBeenNthCalledWith(1, {
        type: FiltersMessages.toggle,
        payload: {
          id: 12
        }
      })
      expect(mockPort.sendMessage).toHaveBeenNthCalledWith(2, {
        type: FiltersMessages.toggle,
        payload: {
          id: 13
        }
      })
    })
  })

  it('sends an isEnabled message with the correct payload', async () => {
    await jest.isolateModulesAsync(async () => {
      const { setupExternalFilters } = require('@/modules/filters/external/filters.setup')
      const { useExternalFilters } = require('@/modules/filters/external/filters.utils')
      setupExternalFilters()
      const filters = useExternalFilters()
      await filters.isEnabled(19)

      expect(mockPort.sendMessage).toHaveBeenCalledWith({
        type: FiltersMessages.isEnabled,
        payload: {
          id: 19
        }
      })
    })
  })
})
