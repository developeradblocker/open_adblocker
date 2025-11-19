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
import { MANUAL_BLOCKING_IFRAME_ID } from '@/modules/features/manual-blocking/common/constants'

export enum DragMessages {
  start= `${MANUAL_BLOCKING_IFRAME_ID}__DRAG_START`,
  end = `${MANUAL_BLOCKING_IFRAME_ID}__DRAG_END`,
}

export const startDragging = (e: MouseEvent): void => {
  e.preventDefault()
  window.parent.postMessage({
    type: DragMessages.start,
    e: {
      button: e.button,
      clientX: e.clientX,
      clientY: e.clientY
    }
  }, '*')
}

export const finishDragging = (): void => {
  window.parent.postMessage({
    type: DragMessages.end
  }, '*')
}
