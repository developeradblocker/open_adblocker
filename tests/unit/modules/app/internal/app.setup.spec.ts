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
import { dispatcher } from '@/utils/setup-worker'
import { setupInternalApp, handleOnAppReady } from '@/modules/app/internal/app.setup'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'
import { onHandledAllRequiredMessages } from '@/utils/on-handled-all-required-messages'
import { requiredMessages } from '@/service_worker/required-messages'

jest.mock('@/modules/app/internal/listeners/get-state.listener', () => ({
  GetStateListener: jest.fn()
}))

jest.mock('@/utils/on-handled-all-required-messages', () => ({
  onHandledAllRequiredMessages: jest.fn()
}))

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn(),
  di: {
    bindConstantValue: jest.fn(),
    resolve: jest.fn().mockReturnValue(jest.fn())
  }
}))

describe('setupInternalApp', () => {
  const onWithClassMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    const mockedDispatcher = {
      onWithClass: onWithClassMock
    } as unknown as DispatcherInterface
    jest.mocked(dispatcher).mockImplementation(() => mockedDispatcher)
  })

  it('registers GetStateListener with the dispatcher', () => {
    setupInternalApp()
    expect(onHandledAllRequiredMessages).toHaveBeenCalledTimes(1)
    expect(onHandledAllRequiredMessages).toHaveBeenCalledWith(requiredMessages, handleOnAppReady)
  })

  it.todo('write tests for "handleOnAppReady"')
})
