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
import { dispatcher } from '@/utils/setup-worker'
import { setupInternalFilters } from '@/modules/filters/internal/filters.setup'
import { InternalFiltersIdentifiers } from '@/modules/filters/internal/filters.types'
import { FiltersService } from '@/modules/filters/internal/service/filters.service'
import { FiltersStorage } from '@/modules/filters/internal/storage/filters.storage'
import { FilterToggleListener } from '@/modules/filters/internal/listeners/filter-toggle.listener'

jest.mock('@/utils/inject/inject')
jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))
jest.mock('@/modules/filters/internal/service/filters.service')
jest.mock('@/modules/filters/internal/storage/filters.storage')
jest.mock('@/modules/filters/internal/listeners/filter-toggle.listener')
jest.mock('@/modules/settings/internal/storage/metadata.storage')
jest.mock('@/modules/settings/internal/service/metadata.service')

const mockedInject = jest.mocked(inject)
const mockedDispatcher = jest.mocked(dispatcher)
const mockDispatcherInstance = {
  onWithClass: jest.fn()
}

beforeEach(() => {
  jest.clearAllMocks()
  mockedDispatcher.mockReturnValue(mockDispatcherInstance as any)
})

describe('setupInternalFilters', () => {
  it('should add injections and listeners', () => {
    setupInternalFilters()
    expect(mockedInject).toHaveBeenCalledWith([
      {
        key: InternalFiltersIdentifiers.filters,
        use: FiltersService
      },
      {
        key: InternalFiltersIdentifiers._filterStorage,
        use: FiltersStorage
      }
    ])
    expect(mockDispatcherInstance.onWithClass).toHaveBeenCalledWith(FilterToggleListener)
  })
})
