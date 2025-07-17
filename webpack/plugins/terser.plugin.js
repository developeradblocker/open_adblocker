/**
 * REPLACE_WITH_OUR_LICENSE
 */

import TerserPlugin from 'terser-webpack-plugin'

export const terserPlugin = () =>
  new TerserPlugin({
    parallel: false,
    terserOptions: {
      compress: {
        keep_fargs: true
      },
      sourceMap: true,
      keep_classnames: true,
      keep_fnames: true,
      toplevel: false
    }
  })
