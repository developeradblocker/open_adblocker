import { commonMode } from './modes/common.mode.js'
import { devMode } from './modes/dev.mode.js'
import { merge } from 'webpack-merge'
import { prodMode } from './modes/prod.mode.js'
export default (env, { mode }) => {
  const common = commonMode(env, mode)
  const dev = devMode()
  const prod = prodMode()

  let config
  switch (mode) {
    case 'production':
      config = merge(common, prod)
      break
    case 'development':
      config = merge(common, dev)
      break
    default:
      throw new Error('No matching configuration was found!')
  }

  return config
}
