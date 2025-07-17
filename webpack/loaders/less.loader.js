/**
 * REPLACE_WITH_OUR_LICENSE
 */

export const lessLoader = () => ({
  test: /\.less$/,
  use: [
    'vue-style-loader',
    'css-loader',
    'less-loader'
  ]
})
