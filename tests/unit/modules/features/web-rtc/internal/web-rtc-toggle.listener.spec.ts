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
import { WebRTCToggleListener } from '@/modules/features/web-rtc/internal/listeners/web-rtc-toggle.listener'
import { WebRTCInterface } from '@/modules/features/web-rtc/common/web-rtc.types'
import { WebRTCMessages, WebRTCToggleMessage } from '@/modules/features/web-rtc/common/web-rtc.messages'
import { Box } from '@/utils/dispatcher/dispatcher.types'

jest.mock('@/modules/features/web-rtc/internal/web-rtc.utils')

describe('WebRtcToggleListener', () => {
  let listener: WebRTCToggleListener
  const mockToggle = jest.fn()
  const service = {
    toggle: mockToggle
  } as unknown as WebRTCInterface
  beforeEach(() => {
    listener = new WebRTCToggleListener(service)
  })
  it('should be able to toggle web-RTC', async () => {
    expect(listener.on()).toBe(WebRTCMessages.toggle)
    expect(listener.main()).toBe(false)
    await listener.handle({ message: { type: WebRTCMessages.toggle, payload: { state: false } } } as Box<WebRTCToggleMessage>)
    expect(mockToggle).toHaveBeenCalledWith(false)
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })
})
