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
import http from 'node:http'
import fs from 'node:fs'
import { join } from 'node:path'
import { getDirPath } from './utils/get-dir-path.mjs'
import { config } from './settings/config.mjs'

/**
 * Note
 * Please be sure to install nodejs before running the server
 * Current server is emulation of back-end to test local dev environment.
 * Please be sure that port you're running matches port in env file for extension
 */
const handleHome = res => {
  const filePath = join(getDirPath(), 'views', 'home.html')
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
      return
    }
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(data)
  })
}

const handleConfig = res => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(config))
}

const handleReport = res => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end()
}

const handleNotFound = res => {
  const notFoundPath = join(getDirPath(), 'views', 'not-found.html')
  fs.readFile(notFoundPath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
      return
    }
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end(data)
  })
}

const server = http.createServer((req, res) => {
  const url = req.url

  switch (url) {
    case '/':
      handleHome(res)
      break

    case '/rest/v3/configs/extensions/open-ad-blocker':
      handleConfig(res)
      break

    case '/rest/v1/support/extension':
      handleReport(res)
      break

    default:
      handleNotFound(res)
      break
  }
})

const port = process.env.PORT || 3300
server.listen(port, () => {
  console.log(`Listening on port: ${port} `)
})
