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
import { DragMessages, finishDragging, startDragging } from '@/ui/manual-blocking/helpers/drag-n-drop.helper'

describe('drag-n-drop.helper', () => {
  let postMessageSpy: jest.SpyInstance
  beforeEach(() => {
    postMessageSpy = jest.spyOn(window.parent, 'postMessage').mockImplementation(() => undefined)
  })

  afterEach(() => {
    postMessageSpy.mockRestore()
  })

  it('sends a drag-start message with cursor data', () => {
    const mockEvent = {
      preventDefault: jest.fn(),
      button: 1,
      clientX: 10,
      clientY: 20
    } as unknown as MouseEvent

    startDragging(mockEvent)

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(postMessageSpy).toHaveBeenCalledWith({
      type: DragMessages.start,
      e: {
        button: 1,
        clientX: 10,
        clientY: 20
      }
    }, '*')
  })

  it('sends a drag-end message on finish', () => {
    finishDragging()
    expect(postMessageSpy).toHaveBeenCalledWith({
      type: DragMessages.end
    }, '*')
  })
})
