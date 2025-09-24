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
import { internalAdblocker, totalCounter, counterByTab } from '@/modules/ad-blocker/internal/utils'
import { di } from '@/utils/setup-worker'
import { InternalAdBlockerIdentifiers } from '@/modules/ad-blocker/internal/ad-blocker.types'

jest.mock('@/utils/setup-worker', () => ({
  di: {
    get: jest.fn()
  }
}))

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return adBlocker instance with correct identifier', () => {
    const mockAdBlocker = {}
    jest.mocked(di.get).mockReturnValueOnce(mockAdBlocker)

    expect(internalAdblocker()).toBe(mockAdBlocker)
    expect(di.get).toHaveBeenCalledWith(InternalAdBlockerIdentifiers.adBlocker)
  })

  it('should return totalCounter instance with correct identifier', () => {
    const mockTotalCounter = {}
    jest.mocked(di.get).mockReturnValueOnce(mockTotalCounter)

    expect(totalCounter()).toBe(mockTotalCounter)
    expect(di.get).toHaveBeenCalledWith(InternalAdBlockerIdentifiers._totalCounter)
  })

  it('should return counterByTab instance with correct identifier', () => {
    const mockCounterByTab = {}
    jest.mocked(di.get).mockReturnValueOnce(mockCounterByTab)

    expect(counterByTab()).toBe(mockCounterByTab)
    expect(di.get).toHaveBeenCalledWith(InternalAdBlockerIdentifiers._counterByTab)
  })
})
