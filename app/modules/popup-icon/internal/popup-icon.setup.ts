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

import { PopupIconIdentifiers } from '@/modules/popup-icon/internal/popup-icon.types'
import { PopupIconService } from '@/modules/popup-icon/internal/services/popup-icon.service'
import { internalAdblocker } from '@/modules/ad-blocker/internal/utils'
import { getDomainHelper } from '@/helpers/get-domain.helper'
import { iconService } from '@/modules/popup-icon/internal/utils'
import { onAdBlockerReady } from '@/modules/ad-blocker/internal/expose.messages'
import { Injection } from '@/utils/inject/inject.types'
import { inject } from '@/utils/inject/inject'

import TabActiveInfo = chrome.tabs.TabActiveInfo
import TabChangeInfo = chrome.tabs.TabChangeInfo

const injections: Injection[] = [
  {
    key: PopupIconIdentifiers.service,
    use: PopupIconService
  }
]

/**
 * Popup icon module is response for drawing the icon in the popup and how many ads are blocked in badge.
 *
 * this module is used AdBlockerService it's means we should wait when AdBlockerService is ready
 */
export const setupPopupIcon = (): void => {
  chrome.tabs.onActivated.addListener(onActivated)
  chrome.tabs.onUpdated.addListener(onUpdated)
  inject(injections)
  onAdBlockerReady(handleOnAdBlockerReady)
}
let canHandle = false

const onActivated = async ({ tabId }: TabActiveInfo): Promise<void> => {
  if (!canHandle) {
    return
  }

  const tabInfo = await chrome.tabs.get(tabId)
  if (!tabInfo?.url) {
    return
  }

  await draw(tabId, tabInfo.url)
}
const onUpdated = async (tabId: number, { status }: TabChangeInfo): Promise<void> => {
  if (!canHandle) {
    return
  }

  if (status !== 'complete') {
    return
  }
  const tabInfo = await chrome.tabs.get(tabId)

  if (!tabInfo?.url) {
    return
  }

  await draw(tabId, tabInfo.url)
}

const handleOnAdBlockerReady = async (): Promise<void> => {
  canHandle = true
}

const draw = async (tabId: number, url: string): Promise<void> => {
  const domain = getDomainHelper(url)
  await internalAdblocker().isPaused(domain)
    ? await iconService().drawPaused(tabId)
    : await iconService().drawActive(tabId)
}
