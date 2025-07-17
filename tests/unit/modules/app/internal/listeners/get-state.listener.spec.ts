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
import { GetStateListener } from '@/modules/app/internal/listeners/get-state.listener'
import { AppMessages } from '@/modules/app/common/app.messages'
import { InternalAppServiceInterface } from '../../../../../../app/modules/app/internal/app.types'
import { AppState } from '../../../../../../app/modules/app/common/app.types'

describe('GetStateListener', () => {
  let listener: GetStateListener
  const getStateMock = jest.fn()
  const service = {
    getState: getStateMock
  } as unknown as InternalAppServiceInterface

  const appState: AppState = {
    isPaused: false,
    totalBlocked: 12,
    blockedByTab: 2,
    isServicePage: false,
    needVisitRateUs: true
  }

  beforeEach(() => {
    listener = new GetStateListener(service)
    // @ts-ignore
    getStateMock.mockResolvedValue(appState)
  })

  it('returns the correct message type on "on" method', () => {
    expect(listener.on()).toBe(AppMessages.getState)
  })

  it('returns true on "main" method', () => {
    expect(listener.main()).toBe(true)
  })

  it('returns the correct app state when handle is called', async () => {
    const result = await listener.handle()

    expect(result).toEqual(appState)
  })
})
