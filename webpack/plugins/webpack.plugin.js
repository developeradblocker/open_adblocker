/**
 * REPLACE_WITH_OUR_LICENSE
 */
import webpack from 'webpack'

export const webpackPlugin = () => new webpack.DefinePlugin({
  __VUE_OPTIONS_API__: true,
  __VUE_PROD_DEVTOOLS__: false,
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
})
