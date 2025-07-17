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
import { getActiveTabHelper } from '@/helpers/get-active-tab.helper'
import Tab = chrome.tabs.Tab

describe('getActiveTabHelper', () => {
  beforeEach(() => {
    global.chrome = {
      tabs: {
        query: jest.fn()
      }
    } as any
  })

  it('should return the active tab if available', async () => {
    const expectedTab = {
      id: 1,
      active: true
    } as Tab
    jest.mocked(chrome.tabs.query).mockResolvedValueOnce([expectedTab])
    const tab = await getActiveTabHelper()
    expect(tab).toEqual(expectedTab)
  })

  it('should return undefined when no active tab is found', async () => {
    jest.mocked(chrome.tabs.query).mockResolvedValueOnce([])
    const tab = await getActiveTabHelper()
    expect(tab).toBeUndefined()
  })
})
