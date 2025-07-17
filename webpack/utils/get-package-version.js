/**
 * REPLACE_WITH_OUR_LICENSE
 */

import fs from 'fs'

export const getPackageVersion = () => {
  const json = fs.readFileSync('./package.json').toString()
  const { version } = JSON.parse(json)
  return version
}
