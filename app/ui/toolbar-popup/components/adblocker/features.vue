<template>
  <div class="ad-blocker-features">
    <Feature icon="cookie-cleaner" label="Hide cookie alerts" info="Hide cookie consent dialogs on websites">
      <template #action>
        <BaseToggle id="cookie-cleaner-toggle"
                    :loading="cookieCleanerToggleLoading"
                    :is-active="cookieCleaner"
                    @toggle="toggleCookieCleaner"
        />
      </template>
    </Feature>
    <Feature icon="web-rtc" label="WebRTC protection" info="Prevent WebRTC from revealing your IP address">
      <template #action>
        <BaseToggle id="web-rtc-toggle" :is-active="webRtc" />
      </template>
    </Feature>
  </div>
</template>

<script setup lang="ts">
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

import Feature from '@/ui/toolbar-popup/components/adblocker/feature.vue'
import { computed, onMounted, ref } from 'vue'
import BaseToggle from '@/ui/toolbar-popup/components/base-toggle.vue'
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'
import { checkWebRTCPermissions, requestWebRTCPermissions } from '@/modules/features/web-rtc/common/web-rtc.utils'
import { useWebRTC } from '@/modules/features/web-rtc/external/web-rtc.utils'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { COOKIE_CLEANER_ID } from '../../../../../constants'
import { useNotificationStore } from '@/ui/toolbar-popup/components/notification/notification.store'
import { useExternalFilters } from '@/modules/filters/external/filters.utils'
import { NotificationTypes } from '@/ui/toolbar-popup/components/notification/notification.types'

const appStore = useAppStore()
const webRTC = useWebRTC()
const filters = useExternalFilters()
const activity = useUserActivity()
const notification = useNotificationStore()

const cookieCleanerToggleLoading = ref(false)
const webRtc = computed(() => appStore.app.isWebRTCEnabled)
const cookieCleaner = computed(() => appStore.app.isCookieCleanerEnabled)

const toggleCookieCleaner = async (state: boolean): Promise<void> => {
  cookieCleanerToggleLoading.value = true
  try {
    await filters.toggle(COOKIE_CLEANER_ID)
    appStore.updateField('isCookieCleanerEnabled', state)
    activity.toggle(ElementsUI.cookie_cleaner, state)
  } catch (e) {
    console.error(e)
    notification.showNotification(
      'An error has occurred. Please retry',
      NotificationTypes.error
    )
    /**
     * Rolling back previous changes
     */
    filters.toggle(COOKIE_CLEANER_ID)
    appStore.updateField('isCookieCleanerEnabled', !state)
  } finally {
    cookieCleanerToggleLoading.value = false
  }
}
onMounted(async () => {
  const webRTCToggle: HTMLDivElement = document.querySelector('#web-rtc-toggle')
  webRTCToggle.addEventListener('click', async () => {
    const state = !webRtc.value
    activity.toggle(ElementsUI.web_rtc, state)
    if (await checkWebRTCPermissions()) {
      await webRTC.toggle(state)
      appStore.updateField('isWebRTCEnabled', state)
      return
    }
    await requestWebRTCPermissions()
    window.close()
  })
})
</script>

<style scoped lang="less">
.ad-blocker-features {
  padding: 12px 8px;
}
</style>
