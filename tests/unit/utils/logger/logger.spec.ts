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
import { LoggerInterface } from '@/utils/logger/logger.types'
import { Logger } from '@/utils/logger/logger'

describe('Logger', () => {
  let logger: LoggerInterface
  let mockConsole: { [key: string]: jest.Mock }

  beforeEach(() => {
    mockConsole = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      group: jest.fn(),
      groupCollapsed: jest.fn(),
      groupEnd: jest.fn()
    }
    global.console = mockConsole as any
    logger = new Logger()
    logger
      .setWorkerName('Worker1')
      .setLogging(true)
  })

  it('logs info messages with worker name prefix', () => {
    logger.info('Info message', { key: 'value' })

    expect(mockConsole.info).toHaveBeenCalledWith('[Worker1] Info message', { key: 'value' })
  })

  it('logs warning messages with worker name prefix', () => {
    logger.warn('Warning message')

    expect(mockConsole.warn).toHaveBeenCalledWith('[Worker1] Warning message')
  })

  it('logs error messages with worker name prefix', () => {
    logger.error('Error message')

    expect(mockConsole.error).toHaveBeenCalledWith('[Worker1] Error message')
  })

  it('starts a group with worker name prefix', () => {
    logger.group('Group label')

    expect(mockConsole.group).toHaveBeenCalledWith('[Worker1] Group label')
  })

  it('starts a collapsed group with worker name prefix', () => {
    logger.groupCollapsed('Collapsed group label')

    expect(mockConsole.groupCollapsed).toHaveBeenCalledWith('[Worker1] Collapsed group label')
  })

  it('ends a group and decrements collapse counter', () => {
    logger.group('Group label')
    logger.groupEnd()

    expect(mockConsole.groupEnd).toHaveBeenCalled()
  })

  it('logs messages without worker name prefix when collapse counter is greater than zero', () => {
    logger.groupCollapsed('Collapsed group label')
    logger.info('Info message inside group')

    expect(mockConsole.info).toHaveBeenCalledWith('Info message inside group')
  })

  it('sets the worker name correctly', () => {
    logger.setWorkerName('NewWorker')

    logger.info('Message')
    expect(mockConsole.info).toHaveBeenCalledWith('[NewWorker] Message')
  })
})
