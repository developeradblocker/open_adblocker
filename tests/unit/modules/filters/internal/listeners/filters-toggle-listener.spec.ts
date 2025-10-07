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
import { Box } from '@/utils/dispatcher/dispatcher.types'
import { FiltersServiceInterface } from '@/modules/filters/internal/filters.types'
import { FiltersToggleListener } from '@/modules/filters/internal/listeners/filters-toggle.listener'
import { FiltersMessages, ToggleFilterMessage } from '@/modules/filters/common/filters.messages'

jest.mock('@/modules/ad-blocker/internal/ad-blocker.setup', () => ({
  useInternalAdBlocker: jest.fn()
}))

jest.mock('@/helpers/get-active-tab.helper', () => ({
  getActiveTabHelper: jest.fn()
}))

jest.mock('@/modules/ad-blocker/internal/utils', () => ({
  counterByTab: jest.fn()
}))

describe('FiltersrToggleListener', () => {
  let listener: FiltersToggleListener

  const filterId = 12
  const toggleMock = jest.fn()
  const filtersService = {
    toggle: toggleMock
  } as unknown as FiltersServiceInterface

  beforeEach(() => {
    listener = new FiltersToggleListener(filtersService)
  })

  it('returns the correct message type on "on" method', () => {
    expect(listener.on()).toBe(FiltersMessages.toggle)
  })

  it('returns false on "main" method', () => {
    expect(listener.main()).toBe(false)
  })

  it('calls toggle with the correct payload when handle is invoked', async () => {
    const message: ToggleFilterMessage = {
      type: FiltersMessages.toggle,
      payload: {
        id: filterId
      }
    }
    await listener.handle({ message } as Box<ToggleFilterMessage>)
    expect(toggleMock).toHaveBeenCalledWith(filterId)
  })
})
