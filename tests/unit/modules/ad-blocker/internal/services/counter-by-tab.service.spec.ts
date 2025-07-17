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
import { CounterByTabService } from '@/modules/ad-blocker/internal/services/counter-by-tab.service'

describe('CounterByTabService', () => {
  let service: CounterByTabService
  let data: Record<number, number>
  const mockDataAccessor = {
    read: jest.fn(),
    write: jest.fn()
  }

  beforeEach(() => {
    service = new CounterByTabService()
    // Override the private dataAccessor with our mock
    // @ts-expect-error accessing private property for testing
    service.dataAccessor = mockDataAccessor
    data = {}
    mockDataAccessor.read.mockResolvedValue(data)
    mockDataAccessor.write.mockImplementation((newData: Record<number, number>) => {
      data = { ...newData }
      return Promise.resolve()
    })
  })

  it('get() should return 0 if no value exists for tab', async () => {
    const result = await service.get(1)
    expect(result).toBe(0)
  })

  it('get() should return the stored counter for a tab', async () => {
    data[2] = 5
    const result = await service.get(2)
    expect(result).toBe(5)
  })

  it('increment() should create and increment value for a tab', async () => {
    await service.increment(3)
    expect(data[3]).toBe(1)
    await service.increment(3)
    expect(data[3]).toBe(2)
  })

  it('reset() should remove the counter for the tab', async () => {
    data[4] = 10
    await service.reset(4)
    expect(data[4]).toBeUndefined()
  })
})
