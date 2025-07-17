/**
 * EasyList + AdGuard English filter. This filter is necessary for quality ad blocking.
 */
const AD_BLOCKER_ID = '2'

const SEARCH_ADS_ID = '10'

/**
 * a list of available filter IDs
 *
 * The list of available filters can be found by filters in the metadata.
 * https://filters.adtidy.org/extension/chromium-mv3/filters.json
 */
export const AVAILABLE_FILTER_IDS = [
  AD_BLOCKER_ID,
  SEARCH_ADS_ID
]

/**
 * at the moment, all available filters are enabled by default
 */
export const DEFAULT_ENABLED_FILTER_IDS = AVAILABLE_FILTER_IDS

export const RULESET_NAME_PREFIX = 'ruleset_'
