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
import { TsWebExtension } from '@adguard/tswebextension/mv3'
import { localScriptRules } from '@/filters/local_script_rules'
import { DEFAULT_EXTENSION_CONFIG } from '@/modules/aguard/internal/constants'
import { ConfigurationMV3 } from '@adguard/tswebextension/dist/types/lib/mv3/background/configuration'
import { dispatcher } from '@/utils/setup-worker'
import { AdGuardIdentifiers } from '@/modules/aguard/internal/adguaird.types'
import { AdGuardService } from '@/modules/aguard/internal/services/adguard.service'
import { AdGuardMessages, AdGuardOnReadyMessage } from '@/modules/aguard/common/adguard.messages'
import { whiteList } from '@/modules/whitelist/internal/utils'
import { Injection } from '@/utils/inject/inject.types'
import { inject } from '@/utils/inject/inject'
import { useInternalFilters } from '@/modules/filters/internal/filters.utils'
import { FiltersStateChangedListener } from '@/modules/aguard/internal/listeners/filters/filters-state-changed.listener'
import { useInternalWebRTC } from '@/modules/features/web-rtc/internal/web-rtc.utils'
import { WebRTCStateChangedListener } from '@/modules/aguard/internal/listeners/web-rtc/web-rtc-state-changed.listener'
import { RulesUpdatedListener } from '@/modules/aguard/internal/listeners/user-rules/rules-updated.listener'
import { FilterListPreprocessor } from '@adguard/tsurlfilter'
import { useInternalManualBlocking } from '@/modules/features/manual-blocking/internal/manual-blocking.setup'

const injections: Injection[] = [
  {
    key: AdGuardIdentifiers.adGuardService,
    use: AdGuardService
  }
]

export const setupAdGuard = (): void => {
  TsWebExtension.setLocalScriptRules(localScriptRules)
  adGuardSetupAsync()
}

const adGuardSetupAsync = async (): Promise<void> => {
  const tsWebExtension = new TsWebExtension('/web-accessible-resources')
  await tsWebExtension.initStorage()
  const config = await getConfiguration()
  await tsWebExtension.start(config)
  setUpTsWebExtensionMessages(tsWebExtension)
  injections.push({
    key: AdGuardIdentifiers._config,
    use: config,
    value: true
  })
  injections.push({
    key: AdGuardIdentifiers._tsWebExtension,
    use: tsWebExtension,
    value: true
  })
  inject(injections)
  dispatcher().onWithClass(FiltersStateChangedListener)
  dispatcher().onWithClass(WebRTCStateChangedListener)
  dispatcher().onWithClass(RulesUpdatedListener)
  const message: AdGuardOnReadyMessage = {
    type: AdGuardMessages.ready,
    force: true
  }
  await dispatcher().sendMessage(message)
}

export const getConfiguration = async (): Promise<ConfigurationMV3> => {
  const config = DEFAULT_EXTENSION_CONFIG()
  config.allowlist = await whiteList().getDomains()
  config.staticFiltersIds = await useInternalFilters().getEnabledFilters()
  config.settings.stealth.blockWebRTC = await useInternalWebRTC().getState()
  config.userrules = Object.assign(
    FilterListPreprocessor.preprocess(
      (await useInternalManualBlocking().getUserRules()).join('\n')
    ),
    { trusted: true }
  )
  return config
}

/**
 * To enable message handling from tsWebExtension content script
 * @param tsWebExtension {TsWebExtension} - the TsWebExtension instance
 */
const setUpTsWebExtensionMessages = (tsWebExtension: TsWebExtension): void => {
  const messageHandler = tsWebExtension.getMessageHandler()

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    messageHandler(message, sender)
      .then(res => sendResponse(res))

    return true
  })
}
