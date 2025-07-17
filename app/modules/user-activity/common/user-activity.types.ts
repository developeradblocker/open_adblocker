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
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'

export type ClickEventToLink = string
export enum ClickEventToAction {
  openMenu = 'open_menu_action',
  closePage = 'close_page_action',
  pause = 'pause_action',
  play = 'play_action'
}

export enum UserActivityType {
  click = 'click',
  visitPage = 'visitPage',
}

export enum ElementsUI {
  // buttons
  adblockerToggle = 'adblocker_toggle',
  menu = 'menu',
  close = 'close',
  // elements
  rateUsButton = 'rate_us_button',
  logo = 'logo',
  about = 'about',
  privacy = 'privacy',
  terms = 'terms'
}

export type PageUI = ROUTE

export type UserActivity =
 | UserClickActivity<BaseUserClickPayload>
 | UserPageVisited

export interface BaseUserClickPayload {
  page: PageUI
  to: ClickEventToLink | ClickEventToAction
}

export interface UserClickActivity<T extends BaseUserClickPayload> {
  sessionId: string
  type: UserActivityType.click
  element: ElementsUI
  payload?: T
}

export interface UserPageVisited {
  sessionId: string
  type: UserActivityType.visitPage
  page: PageUI
}

export interface UserActivityInterface {
  visitPage: (page: PageUI) => Promise<void>
  click: <T extends BaseUserClickPayload>(element: ElementsUI, payload?: T) => Promise<void>
}
