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
import adguardRulesConstructor from '@/assistant/adguard-rules-constructor'
import { inject, injectable } from '@/utils/di/di.types'
import {
  ManuallyBlockingAdsElementSelectedMessage,
  ManuallyBlockingAdsMessages
} from '@/modules/manually-blocking-ads/common/manually-blocking-ads.messages'
import {
  ContentBroadcastIdentifiers,
  ContentBroadcastServiceInterface
} from '@/modules/broadcast/content/broadcast.types'

const HIGHLIGHT_COLOR ='#3A40EF'

@injectable()
export class SelectorService {
  private isStarted = false
  private currentEl: HTMLElement
  // private selectedElementsByRules: Record<string, HTMLElement> = {}
  constructor(
    @inject(ContentBroadcastIdentifiers.service)
    private readonly broadcast: ContentBroadcastServiceInterface
  ) {
    // TODO: Get elements by rule that exists and map them to
    document.body.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  start (): void {
    this.currentEl = null
    this.isStarted = true
  }

  stop (): void {
    this.isStarted = false
    this.currentEl = null
  }

  private onMouseMove (event: MouseEvent): void {
    if (!this.isStarted) {
      return
    }
    const el = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement
    if (!this.currentEl) {
      this.currentEl = el
    } else if (this.currentEl !== el) {
      this.removeHighlight(this.currentEl)
      this.currentEl = el
    }
    this.highlight(el)
  }

  private highlight (element: HTMLElement): void {
    element.setAttribute('data-tag-name', element.tagName)
    element.style.outline = `2px solid ${HIGHLIGHT_COLOR}`
    element.style.borderRadius = '4px'
    element.style.transition = 'all linear .1s'
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    element.addEventListener('click', this.onClick.bind(this))
  }

  private removeHighlight (element: HTMLElement): void {
    element.style.borderRadius = ''
    element.style.outline = ''
    element.style.transition = ''
    // eslint-disable-next-line @typescript-eslint/no-misused-promises,@typescript-eslint/unbound-method
    element.removeEventListener('click', this.onClick)
  }

  private onClick (event: MouseEvent): void {
    if (!this.isStarted) {
      return
    }

    event.preventDefault()
    event.stopImmediatePropagation()

    const options = {
      urlMask: this.getUrlBlockAttribute(this.currentEl),
      cssSelectorType: 'SIMILAR',
      isBlockOneDomain: true,
      url: document.location,
      ruleType: 'CSS',
    };

    const ruleText = adguardRulesConstructor.constructRuleText(this.currentEl, options);
    const traversedTree = this.getTraversedElements()
    const message: ManuallyBlockingAdsElementSelectedMessage = {
      type: ManuallyBlockingAdsMessages.elementSelected,
      payload: {
        elementsInTraversedTree: traversedTree.elements.length,
        elementIndex: traversedTree.selectedElementIndex,
      }
    }
    this.broadcast.sendMessageToIframes(message)
    this.stop()
    return
  }

  private getUrlBlockAttribute = (element: HTMLElement): string | null => {
    const urlBlockAttributes = ['src', 'data']
    for (let i = 0; i < urlBlockAttributes.length; i += 1) {
      const attr = urlBlockAttributes[i]
      const value = element.getAttribute(attr)
      if (value) {
        return value
      }
    }
    return null
  }

  getTraversedElements (): {
    elements: HTMLElement[],
    selectedElementIndex: number
  } {
    const elements: HTMLElement[] = [this.currentEl]
    let currentEl = this.currentEl.parentElement

    while (currentEl && currentEl.tagName !== 'BODY') {
      elements.unshift(currentEl)
      currentEl = currentEl.parentElement
    }
    const selectedElementIndex = elements.length
    currentEl = this.currentEl.firstElementChild as HTMLElement

    while(currentEl) {
      elements.push(currentEl)
      currentEl = currentEl.firstElementChild as HTMLElement
    }

    return {
      elements,
      selectedElementIndex
    }
  }
}
