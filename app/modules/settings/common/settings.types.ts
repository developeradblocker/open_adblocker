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

export const filterMetadataValidator = zod.object({
  description: zod.string(),
  displayNumber: zod.number(),
  expires: zod.number(),
  filterId: zod.number(),
  groupId: zod.number(),
  homepage: zod.string(),
  name: zod.string(),
  tags: zod.number().array(),
  version: zod.string(),
  diffPath: zod.string().optional(),
  languages: zod.string().array(),
  timeAdded: zod.string(),
  timeUpdated: zod.string(),
  subscriptionUrl: zod.string(),
  deprecated: zod.boolean().optional()
})
export const groupMetadataValidator = zod.object({
  displayNumber: zod.number(),
  groupId: zod.number(),
  groupName: zod.string(),
  groupDescription: zod.string()
})
export const tagMetadataValidator = zod.object({
  tagId: zod.number(),
  keyword: zod.string(),
  description: zod.string().optional(),
  name: zod.string().optional()
})
export type GroupMetadata = zod.infer<typeof groupMetadataValidator>
export type FilterMetadata = zod.infer<typeof filterMetadataValidator>
export const metadataValidator = zod.object({
  version: zod.string().optional(),
  versionTimestampMs: zod.number().optional(),
  metadata: zod.object({
    filters: filterMetadataValidator.array(),
    groups: groupMetadataValidator.array(),
    tags: tagMetadataValidator.array()
  })
})
export type Metadata = zod.infer<typeof metadataValidator>
export const openADBSettingsSchema = baseSettingsSchema.extend({
  metadata: zod.object({
    filters: filterMetadataValidator.array(),
    groups: groupMetadataValidator.array()
  })
})
export type OpenADBSettings = zod.infer<typeof openADBSettingsSchema>

export interface MetadataServiceInterface {
  getMetadata: () => Promise<Metadata>
  getFilters: () => Promise<FilterMetadata[]>
  updateMetadata: () => Promise<void>
}
