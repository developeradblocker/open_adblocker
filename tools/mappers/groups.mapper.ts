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
export interface Group {
  groupId: number
  groupName: string
  groupDescription: string
}

const GROUP_MAP: Record<number, Group> = {
  1: {
    groupId: 1,
    groupName: 'Ad blocking',
    groupDescription: 'Blocks ads'
  },
  2: {
    groupId: 2,
    groupName: 'Privacy',
    groupDescription: 'Blocks trackers'
  },
  3: {
    groupId: 3,
    groupName: 'Social widgets',
    groupDescription: 'Blocks social media elements, such as Like and Share buttons'
  },
  4: {
    groupId: 4,
    groupName: 'Pop-ups',
    groupDescription: 'Blocks annoying web elements, such as cookie notices or in-page popups'
  },
  5: {
    groupId: 5,
    groupName: 'Security',
    groupDescription: 'Blocks requests to phishing and malicious websites'
  },
  6: {
    groupId: 6,
    groupName: 'Other',
    groupDescription: "This group contains various filters that don't fit into other categories"
  },
  7: {
    groupId: 7,
    groupName: 'Language-specific',
    groupDescription: 'Blocks ads on websites in specified languages'
  }
}
export const groupsMapper = (groups: Group[]): Group[] => {
  return groups.map(({ groupId, ...group }) => {
    const mapped = GROUP_MAP[groupId]
    if (!mapped) {
      return null
    }
    return ({
      ...group,
      groupId,
      groupName: mapped.groupName,
      groupDescription: mapped.groupDescription
    })
  }).filter(Boolean)
}
