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
import { internalSendMessage } from '@/utils/dispatcher/internal-send-message'
import { dispatcher } from '@/utils/setup-worker'
import { Dispatcher } from '@/utils/dispatcher/dispatcher'

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))

describe('internalSendMessage', () => {
  const sendMessageMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    const mockedDispatcher = {
      sendMessage: sendMessageMock
    } as unknown as Dispatcher
    jest.mocked(dispatcher).mockImplementation(() => mockedDispatcher)
  })

  it('sends a message and resolves with the correct return value', async () => {
    const message = { type: 'testMessage' }
    sendMessageMock.mockResolvedValue('result')

    const result = await internalSendMessage<string>(message)

    expect(result).toBe('result')
    expect(sendMessageMock).toHaveBeenCalledWith(message)
  })

  it('returns undefined if no main listener is registered', async () => {
    const message = { type: 'unregisteredMessage' }
    sendMessageMock.mockResolvedValue(undefined)

    const result = await internalSendMessage<string | undefined>(message)

    expect(result).toBeUndefined()
    expect(sendMessageMock).toHaveBeenCalledWith(message)
  })

  it('throws an error if the dispatcher fails to send the message', async () => {
    const message = { type: 'errorMessage' }
    sendMessageMock.mockRejectedValue(new Error('Dispatcher error'))

    await expect(internalSendMessage<string>(message)).rejects.toThrow('Dispatcher error')
    expect(sendMessageMock).toHaveBeenCalledWith(message)
  })
})
