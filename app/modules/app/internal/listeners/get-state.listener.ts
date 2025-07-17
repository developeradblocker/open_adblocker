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

import { AppMessageListener } from '@/utils/dispatcher/dispatcher.types'
import { AppGetStateMessage, AppMessages } from '../../common/app.messages'
import { inject, injectable } from '../../../../utils/di/di.types'
import { AppState } from '../../common/app.types'
import { InternalAppIdentifiers, InternalAppServiceInterface } from '@/modules/app/internal/app.types'

@injectable()
export class GetStateListener implements AppMessageListener<AppGetStateMessage, AppState> {
  constructor (
    @inject(InternalAppIdentifiers.service)
    private readonly service: InternalAppServiceInterface
  ) {
  }

  on (): AppMessages.getState {
    return AppMessages.getState
  }

  main (): true {
    return true
  }

  async handle (): Promise<AppState> {
    return await this.service.getState()
  }
}
