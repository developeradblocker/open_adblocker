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
import {
  onAdBlockerReady,
  onBlockedAd,
  onToggledAdBlocker
} from '@/modules/ad-blocker/internal/expose.messages'
import { AdBlockerMessages } from '@/modules/ad-blocker/common/ad-blocker.messages'
import { DispatcherInterface } from '@/utils/dispatcher/dispatcher.types'

jest.mock('@/utils/setup-worker', () => ({
  dispatcher: jest.fn()
}))

describe('expose.messages', () => {
  let onAfterMock: jest.Mock

  beforeEach(() => {
    onAfterMock = jest.fn()
    jest.mocked(dispatcher).mockReturnValue(
      { onAfter: onAfterMock } as unknown as DispatcherInterface
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should register onAdBlockerReady listener with correct message type', () => {
    const listener = jest.fn()
    onAdBlockerReady(listener)
    expect(onAfterMock).toHaveBeenCalledWith(AdBlockerMessages.ready, listener)
  })

  it('should register onBlockedAd listener with correct message type', () => {
    const listener = jest.fn()
    onBlockedAd(listener)
    expect(onAfterMock).toHaveBeenCalledWith(AdBlockerMessages.blockedAd, listener)
  })

  it('should register onToggledAdBlocker listener with correct message type', () => {
    const listener = jest.fn()
    onToggledAdBlocker(listener)
    expect(onAfterMock).toHaveBeenCalledWith(AdBlockerMessages.toggle, listener)
  })
})
