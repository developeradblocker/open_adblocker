/**
 * REPLACE_WITH_OUR_LICENSE
 */

export const babelLoader = () => ({
  test: /\.js$/,
  exclude: [/node_modules/, /local_script_rules\.js/],
  use: {
    loader: 'babel-loader',
    options: {
      presets: [['@babel/preset-env']]
    }
  }
})
