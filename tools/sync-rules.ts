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

import { AssetsLoader } from '@adguard/dnr-rulesets'
import { extractPreprocessedRawFilterList, readMetadataRuleSet } from './filter-extractor'
import { CosmeticRuleType, FilterListParser, RuleCategory } from '@adguard/agtree'
import { defaultParserOptions } from '@adguard/agtree/parser'
import { CosmeticRuleBodyGenerator } from '@adguard/agtree/generator'
import { updateLocalScriptRulesForChromiumMv3 } from './update-local-script-rules'
import { findDangerousRules } from './dangerous-rules'

const FILTERS_DIR = 'app/filters'

const downloadAssets = async (): Promise<void> => {
  console.log('Downloading assets...')
  const loader = new AssetsLoader()
  await loader.load(FILTERS_DIR)
  console.log('Assets are downloaded')
}

export const updateResources = async (): Promise<void> => {
  console.log('Updating local script rules...')
  const folder = `${FILTERS_DIR}/declarative/`
  const metadataRuleSet = await readMetadataRuleSet(folder)
  const ruleSetIds = metadataRuleSet.getRuleSetIds()
  const jsRules: Set<string> = new Set()

  for (const ruleSetId of ruleSetIds) {
    const rawFilterList = await extractPreprocessedRawFilterList(ruleSetId, folder)
    const filterListNode = FilterListParser.parse(rawFilterList, {
      ...defaultParserOptions,
      includeRaws: false,
      isLocIncluded: false,
      tolerant: true
    })

    filterListNode.children.forEach((ruleNode) => {
      if (
        ruleNode.category === RuleCategory.Cosmetic &&
        ruleNode.type === CosmeticRuleType.JsInjectionRule
      ) {
        const rawBody = CosmeticRuleBodyGenerator.generate(ruleNode)
        jsRules.add(rawBody)
      }
    })
  }

  await updateLocalScriptRulesForChromiumMv3(jsRules)
  console.log('Local script rules are updated')
}

const syncRules = async (): Promise<void> => {
  await downloadAssets()
  await updateResources()

  if (process.env.OPENAI_API_KEY) {
    console.log('Finding dangerous rules...')
    await findDangerousRules(process.env.OPENAI_API_KEY)
    console.log('Dangerous rules check completed')
  } else {
    console.log('OpenAI API key is not provided, skipping dangerous rules check')
  }
}

(async (): Promise<void> => {
  await syncRules()
})()
