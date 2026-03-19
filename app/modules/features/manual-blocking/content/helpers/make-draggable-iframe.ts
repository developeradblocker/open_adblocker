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
import { DragMessages } from '@/ui/manual-blocking/helpers/drag-n-drop.helper'

export interface DraggableIframeOptions {
  /** Right margin (px) */
  offsetRight?: number
  /** Initial top (px) */
  y?: number
  /** z-index while floating */
  z?: number
}

/**
 * Make an existing <iframe> draggable without injecting anything inside it.
 * Uses a temporary full-window transparent cover during drag.
 */
export function makeIframeDraggable (
  Iframe: HTMLIFrameElement,
  opts: DraggableIframeOptions = {}
): void {
  const {
    offsetRight = 40,
    y = 40,
    z = 9999
  } = opts

  // Ensure it's in the DOM
  if (!Iframe.isConnected) document.body.appendChild(Iframe)

  window.addEventListener('message', (event: MessageEvent) => {
    const message = event.data

    if (message.type === DragMessages.start) {
      onPointerDown(message.e)
    } else if (message.type === DragMessages.end) {
      onPointerUp()
    }
  })

  const leftMargin = window.innerWidth - Iframe.getBoundingClientRect().width - offsetRight
  // Base style
  Object.assign(Iframe.style, {
    position: 'fixed',
    left: `${leftMargin}px`,
    top: `${y}px`,
    margin: '0',
    zIndex: String(z),
    touchAction: 'none' // avoid UA panning on touch
  })

  let dragging = false
  let startDX = 0
  let startDY = 0
  let posX = offsetRight
  let posY = y
  let prevPE: string = Iframe.style.pointerEvents || ''
  let prevUserSelect: string = document.body.style.userSelect || ''
  let cover: HTMLDivElement | null = null

  const getRect = (): DOMRect => Iframe.getBoundingClientRect()
  const clamp = (v: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, v))

  const bounds = (): {
    minX: number
    minY: number
    maxX: number
    maxY: number
  } => {
    const r = getRect()
    const maxX = Math.max(0, window.innerWidth - r.width)
    const maxY = Math.max(0, window.innerHeight - r.height)
    return { minX: 0, minY: 0, maxX, maxY }
  }

  function onPointerDown (e: PointerEvent): void {
    if (e.button !== 0) return // primary button only

    const r = getRect()
    dragging = true

    startDX = e.clientX
    startDY = e.clientY
    posX = r.left
    posY = r.top

    // 1) stop iframe from swallowing events
    prevPE = Iframe.style.pointerEvents || ''
    Iframe.style.pointerEvents = 'none'

    // 2) add transparent cover to capture moves/ups
    cover = document.createElement('div')
    Object.assign(cover.style, {
      position: 'fixed',
      inset: '0',
      cursor: 'grabbing',
      background: 'transparent',
      zIndex: String(z + 1)
    })
    document.body.appendChild(cover)

    // avoid text selection during drag
    prevUserSelect = document.body.style.userSelect || ''
    document.body.style.userSelect = 'none'

    window.addEventListener('pointermove', onPointerMove, {
      passive: false
    })
    window.addEventListener('pointerup', onPointerUp, {
      passive: true
    })
  }

  function onPointerMove (e: PointerEvent): void {
    if (!dragging) return
    e.preventDefault() // prevent scroll on touch devices

    const nx = e.clientX - startDX
    const ny = e.clientY - startDY

    const { minX, minY, maxX, maxY } = bounds()

    posX = clamp(nx, minX, maxX)
    posY = clamp(ny, minY, maxY)

    Iframe.style.left = `${posX}px`
    Iframe.style.top = `${posY}px`
  }

  function cleanupDrag (): void {
    dragging = false
    Iframe.style.pointerEvents = prevPE
    document.body.style.userSelect = prevUserSelect

    if (cover) {
      cover.remove()
      cover = null
    }

    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  function onPointerUp (): void {
    if (!dragging) return
    cleanupDrag()
  }
}
