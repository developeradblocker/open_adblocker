/**
 * REPLACE_WITH_OUR_LICENSE
 */

export const imageLoader = () => ({
  test: /\.(png|jpg|gif|svg)$/,
  type: 'asset/resource',
  generator: {
    filename: './icons/[name][ext]'
  }
})
