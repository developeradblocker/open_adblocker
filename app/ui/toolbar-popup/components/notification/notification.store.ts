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

export enum NotificationTypes {
  info = 'info',
  success = 'success',
  error = 'error',
  warning = 'warning'
}
interface NotificationStore {
  message: string
  type: NotificationTypes
  isVisible: boolean
  duration: number
  timeoutId: any
}
export const useNotificationStore = defineStore('notification', {
  state: (): NotificationStore => ({
    message: '',
    type: NotificationTypes.info, // success, error, warning, info
    isVisible: false,
    duration: 3000,
    timeoutId: null
  } satisfies NotificationStore),
  actions: {
    /**
     * Shows a notification with the given options.
     * @param {string} message - The message to display.
     * @param {string} [type='info'] - The type of notification.
     * @param {number} [duration=3000] - Duration in ms. 0 for permanent.
     */
    showNotification ({ message, type = NotificationTypes.info, duration = 3000 }: Partial<NotificationStore>) {
      this.clearTimer()

      this.message = message
      this.type = type
      this.duration = duration
      this.isVisible = true

      if (duration > 0) {
        this.timeoutId = setTimeout(() => {
          this.hideNotification()
        }, duration)
      }
    },

    hideNotification () {
      this.isVisible = false
      this.clearTimer()

      setTimeout(() => {
        this.message = ''
        this.type = 'info'
      }, 500)
    },

    clearTimer () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }
    }
  }
})
