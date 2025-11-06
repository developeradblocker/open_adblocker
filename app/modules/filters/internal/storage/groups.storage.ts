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
import { makeDataAccessor } from '@/utils/storage/make-data-accessor'
import { GroupId } from '@/modules/filters/common/filters.types'
import { DEFAULT_ENABLED_GROUPS_IDS } from '../../../../../constants.js'

export class GroupsStorage {
  private readonly storage = makeDataAccessor<GroupId[]>(
    'local',
    'ENABLED_GROUPS',
    {
      useCache: false,
      default: DEFAULT_ENABLED_GROUPS_IDS
    })

  async setup (groups: GroupId[]): Promise<void> {
    await this.storage.write(groups)
  }

  async enable (id: GroupId): Promise<GroupId[]> {
    const enabledGroups = await this.get()
    if (enabledGroups.includes(id)) {
      return enabledGroups
    }

    enabledGroups.push(id)
    await this.storage.write(enabledGroups)
    return enabledGroups
  }

  async disable (id: GroupId): Promise<GroupId[]> {
    const enabledGroups = (await this.get())
      .filter((groupId: GroupId) => groupId !== id)

    await this.storage.write(enabledGroups)
    return enabledGroups
  }

  async get (): Promise<GroupId[]> {
    return await this.storage.read()
  }
}
