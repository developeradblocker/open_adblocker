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
import { makeCounter } from '@/utils/counter/counter'
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'
import { DataAccessorInterface } from '@/utils/storage/storage.types'

jest.mock('@/utils/storage/make-data-accessor', () => ({
  makeDataAccessor: jest.fn()
}))

describe('makeCounter', () => {
  let mockStorage: DataAccessorInterface<unknown>

  beforeEach(() => {
    mockStorage = {
      read: jest.fn(),
      write: jest.fn(),
      remove: jest.fn()
    } as unknown as DataAccessorInterface<unknown>
    jest.mocked(makeDataAccessor).mockReturnValue(mockStorage)
  })

  it('returns initial value when get is called', async () => {
    jest.mocked(mockStorage.read).mockResolvedValue(5)
    const counter = makeCounter('testKey', 'local', 5)

    const value = await counter.get()

    expect(value).toBe(5)
  })

  it('increments the counter value by 1 when increase is called', async () => {
    jest.mocked(mockStorage.read).mockResolvedValue(3)
    const counter = makeCounter('testKey', 'local')

    await counter.increase()

    expect(mockStorage.write).toHaveBeenCalledWith(4)
  })

  it('sets the counter to a specific value when set is called', async () => {
    const counter = makeCounter('testKey', 'local')

    await counter.set(10)

    expect(mockStorage.write).toHaveBeenCalledWith(10)
  })

  it('resets the counter to the initial value when reset is called', async () => {
    const counter = makeCounter('testKey', 'local', 7)

    await counter.reset()

    expect(mockStorage.write).toHaveBeenCalledWith(7)
  })

  it('removes the counter from storage when remove is called', async () => {
    const counter = makeCounter('testKey', 'local')

    await counter.remove()

    expect(mockStorage.remove).toHaveBeenCalled()
  })

  it('defaults to 0 when no initial value is provided and reset is called', async () => {
    const counter = makeCounter('testKey', 'local')

    await counter.reset()

    expect(mockStorage.write).toHaveBeenCalledWith(0)
  })
})
