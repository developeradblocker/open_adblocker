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
import fs from 'node:fs'
const disclaimer = `/**
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
 */`

// noinspection TypeScriptUnresolvedReference
const stdin = process.openStdin()

let data = ''

stdin.on('data', (chunk) => {
  data += chunk
})

stdin.on('end', async () => {
  await insertDisclaimer(data)
})

const insertDisclaimer = async (data): Promise<void> => {
  const lines = data.split('\n')
  for (let i = 0; i < data.length; i += 1) {
    const s = lines[i]

    if (s?.includes('Missing @file')) {
      const path = lines[i - 1]

      console.log(`Insert disclaimer to "${path}"`)
      insertAndSave(path)
    }
  }
}

const insertAndSave = (path): void => {
  const rows = fs.readFileSync(path).toString().split('\n')
  if (path.endsWith('.vue')) {
    const scriptIndex = rows.findIndex((row) => row?.startsWith('<script'))
    if (scriptIndex >= 0) {
      rows.splice(scriptIndex + 1, 0, ...disclaimer.split('\n'))
    }
  } else {
    rows.unshift(...disclaimer.split('\n'))
  }

  fs.writeFileSync(path, rows.join('\n'))
}
