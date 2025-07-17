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
import { DataAccessor } from '@/utils/storage/data.accessor'
import { DataAccessorException } from '@/utils/storage/storage.exception'

jest.mock('@/utils/logger/logger', () => ({
  logger: { warn: jest.fn() }
}))

describe('DataAccessor', () => {
  const mockStorage = {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn()
  }

  beforeEach(() => {
    global.chrome = {
      storage: {
        local: mockStorage,
        sync: mockStorage
      }
    } as any
  })

  it('returns true if data exists in storage', async () => {
    jest.mocked(mockStorage.get).mockResolvedValue({ testKey: 'value' })
    const accessor = new DataAccessor('local', 'testKey', { useCache: false, asJSON: false })

    const exists = await accessor.exists()

    expect(exists).toBe(true)
  })

  it('returns false if data does not exist in storage', async () => {
    mockStorage.get.mockResolvedValue({})
    const accessor = new DataAccessor('local', 'testKey', { useCache: false, asJSON: false })

    const exists = await accessor.exists()

    expect(exists).toBe(false)
  })

  it('reads data from storage when it exists', async () => {
    mockStorage.get.mockResolvedValue({ testKey: 'value' })
    const accessor = new DataAccessor('local', 'testKey', { useCache: false, asJSON: false })

    const data = await accessor.read()

    expect(data).toBe('value')
  })

  it('throws an error when reading non-existent data without a default value', async () => {
    mockStorage.get.mockResolvedValue({})
    const accessor = new DataAccessor('local', 'testKey', { useCache: false, asJSON: false })

    await expect(accessor.read()).rejects.toThrow(DataAccessorException)
  })

  it('writes data to storage and caches it if caching is enabled', async () => {
    const accessor = new DataAccessor('local', 'testKey', { useCache: true, asJSON: false })

    await accessor.write('value')

    expect(mockStorage.set).toHaveBeenCalledWith({ testKey: 'value' })
  })

  it('removes data from storage and clears the cache', async () => {
    const accessor = new DataAccessor('local', 'testKey', { useCache: true, asJSON: false })

    await accessor.remove()

    expect(mockStorage.remove).toHaveBeenCalledWith('testKey')
  })

  it('returns default value when reading non-existent data with a default value', async () => {
    mockStorage.get.mockResolvedValue({})
    const accessor = new DataAccessor('local', 'testKey', { useCache: false, asJSON: false, default: 'defaultValue' })

    const data = await accessor.read()

    expect(data).toBe('defaultValue')
  })

  it('logs a warning and caches data when writing fails', async () => {
    const { logger } = require('@/utils/logger/logger')
    mockStorage.set.mockRejectedValue(new Error('Write failed'))
    const accessor = new DataAccessor('local', 'testKey', { useCache: true, asJSON: false })

    await accessor.write('value')

    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Write failed'))
    expect(await accessor.read()).toBe('value')
  })
})
