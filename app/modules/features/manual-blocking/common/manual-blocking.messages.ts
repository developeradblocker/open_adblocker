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

export enum ManualBlockingMessages {
  triggerStart = 'ManualBlocking.TriggerStart',
  start = 'ManualBlocking.Start',
  selectElement = 'ManualBlocking.SelectElement',
  elementSelected = 'ManualBlocking.ElementSelected',
  changeElement = 'ManualBlocking.ChangeElement',
  enterPreview = 'ManualBlocking.EnterPreview',
  exitPreview = 'ManualBlocking.ExitPreview',
  stop = 'ManualBlocking.Stop',
  close = 'ManualBlocking.Close',
  blockElement = 'ManualBlocking.BlockElement',
  addRule = 'ManualBlocking.AddRule',
  removeRule = 'ManualBlocking.RemoveRule',
  resetRules = 'ManualBlocking.ResetAll',
  rulesUpdated = 'ManualBlocking.RulesUpdated',
  save = 'ManualBlocking.Save'
}

export interface ManualBlockingStartMessage extends AppMessage {
  type: ManualBlockingMessages.start
  payload: { tabId: number, appliedRules: string[], sessionId: string }
}

export interface ManualBlockingTriggerStartMessage extends AppMessage {
  type: ManualBlockingMessages.triggerStart
  payload: {
    sessionId: string
  }
}

export interface ManualBlockingSelectElementMessage extends AppMessage {
  type: ManualBlockingMessages.selectElement
}

export interface ManualBlockingChangeElementMessage extends AppMessage {
  type: ManualBlockingMessages.changeElement,
  payload: {
    newIndex: number
  }
}

export interface ManualBlockingEnterPreviewMessage extends AppMessage {
  type: ManualBlockingMessages.enterPreview
}

export interface ManualBlockingExitPreviewMessage extends AppMessage {
  type: ManualBlockingMessages.exitPreview
}

export interface ManualBlockingStopMessage extends AppMessage {
  type: ManualBlockingMessages.stop
}

export interface ManualBlockingCloseMessage extends AppMessage {
  type: ManualBlockingMessages.close
}

export interface ManualBlockingElementSelectedMessage extends AppMessage {
  type: ManualBlockingMessages.elementSelected,
  payload: {
    elementIndex: number
    elementsInTraversedTree: number
  }
}

export interface ManualBlockingBlockElementMessage extends AppMessage {
  type: ManualBlockingMessages.blockElement,
  payload: {
    allWebsites: boolean
    blockSimilar: boolean
  }
}

export interface ManualBlockingAddRuleMessage extends AppMessage {
  type: ManualBlockingMessages.addRule
  payload: { ruleText: string }
}

export interface ManualBlockingResetRulesMessage extends AppMessage {
  type: ManualBlockingMessages.resetRules,
  payload: { rules: string[] }
}

export interface ManualBlockingRulesUpdatedMessage extends AppMessage {
  type: ManualBlockingMessages.rulesUpdated,
  payload: {
    needReload?: boolean
  }
}

export interface ManualBlockingSaveMessage extends AppMessage {
  type: ManualBlockingMessages.save,
  payload: {
    userRules: string[],
    override: boolean
  }
}
