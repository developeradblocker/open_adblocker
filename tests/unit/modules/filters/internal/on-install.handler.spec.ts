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
import { onInstallHandler } from '@/modules/filters/internal/handlers/on-install.handler'
import { di } from '@/utils/setup-worker'
import { InternalFiltersIdentifiers, MetadataServiceInterface } from '@/modules/filters/internal/filters.types'

jest.mock('@/utils/setup-worker', () => ({
  di: {
    get: jest.fn()
  }
}))

describe('onInstallHandler', () => {
  const mockUpdateMetadata = jest.fn()
  const mockMetadataService: MetadataServiceInterface = {
    updateMetadata: mockUpdateMetadata,
    getMetadata: jest.fn(),
    getGroups: jest.fn(),
    getFilters: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(di.get).mockReturnValue(mockMetadataService)
  })

  it('should call updateMetadata on metadata service', async () => {
    mockUpdateMetadata.mockResolvedValue(undefined)

    await onInstallHandler()

    expect(di.get).toHaveBeenCalledWith(InternalFiltersIdentifiers.metadata)
    expect(mockUpdateMetadata).toHaveBeenCalledTimes(1)
  })

  it('should handle updateMetadata errors', async () => {
    const error = new Error('Update failed')
    mockUpdateMetadata.mockRejectedValue(error)

    await expect(onInstallHandler()).rejects.toThrow('Update failed')
    expect(mockUpdateMetadata).toHaveBeenCalledTimes(1)
  })

  it('should get metadata service from DI container', async () => {
    mockUpdateMetadata.mockResolvedValue(undefined)

    await onInstallHandler()

    expect(di.get).toHaveBeenCalledWith(InternalFiltersIdentifiers.metadata)
  })
})
