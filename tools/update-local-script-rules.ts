/**
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */
import { CosmeticRuleParser, CosmeticRuleType, RuleCategory } from '@adguard/agtree'
import { CosmeticRuleBodyGenerator } from '@adguard/agtree/generator'
import { minify } from 'terser'
import crypto from 'node:crypto'
import assert from 'node:assert'
import { exec as execCallback } from 'node:child_process'
import { promisify } from 'node:util'
import { promises as fs } from 'node:fs'

// Add these helper functions after imports
const AG_FUNCTION_REGEX = /var\s+(AG_[a-zA-Z0-9_]+)\s*=\s*function/
const AG_USAGE_REGEX = /AG_[a-zA-Z0-9_]+/g

const LF = '\n'

/**
 * File where JS rules from the pre-built filters are saved.
 */
const LOCAL_SCRIPT_RULES_FILE_NAME = 'local_script_rules.js'

export const LOCAL_SCRIPT_RULES_COMMENT_CHROME_MV3 = ` To fully comply with Chrome Web Store policies regarding remote code execution,
 we implement a strict security-focused approach for JavaScript rule execution:

 1. For standard users (default mode):
    - We collect and pre-build script rules from the filters and statically bundle
      them into the extension - STEP 1. See 'updateLocalResourcesForChromiumMv3' in our build tools.
    - These pre-verified local scripts are passed to the engine - STEP 2.
    - At runtime, we check if each script rule is included in our local scripts list (STEP 3).
    - Only pre-verified local scripts are executed via chrome.scripting API (STEP 4.1 and 4.2).
      All other scripts are discarded.

 2. For advanced users with developer mode explicitly enabled:
    - JavaScript rules from custom filters can be executed using the browser's built-in
      userScripts API (STEP 4.3), which provides a secure sandbox.
    - This execution bypasses the local script verification process but remains
      isolated and secure through Chrome's native sandboxing.
    - This mode requires explicit user activation and is intended for advanced users only.

 This dual-path implementation ensures perfect compliance with Chrome Web Store policies
 while providing necessary functionality for users with different needs.`

const exec = promisify(execCallback)

