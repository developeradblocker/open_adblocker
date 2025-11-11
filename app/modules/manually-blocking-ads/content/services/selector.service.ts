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
  ManuallyBlockingAdsAddRuleMessage,
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
  private traversedElements: HTMLElement[]
  constructor(
    @inject(ContentBroadcastIdentifiers.service)
    private readonly broadcast: ContentBroadcastServiceInterface
  ) {
    document.body.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  start (): void {
    this.currentEl = null
    this.traversedElements = null
    this.isStarted = true
  }

  stop (): void {
    this.isStarted = false
  }

  onClose (): void {
    this.exitPreview()
    this.stop()
    this.removeHighlight(this.currentEl)
    this.currentEl = null
    this.traversedElements = []
  }

  changeElement (newIndex: number): void {
    if (!this.traversedElements[newIndex]) {
      return
    }

    this.removeHighlight(this.currentEl)
    this.currentEl = this.traversedElements[newIndex]
    this.highlight(this.currentEl)
  }

  enterPreview (): void {
    this.currentEl.style.cssText += 'display: none !important;'
  }

  exitPreview (): void {
    this.currentEl.style.cssText = this.currentEl.style.cssText.replace('display: none !important;', '')
  }

  blockElement (allWebsites: boolean, blockSimilar: boolean): void {
    const options = {
      urlMask: this.getUrlBlockAttribute(this.currentEl),
      cssSelectorType: blockSimilar ? 'SIMILAR' : 'STRICT_FULL',
      isBlockOneDomain: allWebsites,
      url: document.location,
      ruleType: 'CSS',
    }

    const ruleText = adguardRulesConstructor.constructRuleText(this.currentEl, options)
    const message: ManuallyBlockingAdsAddRuleMessage = {
      type: ManuallyBlockingAdsMessages.addRule,
      payload: {
        ruleText
      }
    }
    this.currentEl.style.cssText += 'display: none !important;'
    this.broadcast.sendMessage(message)
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

    const traversedTree = this.getTraversedElements()
    this.traversedElements = traversedTree.elements
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

  private getTraversedElements (): {
    elements: HTMLElement[],
    selectedElementIndex: number
  } {
    const elements: HTMLElement[] = [this.currentEl]
    let currentEl = this.currentEl.firstElementChild as HTMLElement

    while(currentEl && this.checkVisibility(currentEl)) {
      elements.unshift(currentEl)
      currentEl = currentEl.firstElementChild as HTMLElement
    }

    const selectedElementIndex = elements.length - 1
    currentEl = this.currentEl.parentElement

    while (currentEl && currentEl.tagName !== 'BODY') {
      elements.push(currentEl)
      currentEl = currentEl.parentElement
    }

    return {
      elements,
      selectedElementIndex
    }
  }

  private checkVisibility (el: HTMLElement): boolean {
    const isVisible = el.checkVisibility({
      contentVisibilityAuto: true,
      opacityProperty: true,
      visibilityProperty: true
    })

    if (isVisible) {
      const { width, height } = el.getBoundingClientRect()
      return width > 1 && height > 1
    }

    return false
  }
}
