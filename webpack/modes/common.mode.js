/**
 * @file
 * This file is part of Open Ad Blocker Browser Extension (https://github.com/developeradblocker/open_adblocker).
 *
 * Open Ad Blocker Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Open Ad Blocker Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Open Ad Blocker Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */

import fs from 'fs'
import { typescriptLoader } from '../loaders/typescript.loader.js'
import { vueLoader } from '../loaders/vue.loader.js'
import { babelLoader } from '../loaders/babel.loader.js'
import { lessLoader } from '../loaders/less.loader.js'
import { cssLoader } from '../loaders/css.loader.js'
import { imageLoader } from '../loaders/image.loader.js'
import { aliases } from '../alias.js'
import { dotenvPlugin } from '../plugins/dotenv.plugin.js'
import { vueLoaderPlugin } from '../plugins/vue-loader.plugin.js'
import { webpackPlugin } from '../plugins/webpack.plugin.js'
import { fileManagerPlugin } from '../plugins/file-manager.plugin.js'
import path from 'path'
import { getPackageVersion } from '../utils/get-package-version.js'
import { fileURLToPath } from 'node:url'
import { getDnrFilters } from '../utils/get-dnr-filters.js'
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
    `${__dirname}/../../app/filters/declarative`
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
      [`${buildPath}/popup/popup`]: './app/ui/toolbar-popup/popup.ts',
      [`${buildPath}/settings/settings`]: './app/ui/settings/settings.ts',
      [`${buildPath}/content/tswebextension/content-script`]: './node_modules/@adguard/tswebextension/dist/content-script.mv3.js',
      [`${buildPath}/content/manual-blocking/content-script`]: './app/ui/manual-blocking/main.ts',
      [`${buildPath}/content/content`]: './app/content/content.ts'
    },
    module: {
      rules
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.vue'],
      alias: aliases
    },
    plugins: [
      dotenvPlugin(prepareEnv(mode, browser)),
      vueLoaderPlugin(),
      webpackPlugin(),
      fileManagerPlugin({
        distName: archiveName({ version, mode, browser }),
        filters,
        mode
      })
    ],
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '..', buildPath)
    }
  }
}