export const updateLocalScriptRulesForChromiumMv3 = async (jsRules: Set<string>): Promise<void> => {
  /**
   * This is a test case rule that is used for integration testing.
   * It should be added explicitly to the list of rules.
   *
   * @see {@link https://testcases.agrd.dev/Filters/generichide-rules/generichide-rules.txt}
   * @see {@link https://testcases.agrd.dev/Filters/injection-speed/test-injection-speed.txt}
   */
  const TESTCASES_RULES = [
    'testcases.agrd.dev,pages.dev#%#!function(){let e=()=>{document.querySelector("#case-1-generichide > .test-banner1").style.width="200px"};"complete"===document.readyState?e():window.document.addEventListener("readystatechange",e)}();',
    // https://testcases.agrd.dev/Filters/injection-speed/test-injection-speed.txt
    "testcases.agrd.dev,pages.dev#%#console.log(Date.now(), 'script rule is executed');"
  ]

  TESTCASES_RULES.forEach((rawRule) => {
    const ruleNode = CosmeticRuleParser.parse(rawRule)
    if (!ruleNode ||
      ruleNode.category !== RuleCategory.Cosmetic ||
      ruleNode.type !== CosmeticRuleType.JsInjectionRule) {
      throw new Error('Invalid test rule, expected JS rule')
    }
    const rawBody = CosmeticRuleBodyGenerator.generate(ruleNode)
    jsRules.add(rawBody)
  })

  const processedRules: string[] = []
  const errors: string[] = []
  const agFunctions: Map<string, string> = new Map()

  // First pass: extract AG_ functions
  jsRules.forEach((rule) => {
    const agFunctionName = extractAgFunctionName(rule)
    if (agFunctionName) {
      agFunctions.set(agFunctionName, rule)
      // Remove this rule from further processing as it's a utility function
      jsRules.delete(rule)
    }
  })

  // Second pass: process remaining rules
  for (const rule of jsRules) {
    try {
      const ruleKey = JSON.stringify(rule)
      let processedCode = rule

      // Check if this rule uses any AG_ functions
      const usedAgFunctions = findAgFunctionUsages(rule)
      if (usedAgFunctions.length > 0) {
        // Simply prepend the required AG functions to the rule
        const requiredFunctions: string[] = []
        usedAgFunctions.forEach((funcName) => {
          const code = agFunctions.get(funcName)
          if (code) {
            requiredFunctions.push(code)
          }
        })

        // insert required functions before the rule to make sure they are available
        processedCode = `${requiredFunctions.join(LF)}${LF}${rule}`
      }

      /**
       * Unique ID is needed to prevent multiple execution of the same script.
       *
       * It may happen when script rules are being applied on WebRequest.onResponseStarted
       * and WebNavigation.onCommitted events which are independent of each other,
       * so we need to make sure that the script is executed only once.
       */
      const uniqueId = calculateUniqueId(rule)

      // wrap the code with a try-catch block with extra checking to avoid multiple executions
      processedCode = wrapScriptCode(uniqueId, processedCode)

      const minified = await minify(processedCode, {
        compress: {
          sequences: false
        },
        parse: {
          bare_returns: true
        },
        format: {
          beautify: true,
          indent_level: 4
        }
      })

      if (minified.code) {
        processedRules.push(`${ruleKey}: () => {${minified.code}}`)
      } else {
        errors.push(`Was not able to minify rule: ${rule}`)
      }
    } catch (error) {
      errors.push(
        `Skipping invalid rule: ${rule}; Error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  const jsFileContent = `${beautifyComment(LOCAL_SCRIPT_RULES_COMMENT_CHROME_MV3)}
export const localScriptRules = { ${processedRules.join(`,${LF}`)} };${LF}`

  await saveToJsFile(jsFileContent, LOCAL_SCRIPT_RULES_FILE_NAME)
}

const extractAgFunctionName = (code: string): string | null => {
  const match = code.match(AG_FUNCTION_REGEX)

  if (!match) {
    return null
  }

  return match[1] || null
}

const findAgFunctionUsages = (code: string): string[] => {
  const matches = code.match(AG_USAGE_REGEX) || []
  // @ts-ignore
  return [...new Set(matches)]
}

/**
 * Calculates unique ID for the text.
 *
 * @param text Text to calculate unique ID for.
 *
 * @returns Unique ID.
 */
const calculateUniqueId = (text: string): string => {
  return crypto.createHash('md5').update(text).digest('hex')
}

/**
 * Wraps the script code with a try-catch block and a check to avoid multiple executions of it.
 *
 * @param uniqueId Unique ID for the script.
 * @param code Script code.
 *
 * @returns Wrapped script code.
 */
const wrapScriptCode = (uniqueId: string, code: string): string => {
  return `
        try {
            const flag = 'done';
            if (Window.prototype.toString["${uniqueId}"] === flag) {
                return;
            }
            ${code}
            Object.defineProperty(Window.prototype.toString, "${uniqueId}", {
                value: flag,
                enumerable: false,
                writable: false,
                configurable: false
            });
        } catch (error) {
            console.error('Error executing AG js rule with uniqueId "${uniqueId}" due to: ' + error);
        }
    `
}

/**
 * Beautifies a raw js-file content, saves it to the file and runs validation.
 *
 * @param rawContent Raw content.
 * @param fileName JS file name.
 */
const saveToJsFile = async (rawContent: string, fileName: string): Promise<void> => {
  const beautifiedJsContent = (await minify(rawContent, {
    mangle: false,
    compress: false,
    format: {
      beautify: true,
      comments: true,
      indent_level: 4
    }
  })).code

  if (!beautifiedJsContent) {
    throw new Error(`Failed to minify JS content for saving to ${fileName}`)
  }

  try {
    await fs.writeFile(
      `app/filters/${fileName}`,
      beautifiedJsContent
    )

    // Run validation with ES modules support
    const result = await exec(
      `npx tsx app/filters/${fileName}`
    )
    assert.ok(result.stderr === '', 'No errors during execution')
    assert.ok(result.stdout === '', 'No output during execution')
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

/**
 * Beautifies a raw comment into a JS multi-line comment.
 *
 * @param rawComment Raw comment.
 *
 * @returns Beautified comment.
 */
const beautifyComment = (rawComment: string): string => {
  return `/**
${rawComment.split(LF).map((line) => (line ? ` * ${line}` : ' *')).join(LF)}
 */`
}
