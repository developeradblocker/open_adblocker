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
import { Configuration } from '@adguard/tswebextension/mv3'
import { FilterListPreprocessor } from '@adguard/tsurlfilter'
import { AVAILABLE_FILTER_IDS } from '../../../../constants'

export const DEFAULT_EXTENSION_CONFIG = (): Configuration => ({
  staticFiltersIds: AVAILABLE_FILTER_IDS.map(filterId => Number(filterId)),
  // logLevel: LogLevel.Debug,
  customFilters: [],
  trustedDomains: [],
  /**
   * DO NOT MODIFY THIS LIST DUE IT'S CONTROLLED VIA WHITE LIST MODULE
   */
  allowlist: [],
  userrules: Object.assign(
    FilterListPreprocessor.createEmptyPreprocessedFilterList(),
    { trusted: true }
  ),
  quickFixesRules: Object.assign(
    FilterListPreprocessor.createEmptyPreprocessedFilterList(),
    { trusted: true }
  ),
  verbose: true,
  filtersPath: 'filters',
  ruleSetsPath: 'filters/declarative',
  declarativeLogEnabled: true,
  settings: {
    assistantUrl: 'assistant-inject.js',
    gpcScriptUrl: 'gpc.js',
    hideDocumentReferrerScriptUrl: 'hide-document-referrer.js',
    collectStats: true,
    allowlistEnabled: true,
    allowlistInverted: false,
    stealthModeEnabled: false,
    filteringEnabled: true,
    debugScriptlets: false,
    stealth: {
      blockChromeClientData: false,
      hideReferrer: false,
      hideSearchQueries: false,
      sendDoNotTrack: false,
      blockWebRTC: false,
      selfDestructThirdPartyCookies: false,
      selfDestructThirdPartyCookiesTime: 3600,
      selfDestructFirstPartyCookies: false,
      selfDestructFirstPartyCookiesTime: 3600
    }
  }
})
