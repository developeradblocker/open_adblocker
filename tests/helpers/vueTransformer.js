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

/**
 * Custom Vue transformer that wraps @vue/vue3-jest and fixes a bug where
 * template render code is emitted as ESM instead of CJS.
 *
 * In @vue/vue3-jest's processTemplate, `transpileModule(code, { tsconfig })`
 * wraps the config in an extra object, so compilerOptions are ignored.
 * TypeScript 6 defaults to ESM output, causing `export` tokens that Jest
 * cannot parse.  This wrapper re-transpiles any surviving ESM to CJS.
 */
import vueJest from '@vue/vue3-jest'
import typescript from 'typescript'

/**
 * Convert the ESM template portion of @vue/vue3-jest output to CJS.
 *
 * The upstream bug (`transpileModule(code, { tsconfig })` wraps config in
 * an extra object) means template output retains ESM syntax.  With TS 6
 * the default target is ESNext so `export`/`import` survive unchanged.
 *
 * Because generateCode concatenates already-CJS script output with raw ESM
 * template output, we cannot blindly re-transpile the whole blob.  Instead
 * we locate the ESM template block appended at the end and transpile only
 * that section.
 */
function fixTemplateEsm (code) {
  // Template portion starts with `import { … } from "vue"` appended after
  // the CJS script output.  Find the LAST top-level `import` from "vue".
  const templateImportRe = /import\s*\{[^}]+\}\s*from\s*"vue"\s*;?/g
  let lastImportMatch = null
  let m
  while ((m = templateImportRe.exec(code)) !== null) {
    lastImportMatch = m
  }
  if (!lastImportMatch) return null

  const splitIdx = lastImportMatch.index
  const cjsPart = code.substring(0, splitIdx)
  const esmPart = code.substring(splitIdx)

  const { outputText } = typescript.transpileModule(esmPart, {
    compilerOptions: {
      target: typescript.ScriptTarget.ES5,
      module: typescript.ModuleKind.CommonJS,
      esModuleInterop: true
    }
  })

  let fixed = cjsPart + outputText

  // @vue/vue3-jest's generateCode merges render into exports.default only
  // when it finds 'exports.render = render;' in the output.  Because of
  // the upstream bug the template was still ESM at that point, so the
  // merge never happened.  Re-attach render here after our CJS conversion.
  if (fixed.includes('exports.render = render;') &&
      !fixed.includes('exports.default = {...exports.default, render}')) {
    fixed += '\n;exports.default = {...exports.default, render};'
  }

  return fixed
}

export default {
  process (src, filename, config) {
    const result = vueJest.process(src, filename, config)

    const code = typeof result === 'string' ? result : result.code
    if (code && /\bexport\b/.test(code)) {
      const fixed = fixTemplateEsm(code)
      if (fixed) {
        return { code: fixed, map: result.map }
      }
    }

    return result
  }
}
