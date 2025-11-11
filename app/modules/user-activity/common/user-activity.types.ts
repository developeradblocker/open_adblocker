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
import { POPUP_ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'
import { ImportErrorReason } from '@/ui/settings/utils/import-data'

export type ClickEventToLink = string
export enum ClickEventToAction {
  openMenu = 'open_menu_action',
  closePage = 'close_page_action',
  pause = 'pause_action',
  play = 'play_action',
  filterBack = 'filter_back',
  openGroup = 'open_group',
  openSettings = 'open_settings',
  importSettings = 'import_settings',
  exportSettings = 'export_settings'
}

export enum UserActivityType {
  click = 'click',
  visitPage = 'visitPage',
  toggle = 'toggle',
  settingsImportError = 'settings_import_error'
}

export enum ElementsUI {
  // buttons
  adblockerToggle = 'adblocker_toggle',
  menu = 'menu',
  close = 'close',
  // elements
  rateUsButton = 'rate_us_button',
  rateUsReminder = 'remind_later',
  logo = 'logo',
  about = 'about',
  privacy = 'privacy',
  terms = 'terms',
  webRtc = 'web_rtc',
  cookieCleaner = 'cookie_cleaner',
  filterBack = 'filter_back',
  settings = 'settings',
  importSettings = 'import_settings',
  exportSettings = 'export_settings',
  githubButton = 'github_button',
  websiteButton = 'website_button'
}

export type PageUI = POPUP_ROUTE | SETTINGS_ROUTE

export interface BaseUserActivity {
  sessionId: string
  type: UserActivityType
}

export type ElementID = ElementsUI | string

export type UserActivity =
 | UserClickActivity<BaseUserClickPayload>
 | UserPageVisited
 | UserToggleActivity
 | SettingsImportErrorActivity

export interface BaseUserClickPayload {
  page: PageUI
  to: ClickEventToLink | ClickEventToAction
}

export interface UserClickActivity<T extends BaseUserClickPayload> extends BaseUserActivity {
  type: UserActivityType.click
  element: ElementID
  payload?: T
}

export interface UserPageVisited extends BaseUserActivity {
  type: UserActivityType.visitPage
  page: PageUI
}

export interface SettingsImportErrorActivity extends BaseUserActivity {
  type: UserActivityType.settingsImportError
  reason: ImportErrorReason
}

export interface UserToggleActivity extends BaseUserActivity {
  type: UserActivityType.toggle
  element: ElementID
  action: boolean
}

export interface UserActivityInterface {
  visitPage: (page: PageUI) => Promise<void>
  toggle: (toggleId: ElementID, state: boolean) => Promise<void>
  click: <T extends BaseUserClickPayload>(element: ElementID, payload?: T) => Promise<void>
  settingsImportError: (reason: ImportErrorReason) => Promise<void>
}
