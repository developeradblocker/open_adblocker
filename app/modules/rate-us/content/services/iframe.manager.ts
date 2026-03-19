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
  ContentRateUsIdentifiers,
  ContentRateUsOptions
} from '../rate-us.types'
import { RATE_US_FRAME_ID } from '../../constants'

@injectable()
export class IframeManager {
  private iframe: HTMLIFrameElement
  constructor (
    @inject(ContentRateUsIdentifiers.options)
    private readonly options: ContentRateUsOptions
  ) {
  }

  async show (): Promise<void> {
    if (this.iframe) {
      return
    }
    if (!document.body) {
      setTimeout(() => {
        this.show()
      }, 200)
      return
    }

    this.iframe = document.createElement('iframe')

    Object.assign(this.iframe.style, this.options.iframe.style)

    const src = `${this.options.iframe.url}`

    this.iframe.src = chrome.runtime.getURL(src)
    this.iframe.id = RATE_US_FRAME_ID
    document.body.appendChild(this.iframe)
  }

  async close (): Promise<void> {
    if (!this.iframe) {
      return
    }
    this.iframe.remove()
    this.iframe = undefined
  }
}
