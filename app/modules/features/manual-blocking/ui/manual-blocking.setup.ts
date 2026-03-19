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
import { inject } from '@/utils/inject/inject'
import { UIManualBlockingIdentifiers } from '@/modules/features/manual-blocking/ui/manual-blocking.types'
import { ManualBlockingService } from '@/modules/features/manual-blocking/ui/services/manual-blocking.service'
import { di, dispatcher } from '@/utils/setup-worker'
import { ElementSelectedListener } from '@/modules/features/manual-blocking/ui/listeners/element-selected.listener'
import { AddRuleListener } from '@/modules/features/manual-blocking/ui/listeners/add-rule.listener'

export const setupUIManualBlocking = (): void => {
  inject([
    {
      key: UIManualBlockingIdentifiers.service,
      use: ManualBlockingService
    }
  ])

  dispatcher().onWithClass(ElementSelectedListener)
  dispatcher().onWithClass(AddRuleListener)
}

export const useUIManualBlocking = (): ManualBlockingService => di.get(UIManualBlockingIdentifiers.service)
