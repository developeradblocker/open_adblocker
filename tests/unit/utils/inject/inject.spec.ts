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
import { inject } from '@/utils/inject/inject'
import { di } from '@/utils/setup-worker'
import { Injection } from '@/utils/inject/inject.types'

jest.mock('@/utils/setup-worker', () => ({
  di: {
    bindConstantValue: jest.fn(),
    bind: jest.fn()
  }
}))

describe('inject', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('binds constant values when the injection has a value property', () => {
    const injections: Injection[] = [
      {
        key: 'constKey',
        use: 'constantValue',
        value: true
      }
    ]
    inject(injections)
    expect(di.bindConstantValue).toHaveBeenCalledWith('constKey', 'constantValue')
  })

  it('binds lazy services when the injection lacks a value property', () => {
    const service = jest.fn()
    const injections: Injection[] = [
      {
        key: 'serviceKey',
        use: service
      }
    ]
    inject(injections)
    expect(di.bind).toHaveBeenCalledWith('serviceKey', service)
  })

  it('binds both constant values and lazy services', () => {
    const service = jest.fn()
    const constantInjection: Injection = {
      key: 'constKey',
      value: true,
      use: 'value1'
    }
    const serviceInjection: Injection = {
      key: 'serviceKey',
      use: service
    }
    inject([constantInjection, serviceInjection])
    expect(di.bindConstantValue).toHaveBeenCalledWith('constKey', 'value1')
    expect(di.bind).toHaveBeenCalledWith('serviceKey', service)
  })
})
