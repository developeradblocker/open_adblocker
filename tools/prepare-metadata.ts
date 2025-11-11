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
import { Group, groupsMapper } from './mappers/groups.mapper'
import { Filter, filtersMapper } from './mappers/filters.mapper'
import { MetadataRuleSet } from '@adguard/tsurlfilter/es/declarative-converter'
import { promises as fs } from 'fs'
import { METADATA_PATH } from '../constants'
interface Metadata {
  groups: Group[]
  filters: Filter[]
}

export const prepareMetadata = async (metadata: MetadataRuleSet): Promise<void> => {
  const info = metadata.getAdditionalProperty('metadata') as Metadata
  if (!info?.groups?.length || !info?.filters?.length) {
    throw new Error('Groups and filters are not defined!')
  }

  const groups = groupsMapper(info.groups)
  // console.log(groups, info.groups)
  const filters = filtersMapper(info.filters)
  metadata.setAdditionalProperty('metadata', {
    ...info,
    groups,
    filters
  })

  await fs.writeFile(
      `app/${METADATA_PATH}`,
      metadata.serialize(true)
  )
}
