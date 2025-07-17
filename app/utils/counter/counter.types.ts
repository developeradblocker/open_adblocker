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
export interface CounterInterface {
  /**
   * Get the current value of the counter.
   * @returns {Promise<number>} The current value of the counter.
   */
  get: () => Promise<number>

  /**
   * Increase the counter by 1.
   * @return {Promise<void>} A promise that resolves when the counter is increased.
   */
  increase: () => Promise<void>

  /**
   * Reset the counter to default(initial) value.
   * @return {Promise<void>} A promise that resolves when the counter is reset.
   */
  reset: () => Promise<void>

  /**
   * Set the counter to a specific value.
   * @param value The value to set the counter to.
   * @return {Promise<void>} A promise that resolves when the counter is set.
   */
  set: (value: number) => Promise<void>

  /**
   * Remove the counter from storage.
   * @return {Promise<void>} A promise that resolves when the counter is removed.
   */
  remove: () => Promise<void>
}
