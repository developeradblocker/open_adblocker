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

import { type RouteRecordRaw } from 'vue-router'
import GeneralPage from '@/ui/settings/pages/general.page.vue'
import FiltersPage from '@/ui/settings/pages/filters.page.vue'
import GroupsPage from '@/ui/settings/pages/groups.page.vue'
import UserRulesPage from '@/ui/settings/pages/user-rules.page.vue'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'
import WhitelistPage from '@/ui/settings/pages/whitelist.page.vue'

export const routes: RouteRecordRaw[] = [
  {
    name: SETTINGS_ROUTE.GENERAL,
    path: '/',
    component: GeneralPage
  },
  {
    name: SETTINGS_ROUTE.GROUPS,
    path: '/groups',
    component: GroupsPage
  },
  {
    name: SETTINGS_ROUTE.FILTERS,
    path: '/groups/:id',
    component: FiltersPage,
    props: true
  },
  {
    name: SETTINGS_ROUTE.USERRULES,
    path: '/user-rules',
    component: UserRulesPage
  },
  {
    name: SETTINGS_ROUTE.WHITELIST,
    path: '/whitelist',
    component: WhitelistPage
  }
]
