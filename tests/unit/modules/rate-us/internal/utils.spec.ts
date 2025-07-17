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
import { rateUsService, rateUsCounter } from '@/modules/rate-us/internal/utils'
import { di } from '@/utils/setup-worker'
import { RateUsIdentifiers } from '@/modules/rate-us/internal/rate-us.types'

jest.mock('@/utils/setup-worker', () => ({
  di: {
    get: jest.fn()
  }
}))

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return rateUsService instance with correct identifier', () => {
    const mockService = {}
    jest.mocked(di.get).mockReturnValueOnce(mockService)

    expect(rateUsService()).toBe(mockService)
    expect(di.get).toHaveBeenCalledWith(RateUsIdentifiers.rateUsService)
  })

  it('should return rateUsCounter instance with correct identifier', () => {
    const mockCounter = {}
    jest.mocked(di.get).mockReturnValueOnce(mockCounter)

    expect(rateUsCounter()).toBe(mockCounter)
    expect(di.get).toHaveBeenCalledWith(RateUsIdentifiers._counter)
  })
})
