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
import { whiteList } from '@/modules/whitelist/internal/utils'
import { di } from '@/utils/setup-worker'
import { WhitelistIdentifiers } from '@/modules/whitelist/internal/whitelist.types'

jest.mock('@/utils/setup-worker', () => ({
  di: {
    get: jest.fn()
  }
}))

describe('whiteList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return whitelist instance with correct identifier', () => {
    const mockWhitelistInstance = {}
    // Set the mock return value for di.get
    jest.mocked(di.get).mockReturnValueOnce(mockWhitelistInstance)

    // Call whiteList and verify that it returns the mock instance
    const result = whiteList()
    expect(result).toBe(mockWhitelistInstance)
    expect(di.get).toHaveBeenCalledWith(WhitelistIdentifiers.service)
  })
})
