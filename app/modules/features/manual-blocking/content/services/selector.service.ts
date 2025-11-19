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
  ManualBlockingAddRuleMessage,
  ManualBlockingElementSelectedMessage,
  ManualBlockingMessages
} from '@/modules/features/manual-blocking/common/manual-blocking.messages'
import {
  ContentBroadcastIdentifiers,
  ContentBroadcastServiceInterface
} from '@/modules/broadcast/content/broadcast.types'

const HIGHLIGHT_COLOR = '#3A40EF'

@injectable()
export class SelectorService {
  private isStarted = false
  private currentEl: HTMLElement
  private traversedElements: HTMLElement[]
  private highlightElement: HTMLElement
  private isPreview = false
  constructor (
    @inject(ContentBroadcastIdentifiers.service)
    private readonly broadcast: ContentBroadcastServiceInterface
  ) {
    document.body.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  start (): void {
    this.currentEl = null
    this.highlightElement = null
    this.traversedElements = null
    this.isStarted = true
  }

  stop (): void {
    this.isStarted = false
    this.removeHighlight()
  }

  onClose (): void {
    this.exitPreview()
    this.stop()
    this.removeHighlight()
    this.currentEl = null
    this.traversedElements = []
  }

  changeElement (newIndex: number): void {
    if (!this.traversedElements[newIndex]) {
      return
    }

    this.currentEl = this.traversedElements[newIndex]
    this.highlight(this.currentEl)
  }

  enterPreview (): void {
    this.isPreview = true
    this.currentEl.style.cssText += 'display: none !important;'
    this.highlightElement.style.display = 'none'
  }

  exitPreview (): void {
    if (!this.isPreview) {
      return
    }

    this.currentEl.style.cssText = this.currentEl.style.cssText.replace('display: none !important;', '')
    this.highlightElement.style.display = 'block'
  }

  blockElement (allWebsites: boolean, blockSimilar: boolean): void {
    const options = {
      urlMask: this.getUrlBlockAttribute(this.currentEl),
      cssSelectorType: blockSimilar ? 'SIMILAR' : 'STRICT_FULL',
      isBlockOneDomain: allWebsites,
      url: document.location,
      ruleType: 'CSS'
    }

    const ruleText = adguardRulesConstructor.constructRuleText(this.currentEl, options)
    const message: ManualBlockingAddRuleMessage = {
      type: ManualBlockingMessages.addRule,
      payload: {
        ruleText
      }
    }
    this.currentEl.style.cssText += 'display: none !important;'
    this.removeHighlight()
    this.broadcast.sendMessage(message)
  }

  private onMouseMove (event: MouseEvent): void {
    if (!this.isStarted) {
      return
    }

    const el = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement

    if (this.currentEl && this.currentEl.isSameNode(el)) {
      return
    }

    if (this.currentEl) {
      this.currentEl.removeEventListener('click', this.onClick.bind(this))
    }

    this.currentEl = el
    this.highlight(el)
  }

  private highlight (element: HTMLElement): void {
    const isNewEl = !this.highlightElement
    if (isNewEl) {
      this.highlightElement = document.createElement('span')
      this.highlightElement.style.border = '2px solid ' + HIGHLIGHT_COLOR
      this.highlightElement.style.borderRadius = '4px'
      this.highlightElement.style.position = 'absolute'
      this.highlightElement.style.outline = 'none'
      this.highlightElement.style.transition = 'all .1s linear'
      this.highlightElement.style.pointerEvents = 'none'
      this.highlightElement.style.zIndex = '999999999'
    }

    const r = element.getBoundingClientRect()
    this.highlightElement.style.left = r.left + 'px'
    this.highlightElement.style.top = window.pageYOffset + r.top + 'px'
    this.highlightElement.style.width = r.width + 'px'
    this.highlightElement.style.height = r.height + 'px'

    if (isNewEl) {
      this.highlightElement = document.body.appendChild(this.highlightElement)
    }
    element.addEventListener('click', this.onClick.bind(this))
  }

  private removeHighlight (): void {
    this.highlightElement?.remove()
    this.highlightElement = null
  }

  private onClick (event: MouseEvent): void {
    if (!this.isStarted) {
      return
    }

    event.preventDefault()
    event.stopImmediatePropagation()

    const traversedTree = this.getTraversedElements()
    this.traversedElements = traversedTree.elements
    const message: ManualBlockingElementSelectedMessage = {
      type: ManualBlockingMessages.elementSelected,
      payload: {
        elementsInTraversedTree: traversedTree.elements.length,
        elementIndex: traversedTree.selectedElementIndex
      }
    }
    this.broadcast.sendMessageToIframes(message)
    this.stop()
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

    while (currentEl && this.checkVisibility(currentEl)) {
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
