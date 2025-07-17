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
import { InternalRateUsServiceInterface, RateUsIdentifiers } from '@/modules/rate-us/internal/rate-us.types'
import { CounterInterface } from '@/utils/counter/counter.types'
import { di } from '@/utils/setup-worker'

/**
 * Get the instance of InternalRateUsServiceInterface
 *
 * @throws {DiException} if the rateUsService is called before the worker is set up
 * @returns {InternalRateUsServiceInterface}
 */
export const rateUsService = (): InternalRateUsServiceInterface => {
  return di.get<InternalRateUsServiceInterface>(RateUsIdentifiers.rateUsService)
}

/**
 * Get the instance of CounterInterface
 *
 * @throws {DiException} if the rateUsCounter is called before the worker is set up
 * @returns {CounterInterface}
 */
export const rateUsCounter = (): CounterInterface => {
  return di.get<CounterInterface>(RateUsIdentifiers._counter)
}
