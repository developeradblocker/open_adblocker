/**
 * REPLACE_WITH_OUR_LICENSE
 */
export const typescriptLoader = (mode) => {
  const isDevMode = mode === 'development'
  return ({
    test: /\.tsx?$/,
    exclude: [/tests/],
    use: [{
      loader: 'ts-loader',
      options: {
        appendTsSuffixTo: [/.vue$/],
        compilerOptions: {
          ...(isDevMode && {
            sourceMap: true,
            noUnusedLocals: false
          })
        }
      }
    }]
  })
}
