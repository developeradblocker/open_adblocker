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
import { TotalCounterService } from '@/modules/ad-blocker/internal/services/total-counter.service'
import { makeCounter } from '@/utils/counter/counter'

jest.mock('@/utils/counter/counter', () => ({
  makeCounter: jest.fn()
}))

describe('TotalCounterService', () => {
  let service: TotalCounterService
  const fakeCounter = {
    get: jest.fn(),
    increase: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Override the counter with our fake implementation.
    jest.mocked(makeCounter).mockReturnValue(fakeCounter as any)
    service = new TotalCounterService()
  })

  it('should return the number of total blocked ads with get()', async () => {
    fakeCounter.get.mockResolvedValueOnce(42)
    const result = await service.get()
    expect(fakeCounter.get).toHaveBeenCalledTimes(1)
    expect(result).toBe(42)
  })

  it('should increment the total number of blocked ads with increment()', async () => {
    await service.increment()
    expect(fakeCounter.increase).toHaveBeenCalledTimes(1)
  })
})
