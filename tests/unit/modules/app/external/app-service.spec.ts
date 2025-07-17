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
import { useAppService } from '@/modules/app/external/app.service'
import { AppMessages } from '@/modules/app/common/app.messages'
import { useExternalPort } from '@/modules/port/external/port.setup'
import { ExternalPortChannel } from '@/modules/port/external/port.types'

jest.mock('@/modules/port/external/port.setup', () => ({
  useExternalPort: jest.fn()
}))

describe('useAppService', () => {
  const sendMessageMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    const mockedPort = {
      sendMessage: sendMessageMock
    } as unknown as ExternalPortChannel
    jest.mocked(useExternalPort).mockImplementation(() => mockedPort)
  })

  it('returns the app state when getState is called', async () => {
    const mockAppState = { someKey: 'someValue' }
    sendMessageMock.mockResolvedValue(mockAppState)

    const appService = useAppService()
    const result = await appService.getState()

    expect(result).toEqual(mockAppState)

    expect(sendMessageMock).toHaveBeenCalledWith({
      type: AppMessages.getState
    })
  })

  it('throws an error if sendMessage rejects', async () => {
    const mockError = new Error('Failed to get state')
    sendMessageMock.mockRejectedValue(mockError)

    const appService = useAppService()

    await expect(appService.getState()).rejects.toThrow('Failed to get state')
    expect(sendMessageMock).toHaveBeenCalledWith({
      type: AppMessages.getState
    })
  })
})
