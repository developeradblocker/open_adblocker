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
import { ManualBlockingService } from '@/modules/features/manual-blocking/external/services/manual-blocking.service'
import {
  ManualBlockingMessages
} from '@/modules/features/manual-blocking/common/manual-blocking.messages'
import { useExternalPort } from '@/modules/port/external/port.setup'
import {
  setupExternalManualBlocking,
  useExternalManualBlocking
} from '@/modules/features/manual-blocking/external/manual-blocking.setup'
import { inject } from '@/utils/inject/inject'
import { di } from '@/utils/setup-worker'
import {
  ExternalManualBlockingIdentifiers
} from '@/modules/features/manual-blocking/external/manual-blocking.types'

jest.mock('@/modules/port/external/port.setup', () => ({
  useExternalPort: jest.fn()
}))

jest.mock('@/utils/inject/inject', () => ({
  inject: jest.fn()
}))

jest.mock('@/utils/setup-worker', () => ({
  di: {
    get: jest.fn()
  }
}))

describe('ManualBlockingService (external)', () => {
  const port = {
    sendMessage: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    port.sendMessage.mockResolvedValue(true)
    jest.mocked(useExternalPort).mockReturnValue(port as any)
    global.close = jest.fn()
  })

  it('triggerStart sends message and closes the popup window', async () => {
    const service = new ManualBlockingService()

    await service.triggerStart()

    expect(port.sendMessage).toHaveBeenCalledWith({ type: ManualBlockingMessages.triggerStart })
    expect(global.close).toHaveBeenCalledTimes(1)
  })

  it('import forwards rules through the port', async () => {
    const service = new ManualBlockingService()

    const result = await service.save(['rule'])

    expect(port.sendMessage).toHaveBeenCalledWith({
      type: ManualBlockingMessages.save,
      payload: {
        userRules: ['rule'],
        override: true
      }
    })
    expect(result).toBe(true)
  })
})

describe('setupExternalManualBlocking', () => {
  it('registers the external manual blocking service', () => {
    setupExternalManualBlocking()

    expect(inject).toHaveBeenCalledWith([
      {
        key: ExternalManualBlockingIdentifiers.service,
        use: ManualBlockingService
      }
    ])
  })
})

describe('useExternalManualBlocking', () => {
  it('returns the service from DI container', () => {
    const service = {} as any
    jest.mocked(di.get).mockReturnValue(service)

    expect(useExternalManualBlocking()).toBe(service)
    expect(di.get).toHaveBeenCalledWith(ExternalManualBlockingIdentifiers.service)
  })
})
