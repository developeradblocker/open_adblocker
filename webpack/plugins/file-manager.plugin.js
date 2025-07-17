/**
 * REPLACE_WITH_OUR_LICENSE
 */

import FileManagerPlugin from 'filemanager-webpack-plugin'

export const fileManagerPlugin = ({ distName, filters }) => {
  const declarativeFilters = filters.map(filter => ({
    source: `./app/filters/declarative/${filter}/${filter}.json`,
    destination: `./build/filters/declarative/${filter}/${filter}.json`
  }))

  /**
   * filter with id 0 is required it holds the checksums for all filters
   */
  declarativeFilters.push({
    source: './app/filters/declarative/ruleset_0/ruleset_0.json',
    destination: './build/filters/declarative/ruleset_0/ruleset_0.json'
  })

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
          }]
        }),
        delete: [
          './manifest.temp.json'
        ]
      }
    }
  }
  return new FileManagerPlugin(config)
}
