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

import { defineStore } from 'pinia'
import { FilterMetadata, GroupMetadata, OpenADBSettings } from '@/modules/settings/common/settings.types'
import { FilterId } from '@/modules/filters/common/filters.types'
import { Domain } from '@/common/types'

export const useSettingsStore = defineStore('SettingsStore', {
  state: () => ({
    settings: {
      general: {
        cookieCleaner: false,
        webRTC: false
      },
      filters: {
        enabledFilters: [],
        whiteList: {
          domains: []
        }
      },
      metadata: {
        filters: [],
        groups: []
      }
    } satisfies OpenADBSettings
  }),

  getters: {
    filters (): FilterMetadata[] {
      return this.settings?.metadata?.filters?.sort((a, b) => a.displayNumber - b.displayNumber) ?? []
    },

    groups (): GroupMetadata[] {
      return this.settings?.metadata?.groups?.sort((a, b) => a.displayNumber - b.displayNumber) ?? []
    },
    enabledFilters (): FilterId[] {
      return this.settings.filters?.enabledFilters
    },
    whiteList (): Domain[] {
      return this.settings.filters?.whiteList?.domains
    }
  },
  actions: {
    setSettingsInfo (payload: OpenADBSettings): void {
      this.settings = {
        ...this.settings,
        ...payload
      }
    },

    toggleFilter (filterId: FilterId): void {
      const enabled = this.settings.filters.enabledFilters.includes(filterId)
      if (enabled) {
        this.settings.filters.enabledFilters = this.settings.filters.enabledFilters.filter(id => id !== filterId)
        return
      }
      this.settings.filters.enabledFilters.push(filterId)
    }
  }
})
