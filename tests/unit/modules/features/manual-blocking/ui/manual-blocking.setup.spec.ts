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
import {
  setupUIManualBlocking,
  useUIManualBlocking
} from '@/modules/features/manual-blocking/ui/manual-blocking.setup'
import { inject } from '@/utils/inject/inject'
import { dispatcher, di } from '@/utils/setup-worker'
import {
  UIManualBlockingIdentifiers
} from '@/modules/features/manual-blocking/ui/manual-blocking.types'
import { ManualBlockingService } from '@/modules/features/manual-blocking/ui/services/manual-blocking.service'
import { ElementSelectedListener } from '@/modules/features/manual-blocking/ui/listeners/element-selected.listener'
import { AddRuleListener } from '@/modules/features/manual-blocking/ui/listeners/add-rule.listener'

jest.mock('@/utils/inject/inject', () => ({
  inject: jest.fn()
}))

jest.mock('@/utils/setup-worker', () => ({
  di: {
    get: jest.fn()
  },
  dispatcher: jest.fn()
}))

describe('setupUIManualBlocking', () => {
  const onWithClassMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    onWithClassMock.mockClear()
    jest.mocked(dispatcher).mockReturnValue({
      onWithClass: onWithClassMock
    } as any)
  })

  it('injects the UI manual blocking service and registers listeners', () => {
    setupUIManualBlocking()

    expect(inject).toHaveBeenCalledWith([
      {
        key: UIManualBlockingIdentifiers.service,
        use: ManualBlockingService
      }
    ])

    expect(onWithClassMock).toHaveBeenCalledWith(ElementSelectedListener)
    expect(onWithClassMock).toHaveBeenCalledWith(AddRuleListener)
  })
})

describe('useUIManualBlocking', () => {
  it('returns service from DI container', () => {
    const service = {} as any
    jest.mocked(di.get).mockReturnValue(service)

    expect(useUIManualBlocking()).toBe(service)
    expect(di.get).toHaveBeenCalledWith(UIManualBlockingIdentifiers.service)
  })
})
