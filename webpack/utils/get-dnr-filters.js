/**
 * REPLACE_WITH_OUR_LICENSE
 */

import fs from 'node:fs'
import { RULESET_NAME_PREFIX } from '../../constants.js'

export const getDnrFilters = (dir, filterIds) => {
  const condition = new RegExp(`${RULESET_NAME_PREFIX}\\d+`)
  return fs
    .readdirSync(dir)
    .filter(fileName => fileName.match(condition))
    .filter(fileName => filterIds.some((id) => id === fileName.replace(RULESET_NAME_PREFIX, '')))
}
