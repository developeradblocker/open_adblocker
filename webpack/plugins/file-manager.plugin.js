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

import FileManagerPlugin from 'filemanager-webpack-plugin'
import { isDev } from '../utils/is-dev.js'

export const fileManagerPlugin = ({ distName, filters, mode }) => {
  const declarativeFilters = filters.map(filter => ({
    source: `./app/filters/declarative/${filter}/${filter}.json`,
    destination: `./build/filters/declarative/${filter}/${filter}.json`
  }))

  /**
   * filter with id 0 is required it holds the checksums for all filters
   */
  // declarativeFilters.push({
  //   source: './app/filters/declarative/ruleset_0/ruleset_0.json',
  //   destination: './build/filters/declarative/ruleset_0/ruleset_0.json'
  // })

  const config = {
    events: {
      onEnd: {
        copy: [
          {
            source: './manifest.temp.json',
            destination: 'build/manifest.json'
          },
          {
            source: 'app/ui/toolbar-popup/index.html',
            destination: 'build/popup/index.html'
          },
          {
            source: 'app/ui/settings/index.html',
            destination: 'build/settings/index.html'
          },
          {
            source: './app/ui/shared/icons',
            destination: './build/icons'
          },
          {
            source: './app/web-accessible-resources',
            destination: './build/web-accessible-resources'
          },
          ...declarativeFilters
        ],
        ...(distName && {
          archive: [{
            source: './build',
            destination: `dist/${distName}.zip`,
            options: {
              globOptions: {
                dot: true
              }
            }
          },
          ...(isDev(mode)
            ? [{
                source: './server',
                destination: 'dist/Open_AdBlocker_server.zip',
                options: {
                  globOptions: {
                    dot: true
                  }
                }
              }]
            : [])
          ]
        }),
        delete: [
          './manifest.temp.json'
        ]
      }
    }
  }
  return new FileManagerPlugin(config)
}
