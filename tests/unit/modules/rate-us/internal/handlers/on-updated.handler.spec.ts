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
import { rateUsService } from '@/modules/rate-us/internal/utils'
import { onUpdatedHandler } from '@/modules/rate-us/internal/handlers/on-updated.handler'
import { DataAccessorInterface } from '@/utils/storage/storage.types'
import { InternalRateUsServiceInterface, RateUsDataInterface } from '@/modules/rate-us/internal/rate-us.types'
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'

jest.mock('@/modules/rate-us/internal/utils')
jest.mock('@/utils/storage/make-data-accessor')

describe('onUpdatedHandler', () => {
  const visitMock = jest.fn()
  const rateMock = jest.fn()
  const removeMock = jest.fn()
  const readMock = jest.fn()
  let dataAccessorMock: DataAccessorInterface<RateUsDataInterface>

  beforeEach(() => {
    global.chrome = {
      storage: {
        local: {
          remove: removeMock
        }
      },
      alarms: {
        create: jest.fn()
      }
    } as any
    dataAccessorMock = {
      read: readMock
    } as unknown as DataAccessorInterface<RateUsDataInterface>
    jest.mocked(makeDataAccessor).mockReturnValue(dataAccessorMock)
    jest.mocked(rateUsService).mockReturnValue({ visit: visitMock, rate: rateMock } as unknown as InternalRateUsServiceInterface)
  })
  it('should be able to migrate "1.2.0"', async () => {
    readMock.mockResolvedValueOnce({ lastVisited: Date.now() })
    await onUpdatedHandler({ reason: 'install', previousVersion: '1.1.0' })
    expect(visitMock).not.toHaveBeenCalled()
    expect(rateMock).not.toHaveBeenCalled()
    await onUpdatedHandler({ reason: 'update', previousVersion: '1.1.0' })
    expect(visitMock).toHaveBeenCalledTimes(1)
    expect(rateMock).toHaveBeenCalledTimes(1)
  })
})
