/**
 * REPLACE_WITH_OUR_LICENSE
 */

import fs from 'fs'

export const getCommonManifest = () => {
  const json = fs.readFileSync('./app/manifest.json').toString()
  return JSON.parse(json)
}
