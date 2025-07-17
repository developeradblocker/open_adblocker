/**
 * REPLACE_WITH_OUR_LICENSE
 */

import { progressPlugin } from '../plugins/progress.plugin.js'
export const devMode = () => ({
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [progressPlugin()]
})
