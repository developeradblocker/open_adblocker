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
import { IframeManager } from '@/modules/features/manual-blocking/content/services/iframe.manager'
import {
  type ContentManualBlockingOptions
} from '@/modules/features/manual-blocking/content/manual-blocking.types'
import { MANUAL_BLOCKING_IFRAME_ID } from '@/modules/features/manual-blocking/common/constants'
import { makeIframeDraggable } from '@/modules/features/manual-blocking/content/helpers/make-draggable-iframe'

jest.mock('@/modules/features/manual-blocking/content/helpers/make-draggable-iframe', () => ({
  makeIframeDraggable: jest.fn()
}))

describe('IframeManager', () => {
  const options: ContentManualBlockingOptions = {
    iframe: {
      url: 'manual-blocking.html',
      style: {
        width: '320px',
        height: '480px'
      }
    }
  }
  let manager: IframeManager

  beforeEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
    global.chrome = {
      runtime: {
        getURL: jest.fn().mockImplementation((path: string) => `chrome-extension://${path}`)
      }
    } as any
    manager = new IframeManager(options)
  })

  it('creates iframe once, applies styles, sets src, and makes it draggable', async () => {
    const rules = ['example##.ad']
    const promise = manager.start(rules, 'session-id')
    const iframe = (manager as any).iframe as HTMLIFrameElement
    expect(iframe).toBeInstanceOf(HTMLIFrameElement)

    iframe.onload?.(new Event('load'))
    await promise

    expect(iframe.id).toBe(MANUAL_BLOCKING_IFRAME_ID)
    expect(iframe.style.width).toBe('320px')
    expect(iframe.style.height).toBe('480px')
    expect(chrome.runtime.getURL).toHaveBeenCalledWith('manual-blocking.html?payload=%7B%22appliedRules%22%3A%5B%22example%23%23.ad%22%5D%2C%22sessionId%22%3A%22session-id%22%2C%22currentDomain%22%3A%22localhost%22%7D')
    expect(makeIframeDraggable).toHaveBeenCalledWith(iframe, { offsetRight: 16, y: 16, z: 9999999999 })

    // second call should be ignored because iframe already exists
    await manager.start([], 'session-id')
    expect(chrome.runtime.getURL).toHaveBeenCalledTimes(1)
  })

  it('removes iframe on stop', async () => {
    const promise = manager.start([], 'session-id')
    const iframe = (manager as any).iframe as HTMLIFrameElement
    iframe.onload?.(new Event('load'))
    await promise

    await manager.stop()
    expect(document.getElementById(MANUAL_BLOCKING_IFRAME_ID)).toBeNull()
    expect((manager as any).iframe).toBeUndefined()
  })
})
