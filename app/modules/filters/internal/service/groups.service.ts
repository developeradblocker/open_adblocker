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
import { GroupId } from '@/modules/filters/common/filters.types'
import { inject, injectable } from '@/utils/di/di.types'
import {
  GroupsServiceInterface,
  InternalFiltersIdentifiers,
  MetadataServiceInterface
} from '@/modules/filters/internal/filters.types'
import { GroupsStorage } from '@/modules/filters/internal/storage/groups.storage'

@injectable()
export class GroupsService implements GroupsServiceInterface {
  constructor (
    @inject(InternalFiltersIdentifiers._groupsStorage)
    private readonly storage: GroupsStorage,

    @inject(InternalFiltersIdentifiers.metadata)
    private readonly metadata: MetadataServiceInterface
  ) {}

  async setup (groups: GroupId[]): Promise<void> {
    const filteredGroups: GroupId[] = []
    for (const groupId of groups) {
      if (filteredGroups.includes(groupId)) {
        continue
      }

      if (!(await this.isSupported(groupId))) {
        continue
      }
      // TODO: check validations
      filteredGroups.push(groupId)
    }

    await this.storage.setup(filteredGroups)
  }

  async toggle (groupId: GroupId): Promise<void> {
    const enabledGroups = await this.storage.get()

    if (enabledGroups.includes(groupId)) {
      await this.storage.disable(groupId)
    } else {
      await this.storage.enable(groupId)
    }
  }

  async isEnabled (groupId: GroupId): Promise<boolean> {
    const enabledGroups = await this.storage.get()
    return enabledGroups.includes(Number(groupId))
  }

  async getEnabledGroups (): Promise<number[]> {
    return await this.storage.get()
  }

  private async isSupported (groupId: GroupId): Promise<boolean> {
    const supportedGroupIds = (await this.metadata.getGroups()).map((group) => group.groupId)

    return supportedGroupIds.includes(groupId)
  }
}
