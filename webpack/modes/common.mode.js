/**
 * REPLACE_WITH_OUR_LICENSE
 */

import fs from 'fs'
import { typescriptLoader } from '../loaders/typescript.loader.js'
import { vueLoader } from '../loaders/vue.loader.js'
import { babelLoader } from '../loaders/babel.loader.js'
import { lessLoader } from '../loaders/less.loader.js'
import { cssLoader } from '../loaders/css.loader.js'
import { imageLoader } from '../loaders/image.loader.js'
import { aliases } from '../alias.js'
import { terserPlugin } from '../plugins/terser.plugin.js'
import { dotenvPlugin } from '../plugins/dotenv.plugin.js'
import { vueLoaderPlugin } from '../plugins/vue-loader.plugin.js'
import { webpackPlugin } from '../plugins/webpack.plugin.js'
import { fileManagerPlugin } from '../plugins/file-manager.plugin.js'
import path from 'path'
import { getPackageVersion } from '../utils/get-package-version.js'
import { fileURLToPath } from 'node:url'
import { getDnrFilters } from '../utils/get-dnr-filters.js'
import { AVAILABLE_FILTER_IDS } from '../../constants.js'
import { prepareEnv } from '../utils/prepare-env.js'
import { archiveName } from '../utils/archive-name.js'
import { modifyManifest } from '../utils/modify-manifest.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const buildPath = '../build'

export const commonMode = (env, mode) => {
  const { BROWSER: browser } = env

  /* Extract version */
  const version = getPackageVersion()

  /* Populate manifest */
  const filters = getDnrFilters(
    `${__dirname}/../../app/filters/declarative`,
    AVAILABLE_FILTER_IDS
  )
  fs.writeFileSync('manifest.temp.json', modifyManifest(version, filters))

  const rules = [
    typescriptLoader(mode),
    vueLoader(),
    babelLoader(),
    lessLoader(),
    cssLoader(),
    imageLoader()
  ]

  return {
    entry: {
      [`${buildPath}/service_worker`]: './app/service_worker/worker.ts',
      [`${buildPath}/popup/popup`]: './app/ui/toolbar-popup/popup.ts'
    },
    module: {
      rules
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.vue'],
      alias: aliases
    },
    optimization: {
      minimizer: [terserPlugin()]
    },
    plugins: [
      dotenvPlugin(prepareEnv(mode, browser)),
      vueLoaderPlugin(),
      webpackPlugin(),
      fileManagerPlugin({ distName: archiveName({ version, mode, browser }), filters })
    ],
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '..', buildPath)
    }
  }
}
