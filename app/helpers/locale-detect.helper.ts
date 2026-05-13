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
import { FilterMetadata } from '@/modules/settings/common/settings.types'
import { FilterId } from '@/modules/filters/common/filters.types'

const normalizeLanguageCode = (locale: string): string => locale.toLowerCase().replace('-', '_')

const findLocaleMatch = (filterLanguages: string[], locale: string): string | null => {
  const normalizedFilterLanguages = filterLanguages.map((l) => normalizeLanguageCode(l))
  const lang = normalizeLanguageCode(locale)

  if (normalizedFilterLanguages.includes(lang)) {
    return lang
  }

  const [localePart] = lang.split('_')

  if (localePart && normalizedFilterLanguages.includes(localePart)) {
    return localePart
  }

  return null
}

const getNavigatorLanguages = (): string[] => {
  let languages: string[] = []
  if (Array.isArray(navigator.languages)) {
    languages = [...navigator.languages]
  } else if (navigator.language) {
    languages.push(navigator.language)
  }
  return languages
}

const getUniqueUserLocales = (): string[] => {
  const locales = new Set<string>(getNavigatorLanguages())

  const uiLanguage = chrome?.i18n?.getUILanguage()
  if (uiLanguage) {
    locales.add(uiLanguage)
  }

  return [...locales]
}

export const getFilterIdsByLocale = (filters: FilterMetadata[]): FilterId[] => {
  const userLocales = getUniqueUserLocales()
  const matchedFilterIds: FilterId[] = []

  for (const filter of filters) {
    if (!filter?.languages?.length) {
      continue
    }

    for (const locale of userLocales) {
      if (findLocaleMatch(filter.languages, locale) !== null) {
        matchedFilterIds.push(filter.filterId)
        break
      }
    }
  }

  return matchedFilterIds
}
