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
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import HomePage from '@/ui/toolbar-popup/pages/home.page.vue'
import MenuPage from '@/ui/toolbar-popup/pages/menu.page.vue'
import RateUsPage from '@/ui/toolbar-popup/pages/rate-us.page.vue'
import InitPage from '@/ui/toolbar-popup/pages/init.page.vue'

export const routes: RouteRecordRaw[] = [
  {
    name: ROUTE.INIT,
    path: '/',
    component: InitPage
  },
  {
    name: ROUTE.HOME,
    path: '/home',
    component: HomePage
  },
  {
    name: ROUTE.MENU,
    path: '/menu',
    component: MenuPage
  },
  {
    name: ROUTE.RATE_US,
    path: '/rate-us',
    component: RateUsPage
  }
]
