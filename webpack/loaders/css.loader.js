/**
 * REPLACE_WITH_OUR_LICENSE
 */

export const cssLoader = () => ({
  test: /\.css$/,
  use: [
    'vue-style-loader',
    'css-loader'
  ]
})
