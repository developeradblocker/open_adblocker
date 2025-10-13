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
import { WebRTCService } from '@/modules/features/web-rtc/internal/services/web-rtc.service'

import { logger } from '@/utils/logger/logger'
import { checkWebRTCPermissions } from '@/modules/features/web-rtc/common/web-rtc.utils'
import { dispatcher } from '@/utils/setup-worker'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'
import { WebRTCMessages } from '@/modules/features/web-rtc/common/web-rtc.messages'
jest.mock('@/utils/logger/logger')
jest.mock('@/modules/features/web-rtc/common/web-rtc.utils')
jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))

describe('WebRTCService', () => {
  let service: WebRTCService
  let sendMessageMock: jest.Mock

  const getMock = jest.fn()
  const setMock = jest.fn()

  beforeEach(() => {
    sendMessageMock = jest.fn()
    jest.mocked(dispatcher).mockReturnValue(
      { sendMessage: sendMessageMock } as unknown as DispatcherInterface
    )
    global.chrome = {
      privacy: {
        IPHandlingPolicy: {
          DISABLE_NON_PROXIED_UDP: 'disable_non_proxied_udp',
          DEFAULT: 'default'
        },
        network: {
          webRTCIPHandlingPolicy: {
            get: getMock,
            set: setMock
          }
        }
      }
    } as any
    service = new WebRTCService()
  })

  it('should be able to toggle', async () => {
    await service.toggle(false)
    expect(setMock).toHaveBeenLastCalledWith({ value: 'default' })
    expect(logger.warn).not.toHaveBeenCalled()
    expect(sendMessageMock).toHaveBeenLastCalledWith({
      type: WebRTCMessages.stateChanged,
      payload: {
        state: false
      }
    })
    await service.toggle(true)
    expect(setMock).toHaveBeenLastCalledWith({ value: 'disable_non_proxied_udp' })
    expect(logger.warn).not.toHaveBeenCalled()
    expect(sendMessageMock).toHaveBeenLastCalledWith({
      type: WebRTCMessages.stateChanged,
      payload: {
        state: true
      }
    })
    setMock.mockRejectedValue('Testing')
    await service.toggle(true)
    expect(logger.warn).toHaveBeenLastCalledWith('WebRTCLeakPrevention: An error has occurred during setting the policy', 'Testing')
    expect(sendMessageMock).toHaveBeenCalledTimes(2)
  })

  it('should be able to get state', async () => {
    expect(await service.getState()).toBe(false)
    jest.mocked(checkWebRTCPermissions).mockResolvedValue(true)
    getMock.mockResolvedValue({ value: 'disable_non_proxied_udp' })
    expect(await service.getState()).toBe(true)
  })
})
