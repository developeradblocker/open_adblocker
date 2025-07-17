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
import { inject, injectable } from 'inversify'
import {
  BaseUserClickPayload,
  ElementsUI,
  PageUI,
  UserActivityInterface,
  UserActivityType,
  UserClickActivity,
  UserPageVisited
} from '@/modules/user-activity/common/user-activity.types'
import { useExternalPort } from '@/modules/port/external/port.setup'
import { ExternalPortChannel } from '@/modules/port/external/port.types'
import { UserActivityMessage, UserActivityMessages } from '@/modules/user-activity/common/user-activity.messages'
import { UserActivityIdentifiers } from '@/modules/user-activity/external/user-activity.types'

@injectable()
export class UserActivityService implements UserActivityInterface {
  private readonly port: ExternalPortChannel
  constructor (
    @inject(UserActivityIdentifiers.sessionId)
    private readonly sessionId: string
  ) {
    this.port = useExternalPort()
  }

  async visitPage (page: PageUI): Promise<void> {
    const activity: UserPageVisited = {
      sessionId: this.sessionId,
      type: UserActivityType.visitPage,
      page
    }
    const message: UserActivityMessage = {
      type: UserActivityMessages.activity,
      payload: activity
    }

    await this.port.sendMessage(message)
  }

  async click<T extends BaseUserClickPayload> (element: ElementsUI, payload?: T): Promise<void> {
    const activity: UserClickActivity<T> = {
      sessionId: this.sessionId,
      type: UserActivityType.click,
      element,
      payload
    }
    const message: UserActivityMessage = {
      type: UserActivityMessages.activity,
      payload: activity
    }

    await this.port.sendMessage(message)
  }
}
