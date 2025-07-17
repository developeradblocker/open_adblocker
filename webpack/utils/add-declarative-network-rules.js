/**
 * REPLACE_WITH_OUR_LICENSE
 */

import { RulesetsInjector } from '@adguard/dnr-rulesets'
import { DEFAULT_ENABLED_FILTER_IDS, RULESET_NAME_PREFIX } from '../../constants.js'

export const addDeclarativeNetworkRules = (manifest, filters) => {
  const injector = new RulesetsInjector()
  return injector.applyRulesets(
    (id) => `filters/declarative/${id}/${id}.json`,
    manifest,
    filters,
    {
      enable: DEFAULT_ENABLED_FILTER_IDS,
      forceUpdate: true,
      rulesetPrefix: RULESET_NAME_PREFIX
    }
  )
}
