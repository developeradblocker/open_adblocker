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
  setupInternalManualBlocking,
  useInternalManualBlocking
} from '@/modules/features/manual-blocking/internal/manual-blocking.setup'
import { inject } from '@/utils/inject/inject'
import { dispatcher, di } from '@/utils/setup-worker'
import {
  InternalManualBlockingIdentifiers
} from '@/modules/features/manual-blocking/internal/manual-blocking.types'
import { ManualBlockingService } from '@/modules/features/manual-blocking/internal/services/manual-blocking.service'
import { UserRulesStorage } from '@/modules/features/manual-blocking/internal/storage/user-rules.storage'
import { TriggerStartManualBlockingListener } from '@/modules/features/manual-blocking/internal/listeners/trigger-start.listener'
import { AddRuleListener } from '@/modules/features/manual-blocking/internal/listeners/add-rule.listener'
import { ResetRulesListener } from '@/modules/features/manual-blocking/internal/listeners/reset-rules.listener'
import { SaveListener } from '@/modules/features/manual-blocking/internal/listeners/save.listener'

jest.mock('@/utils/inject/inject', () => ({
  inject: jest.fn()
}))

jest.mock('@/utils/setup-worker', () => ({
  di: {
    get: jest.fn()
  },
  dispatcher: jest.fn()
}))

describe('setupInternalManualBlocking', () => {
  const onWithClassMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    onWithClassMock.mockClear()
    jest.mocked(dispatcher).mockReturnValue({
      onWithClass: onWithClassMock
    } as any)
  })

  it('registers injections and listeners', () => {
    setupInternalManualBlocking()

    expect(inject).toHaveBeenCalledWith([
      {
        key: InternalManualBlockingIdentifiers.service,
        use: ManualBlockingService
      },
      {
        key: InternalManualBlockingIdentifiers._storage,
        use: UserRulesStorage
      }
    ])

    expect(onWithClassMock).toHaveBeenCalledWith(TriggerStartManualBlockingListener)
    expect(onWithClassMock).toHaveBeenCalledWith(AddRuleListener)
    expect(onWithClassMock).toHaveBeenCalledWith(ResetRulesListener)
    expect(onWithClassMock).toHaveBeenCalledWith(SaveListener)
  })
})

describe('useInternalManualBlocking', () => {
  it('returns service from DI container', () => {
    const service = {} as any
    jest.mocked(di.get).mockReturnValue(service)

    expect(useInternalManualBlocking()).toBe(service)
    expect(di.get).toHaveBeenCalledWith(InternalManualBlockingIdentifiers.service)
  })
})
