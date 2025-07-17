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
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'
import { DataAccessor } from '@/utils/storage/data.accessor'
import MockedObject = jest.MockedObject

jest.mock('@/utils/storage/data.accessor', () => ({
  DataAccessor: jest.fn()
}))

describe('makeDataAccessor', () => {
  it('creates a DataAccessor with default options when no options are provided', () => {
    const mockInstance = {} as unknown as MockedObject<DataAccessor<unknown>>
    jest.mocked(DataAccessor).mockImplementation(() => mockInstance)

    const accessor = makeDataAccessor('local', 'testKey')

    expect(DataAccessor).toHaveBeenCalledWith('local', 'testKey', {
      asJSON: false,
      useCache: true,
      default: undefined
    })
    expect(accessor).toBe(mockInstance)
  })

  it('creates a DataAccessor with provided options', () => {
    const mockInstance = {} as unknown as MockedObject<DataAccessor<unknown>>
    jest.mocked(DataAccessor).mockImplementation(() => mockInstance)

    const accessor = makeDataAccessor('sync', 'testKey', {
      asJSON: true,
      useCache: false,
      default: 'defaultValue'
    })

    expect(DataAccessor).toHaveBeenCalledWith('sync', 'testKey', {
      asJSON: true,
      useCache: false,
      default: 'defaultValue'
    })
    expect(accessor).toBe(mockInstance)
  })
})
