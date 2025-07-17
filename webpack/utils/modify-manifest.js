import { getCommonManifest } from './get-common-manifest.js'
import { addDeclarativeNetworkRules } from './add-declarative-network-rules.js'

export const modifyManifest = (version, filters) => {
  let manifest = getCommonManifest()
  manifest.version = version
  manifest = addDeclarativeNetworkRules(manifest, filters)
  return JSON.stringify(manifest, null, 2)
}
