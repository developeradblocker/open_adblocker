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
import { SnackbarProps } from '@/ui/shared/components/snackbar/base-snackbar.types'

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
        },
        userRules: []
      },
      metadata: {
        filters: [],
        groups: []
      }
    } satisfies OpenADBSettings,
    showLoader: false,
    snackbar: null as SnackbarProps
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
    },
    stringWhiteList (): string {
      return this.settings.filters?.whiteList?.domains.join('\n')
    },
    userRules (): string[] {
      return this.settings.filters?.userRules
    },
    stringUserRules (): string {
      return this.settings.filters?.userRules.join('\n')
    }
  },
  actions: {
    setSettingsInfo (payload: OpenADBSettings): void {
      this.settings = {
        ...this.settings,
        ...payload
      }
    },

    setShowLoader (visible: boolean): void {
      this.showLoader = visible
      visible ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll')
    },

    setSnackbar (snackbar: SnackbarProps | null): void {
      this.snackbar = snackbar
    },

    resetSnackbar (): void {
      this.snackbar = null
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
