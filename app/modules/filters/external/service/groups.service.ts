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
import { injectable } from '@/utils/di/di.types'
import { GroupId, GroupsBaseInterface } from '@/modules/filters/common/filters.types'
import {
  FiltersMessages,
  ToggleGroupMessage
} from '@/modules/filters/common/filters.messages'
import { useExternalPort } from '@/modules/port/external/port.setup'
import { ExternalPortChannel } from '@/modules/port/external/port.types'

@injectable()
export class GroupsService implements GroupsBaseInterface {
  private readonly port: ExternalPortChannel
  constructor () {
    this.port = useExternalPort()
  }

  async toggle (id: GroupId): Promise<void> {
    const message: ToggleGroupMessage = {
      type: FiltersMessages.toggleGroup,
      payload: { id }
    }

    await this.port.sendMessage(message)
  }
}
