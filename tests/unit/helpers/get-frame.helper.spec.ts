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
import { getFrameUrlHelper } from '@/helpers/get-frame.helper'
import GetFrameResultDetails = chrome.webNavigation.GetFrameResultDetails

describe('getFrameUrlHelper', () => {
  beforeEach(() => {
    global.chrome = {
      webNavigation: {
        getFrame: jest.fn()
      }
    } as any
  })

  it('should return the frame URL when frame is found', async () => {
    const expectedUrl = 'https://example.com'
    const frame = { url: expectedUrl } as GetFrameResultDetails
    jest.mocked(chrome.webNavigation.getFrame).mockResolvedValueOnce(frame)

    const result = await getFrameUrlHelper(1, 2)
    expect(result).toBe(expectedUrl)
    const expectedResult = {
      tabId: 1,
      frameId: 2
    }
    expect(chrome.webNavigation.getFrame).toHaveBeenCalledWith(expectedResult)
  })

  it('should return undefined when no frame is found', async () => {
    jest.mocked(chrome.webNavigation.getFrame).mockResolvedValueOnce(undefined)
    const result = await getFrameUrlHelper(3, 4)
    expect(result).toBeUndefined()
    const expectedResult = {
      tabId: 3,
      frameId: 4
    }
    expect(chrome.webNavigation.getFrame).toHaveBeenCalledWith(expectedResult)
  })
})
