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
import {
  filterMetadataValidator,
  groupMetadataValidator
} from '@/modules/filters/common/filters.types'

export interface SettingsInterface {
  export: () => Promise<ExportedSettings>
  import: (content: string) => Promise<boolean>
  get: () => Promise<OpenADBSettings>
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

export const baseSettingsSchema = zod.object({
  general: generalSchema,
  filters: filtersSchema
})
export const settingsSchema = baseSettingsSchema.extend({
  version: zod.literal(SETTINGS_VERSION)
}).merge(baseSettingsSchema)

export type GeneralSettings = zod.infer<typeof generalSchema>
export type WhiteListSettings = zod.infer<typeof whiteListSchema>
export type FiltersSettings = zod.infer<typeof filtersSchema>
export type ExportedSettings = zod.infer<typeof settingsSchema>

export const openADBSettingsSchema = baseSettingsSchema.extend({
  metadata: zod.object({
    filters: filterMetadataValidator.array(),
    groups: groupMetadataValidator.array()
  })
})
export type OpenADBSettings = zod.infer<typeof openADBSettingsSchema>
