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
import { Di } from '@/utils/di/di'

describe('Di', () => {
  let di: Di

  beforeEach(() => {
    di = new Di()
  })

  it('throws an error when binding a key that is already bound', () => {
    class TestClass {}
    di.bind('testKey', TestClass)

    expect(() => di.bind('testKey', TestClass)).toThrow(
      'Already bound key "testKey"'
    )
  })

  it('throws an error when binding a constant value to a key that is already bound', () => {
    di.bindConstantValue('testKey', 'value')

    expect(() => di.bindConstantValue('testKey', 'value')).toThrow(
      'Already bound key "testKey"'
    )
  })

  it('retrieves the correct instance for a bound key', () => {
    class TestClass {}
    di.bind('testKey', TestClass)

    const instance = di.get<TestClass>('testKey')

    expect(instance).toBeInstanceOf(TestClass)
  })

  it('throws an error when retrieving a key that is not bound', () => {
    expect(() => di.get('nonExistentKey')).toThrow(
      'No matching bindings found for key "nonExistentKey"'
    )
  })

  it('removes a bound key successfully', () => {
    class TestClass {}
    di.bind('testKey', TestClass)

    di.remove('testKey')

    expect(di.has('testKey')).toBe(false)
  })

  it('throws an error when removing a key that is not bound', () => {
    expect(() => di.remove('nonExistentKey')).toThrow(
      'Could not remove key "nonExistentKey"'
    )
  })

  it('resolves an instance of an injectable class', () => {
    class TestClass {}
    const instance = di.resolve(TestClass)

    expect(instance).toBeInstanceOf(TestClass)
  })

  it('throws an error when resolving a class that is not bound and cannot be auto-bound', () => {
    jest.isolateModules(() => {
      const { di } = require('@/utils/di/di')
      class UnboundClass {}

      expect(() => di.resolve(UnboundClass)).toThrow()
    })
  })
})
