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
import zod from 'zod'

export interface SettingsInterface {
  export: () => Promise<OpenADBSettings>
  import: (content: string) => Promise<boolean>
}

export const SETTINGS_VERSION = '1.0'

const generalSchema = zod.object({
  cookieCleaner: zod.boolean(),
  webRTC: zod.boolean()
})

const whiteListSchema = zod.object({
  domains: zod.array(zod.string())
})

const filtersSchema = zod.object({
  enabledFilters: zod.array(zod.number().int()),
  enabledGroups: zod.array(zod.number().int()).optional(),
  whiteList: whiteListSchema
})

export const settingsSchema = zod.object({
  version: zod.literal(SETTINGS_VERSION),
  general: generalSchema,
  filters: filtersSchema
})

export type GeneralSettings = zod.infer<typeof generalSchema>
export type WhiteListSettings = zod.infer<typeof whiteListSchema>

export type FiltersSettings = zod.infer<typeof filtersSchema>

export type OpenADBSettings = zod.infer<typeof settingsSchema>
