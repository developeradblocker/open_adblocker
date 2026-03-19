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
import { inject, injectable } from '@/utils/di/di.types'
import {
  ContentManualBlockingIdentifiers,
  ContentManualBlockingOptions
} from '@/modules/features/manual-blocking/content/manual-blocking.types'
import { makeIframeDraggable } from '@/modules/features/manual-blocking/content/helpers/make-draggable-iframe'
import { MANUAL_BLOCKING_IFRAME_ID } from '@/modules/features/manual-blocking/common/constants'

@injectable()
export class IframeManager {
  private iframe: HTMLIFrameElement
  constructor (
    @inject(ContentManualBlockingIdentifiers.options)
    private readonly options: ContentManualBlockingOptions
  ) {
  }

  async start (appliedRules: string[], sessionId: string): Promise<void> {
    if (this.iframe) {
      return
    }
    if (!document.body) {
      setTimeout(() => {
        this.start(appliedRules, sessionId)
      }, 200)
      return
    }

    await new Promise<void>(resolve => {
      this.iframe = document.createElement('iframe')
      // eslint-disable-next-line brace-style
      this.iframe.onload = (): void => { resolve() }
      Object.assign(this.iframe.style, this.options.iframe.style)
      const payload = encodeURIComponent(JSON.stringify({ appliedRules, sessionId, currentDomain: document.location.hostname }))
      const src = `${this.options.iframe.url}?payload=${payload}`

      this.iframe.src = chrome.runtime.getURL(src)
      this.iframe.id = MANUAL_BLOCKING_IFRAME_ID
      makeIframeDraggable(this.iframe, { offsetRight: 16, y: 16, z: 9999999999 })
    })
  }

  async stop (): Promise<void> {
    if (!this.iframe) {
      return
    }
    this.iframe.remove()
    this.iframe = undefined
  }
}
