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
import { commonMode } from './modes/common.mode.js'
import { devMode } from './modes/dev.mode.js'
import { merge } from 'webpack-merge'
import { prodMode } from './modes/prod.mode.js'
export default (env, { mode }) => {
  const common = commonMode(env, mode)
  const dev = devMode()
  const prod = prodMode()

  let config
  switch (mode) {
    case 'production':
      config = merge(common, prod)
      break
    case 'development':
      config = merge(common, dev)
      break
    default:
      throw new Error('No matching configuration was found!')
  }

  return config
}
