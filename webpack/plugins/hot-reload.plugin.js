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

import { WebSocketServer } from 'ws'

const DEFAULT_HOT_RELOAD_PORT = 4421

export class HotReloadPlugin {
  constructor () {
    this.wss = null
    this.port = DEFAULT_HOT_RELOAD_PORT
    this.reloadTimer = null
  }

  apply (compiler) {
    compiler.hooks.watchRun.tap('HotReloadPlugin', () => {
      if (!this.wss) {
        this.wss = new WebSocketServer({ port: this.port })
        console.log(`[HotReload] WebSocket server started on ws://localhost:${this.port}`)
      }
    })

    compiler.hooks.afterEmit.tap('HotReloadPlugin', () => {
      clearTimeout(this.reloadTimer)

      this.reloadTimer = setTimeout(() => {
        if (this.wss) {
          this.wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
              client.send('reload')
            }
          })

          console.log('[HotReload] Reload signal sent')
        }
      }, 300)
    })
  }
}
