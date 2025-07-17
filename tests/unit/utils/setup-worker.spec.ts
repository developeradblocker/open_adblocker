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
import { UtilsIdentifiers } from '@/utils/utils-Identifiers'
import { Di } from '@/utils/di/di'
import { logger } from '@/utils/logger/logger'
import MockedObject = jest.MockedObject

jest.mock('@/utils/logger/logger', () => ({
  logger: {
    setWorkerName: jest.fn(),
    setLogging: jest.fn()
  }
}))
jest.mock('@/utils/di/di', () => ({
  Di: jest.fn()
}))

describe('setupWorker', () => {
  const bindConstantValueMock = jest.fn()
  const resolveMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    const mockedDi = {
      bindConstantValue: bindConstantValueMock,
      resolve: resolveMock,
      get: jest.fn()
    } as unknown as MockedObject<Di>
    jest.mocked(Di).mockImplementation(() => mockedDi)
    jest.mocked(logger.setWorkerName).mockImplementation(() => logger)
  })

  it('binds constants to the DI container and sets the worker name', () => {
    jest.isolateModules(() => {
      const { setupWorker, di } = require('@/utils/setup-worker')
      const name = 'Worker1'
      const dispatcherInstance = {}
      resolveMock.mockReturnValue(dispatcherInstance)

      setupWorker(name)

      expect(bindConstantValueMock).toHaveBeenNthCalledWith(1, UtilsIdentifiers.di, di)
      expect(bindConstantValueMock).toHaveBeenNthCalledWith(2, UtilsIdentifiers.worker, name)
      expect(bindConstantValueMock).toHaveBeenNthCalledWith(3, UtilsIdentifiers.logger, logger)
      expect(logger.setWorkerName).toHaveBeenCalledWith(name)
      expect(bindConstantValueMock).toHaveBeenNthCalledWith(4, UtilsIdentifiers.dispatcher, dispatcherInstance)
    })
  })
})

describe('dispatcher', () => {
  const getMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    const mockedDi = {
      get: getMock
    } as unknown as MockedObject<Di>
    jest.mocked(Di).mockImplementation(() => mockedDi)
  })

  it('returns the dispatcher instance from the DI container', () => {
    jest.isolateModules(() => {
      const { dispatcher } = require('@/utils/setup-worker')
      const dispatcherInstance = {}
      getMock.mockReturnValue(dispatcherInstance)

      const result = dispatcher()

      expect(result).toBe(dispatcherInstance)
      expect(getMock).toHaveBeenCalledWith(UtilsIdentifiers.dispatcher)
    })
  })

  it('throws an error if the dispatcher is called before setup', () => {
    jest.isolateModules(() => {
      const { dispatcher } = require('@/utils/setup-worker')
      getMock.mockImplementation(() => {
        throw new Error('DiException')
      })

      expect(() => dispatcher()).toThrow('DiException')
    })
  })
})
