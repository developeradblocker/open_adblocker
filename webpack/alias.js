/**
 * REPLACE_WITH_OUR_LICENSE
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const aliases = {
  '@': path.resolve(__dirname, '../', './app')
}
