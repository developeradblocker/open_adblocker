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
/**
 * EasyList + AdGuard English filter. This filter is necessary for quality ad blocking.
 */
const AD_BLOCKER_ID = 2

const SEARCH_ADS_ID = 10
/**
 * Cookie filter. Removes cookies notifications from websites
 */
export const COOKIE_CLEANER_ID = 18
export const CUSTOM_FILTERS_START_ID = 1000
export const USER_FILTER_ID = 0
export const ALLOWLIST_FILTER_ID = 100

export const RULESET_NAME_PREFIX = 'ruleset_'
export const METADATA_RULESET = `${RULESET_NAME_PREFIX}${USER_FILTER_ID}`
export const METADATA_PATH = `filters/declarative/${METADATA_RULESET}/${METADATA_RULESET}.json`
/**
 * a list of default available filter IDs
 *
 * The list of available filters can be found by filters in the metadata.
 * https://filters.adtidy.org/extension/chromium-mv3/filters.json
 */
export const DEFAULT_ENABLED_FILTER_IDS = [
  AD_BLOCKER_ID,
  SEARCH_ADS_ID
]

export const AD_BLOCKING_GROUP_ID = 1
export const OTHER_GROUP_ID = 6
export const DEFAULT_ENABLED_GROUPS_IDS = [
  AD_BLOCKING_GROUP_ID,
  OTHER_GROUP_ID
]

export const SKIPPED_FILTERS = [
  `${RULESET_NAME_PREFIX}1`
]
