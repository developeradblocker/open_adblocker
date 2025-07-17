/**
 * REPLACE_WITH_OUR_LICENSE
 */
const removeDataTestAttrs = node => {
  if (node.type === 1) {
    node.props = node.props.filter(prop => prop.name !== 'data-test')
  }
}
export const vueLoader = (mode) => {
  const isDevMode = mode === 'development'
  return ({
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      compilerOptions: {
        nodeTransforms: isDevMode ? [] : [removeDataTestAttrs]
      }
    }
  })
}
