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

import { setupInternalWhitelist } from '@/modules/whitelist/internal/whitelist.setup'
import { inject } from '@/utils/inject/inject'
import { WhitelistIdentifiers } from '@/modules/whitelist/internal/whitelist.types'
import { InternalWhitelistService } from '@/modules/whitelist/internal/whitelist.service'
import { dispatcher } from '@/utils/setup-worker'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'
import { WhitelistSaveListener } from '@/modules/whitelist/internal/listeners/save.listener'
import { WhitelistExportListener } from '@/modules/whitelist/internal/listeners/export.listener'

jest.mock('@/utils/inject/inject', () => ({
  inject: jest.fn()
}))

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))

describe('setupInternalWhitelist', () => {
  const onMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(dispatcher).mockReturnValue({
      onWithClass: onMock
    } as unknown as DispatcherInterface)
  })

  it('should call inject with correct injections', () => {
    setupInternalWhitelist()
    expect(inject).toHaveBeenCalledWith([
      {
        key: WhitelistIdentifiers.service,
        use: InternalWhitelistService
      }
    ])
    expect(dispatcher().onWithClass).toHaveBeenCalledTimes(2)
    expect(dispatcher().onWithClass).toHaveBeenCalledWith(WhitelistSaveListener)
    expect(dispatcher().onWithClass).toHaveBeenCalledWith(WhitelistExportListener)
  })
})
