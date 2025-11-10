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
import { AppMessage } from '@/utils/dispatcher/dispatcher.types'

export enum ManuallyBlockingAdsMessages {
  start = 'ManuallyBlockingAds.Start',
  selectElement = 'ManuallyBlockingAds.SelectElement',
  elementSelected = 'ManuallyBlockingAds.ElementSelected',
  stop = 'ManuallyBlockingAds.Stop',
  ruleAdded = 'assistantCreateRule'
}

export interface ManuallyBlockingAdsStartMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.start
  payload: { tabId: number }
}

export interface ManuallyBlockingAdsSelectElementMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.selectElement
}

export interface ManuallyBlockingAdsStopMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.stop
}

export interface ManuallyBlockingAdsElementSelectedMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.elementSelected,
  payload: {
    elementIndex: number
    elementsInTraversedTree: number
  }
}

export interface ManuallyBlockingAdsRuleAddedMessage {
  type: ManuallyBlockingAdsMessages.ruleAdded
  payload: { ruleText: string }
  handlerName: 'tsWebExtension'
}
