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
import { type CounterInterface } from '@/utils/counter/counter.types'
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'
import { RATE_US_HOME_PAGE_VISITED_THRESHOLD } from '@/modules/rate-us/constants'
import { DataAccessorInterface } from '@/utils/storage/storage.types'
import { InternalRateUsService } from '@/modules/rate-us/internal/services/rate-us.service'
import { dayToMs } from '@/helpers/time/day-to-ms'
import { ConfigServiceInterface } from '@/modules/config/internal/config.types'
import { DEFAULT_CONFIG } from '@/modules/config/common/config.constants'

jest.mock('@/utils/storage/make-data-accessor')

describe('InternalRateUsService', () => {
  let counterMock: CounterInterface
  let storageMock: DataAccessorInterface<unknown>
  let service: InternalRateUsService
  let configService: ConfigServiceInterface

  const existsMock = jest.fn()
  beforeEach(() => {
    counterMock = {
      get: jest.fn(),
      increase: jest.fn()
    } as unknown as CounterInterface
    storageMock = {
      read: jest.fn(),
      write: jest.fn(),
      exists: existsMock
    } as unknown as DataAccessorInterface<unknown>
    configService = {
      get: jest.fn().mockResolvedValue(DEFAULT_CONFIG)
    } as unknown as ConfigServiceInterface
    jest.mocked(makeDataAccessor).mockReturnValue(storageMock)
    service = new InternalRateUsService(counterMock, configService)
  })

  it('returns false if RATE_US_DATA was not settled', async () => {
    const result = await service.needVisit()
    expect(result).toBe(false)
  })

  it('returns true if RATE_US_DATA was not settled and threshold is met', async () => {
    jest.mocked(counterMock.get).mockResolvedValue(RATE_US_HOME_PAGE_VISITED_THRESHOLD)
    const result = await service.needVisit()
    expect(result).toBe(true)
  })

  it('returns false if RATE_US_DATA was not settled and threshold is not met', async () => {
    jest.mocked(counterMock.get).mockResolvedValue(RATE_US_HOME_PAGE_VISITED_THRESHOLD - 1)
    const result = await service.needVisit()
    expect(result).toBe(false)
  })

  it('writes true to storage when visit is called', async () => {
    await service.visit()
    expect(storageMock.write).toHaveBeenCalledWith({ lastVisited: expect.any(Number) })
  })

  it('should return false if was already rated', async () => {
    existsMock.mockResolvedValue(true)
    jest.mocked(storageMock.read).mockResolvedValue({ rated: true })
    expect(await service.needVisit()).toBe(false)
  })

  it('should return true if was not rated yet and last visited more than 7 days', async () => {
    existsMock.mockResolvedValue(true)
    jest.mocked(storageMock.read).mockResolvedValue({ rated: false, lastVisited: Date.now() - dayToMs(8) })
    expect(await service.needVisit()).toBe(true)
  })

  it('should be able to sate rating', async () => {
    jest.mocked(storageMock.read).mockResolvedValue({})
    await service.rate()
    expect(storageMock.write).toHaveBeenCalledWith({ rated: true })
  })
})
