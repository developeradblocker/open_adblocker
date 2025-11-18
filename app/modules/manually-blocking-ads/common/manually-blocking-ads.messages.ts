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
  triggerStart = 'ManuallyBlockingAds.TriggerStart',
  start = 'ManuallyBlockingAds.Start',
  selectElement = 'ManuallyBlockingAds.SelectElement',
  elementSelected = 'ManuallyBlockingAds.ElementSelected',
  changeElement = 'ManuallyBlockingAds.ChangeElement',
  enterPreview = 'ManuallyBlockingAds.EnterPreview',
  exitPreview = 'ManuallyBlockingAds.ExitPreview',
  stop = 'ManuallyBlockingAds.Stop',
  close = 'ManuallyBlockingAds.Close',
  blockElement = 'ManuallyBlockingAds.BlockElement',
  addRule = 'ManualBlockingAds.AddRule',
  removeRule = 'ManualBlockingAds.RemoveRule',
  resetRules = 'ManualBlockingAds.ResetAll',
  rulesUpdated = 'ManualBlockingAds.RulesUpdated'
}

export interface ManuallyBlockingAdsStartMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.start
  payload: { tabId: number, appliedRules: string[] }
}

export interface ManuallyBlockingAdsTriggerStartMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.triggerStart
  payload: { tabId: number, url: string }
}

export interface ManuallyBlockingAdsSelectElementMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.selectElement
}

export interface ManuallyBlockingAdsChangeElementMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.changeElement,
  payload: {
    newIndex: number
  }
}

export interface ManuallyBlockingAdsEnterPreviewMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.enterPreview
}

export interface ManuallyBlockingAdsExitPreviewMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.exitPreview
}

export interface ManuallyBlockingAdsStopMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.stop
}

export interface ManuallyBlockingAdsCloseMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.close
}

export interface ManuallyBlockingAdsElementSelectedMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.elementSelected,
  payload: {
    elementIndex: number
    elementsInTraversedTree: number
  }
}

export interface ManuallyBlockingAdsBlockElementMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.blockElement,
  payload: {
    allWebsites: boolean
    blockSimilar: boolean
  }
}

export interface ManuallyBlockingAdsAddRuleMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.addRule
  payload: { ruleText: string }
}

export interface ManuallyBlockingAdsRemoveRuleMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.removeRule
  payload: { ruleText: string }
}

export interface ManuallyBlockingAdsResetRulesMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.resetRules,
  payload: { rules: string[] }
}

export interface ManuallyBlockingAdsRulesUpdatedMessage extends AppMessage {
  type: ManuallyBlockingAdsMessages.rulesUpdated,
  payload: {
    needReload?: boolean
  }
}
