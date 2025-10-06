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

import { AppMessageListener, Box } from '@/utils/dispatcher/dispatcher.types'
import { inject, injectable } from '@/utils/di/di.types'
import { InternalFiltersIdentifiers } from '@/modules/filters/internal/filters.types'
import { FiltersBaseInterface } from '@/modules/filters/common/filters.types'
import { FiltersMessages, ToggleFilterMessage } from '@/modules/filters/common/filters.messages'

@injectable()
export class FiltersToggleListener implements AppMessageListener<ToggleFilterMessage> {
  constructor (
    @inject(InternalFiltersIdentifiers.service)
    private filters: FiltersBaseInterface
  ) {
  }

  on (): FiltersMessages.toggle {
    return FiltersMessages.toggle
  }

  main (): false {
    return false
  }

  async handle ({ message }: Box<ToggleFilterMessage>): Promise<void> {
    const { id } = message.payload
    await this.filters.toggle(id)
  }
}
