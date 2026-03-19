<template>
  <div class="ad-blocker-stats">
    <div class="ad-blocker-stats__content">
      <div class="ad-blocker-stats__box">
        <p
          class="ad-blocker-stats__value"
          :class="{ 'ad-blocker-stats__value--hidden': isCurrentStatsHidden }"
          data-test="adblocker-stats__current">
          {{ current }}</p>
        <p class="ad-blocker-stats__label">Blocked on this page</p>
      </div>
      <div class="ad-blocker-stats__box">
        <p class="ad-blocker-stats__value" data-test="adblocker-stats__total">{{ total }}</p>
        <p class="ad-blocker-stats__label">Blocked all time</p>
      </div>
    </div>
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
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'
import { computed, ComputedRef } from 'vue'

const appStore = useAppStore()
const total: ComputedRef<number> = computed(() => appStore.app.totalBlocked)
const isCurrentStatsHidden: ComputedRef<boolean> = computed(() => appStore.app.isServicePage || appStore.app.isPaused)
const current: ComputedRef<string> = computed(() =>
  isCurrentStatsHidden.value ? '-' : `${appStore.app.blockedByTab}`
)
</script>

<style scoped>
.ad-blocker-stats {
  padding: 4px 8px;
}

.ad-blocker-stats__content {
  border-radius: 6px;
  padding: 0 16px;
  display: flex;
  background: linear-gradient(93.78deg, #DEE9FF 3.1%, #FFFFFF 100%);
}

.ad-blocker-stats__box {
  flex: 1;
  padding: 0 24px;
  text-align: center;
  font-weight: 400;
}

.ad-blocker-stats__value {
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 18px;
  color: var(--secondary-color)
}

.ad-blocker-stats__value--hidden {
  color: var(--primary-color);
}

.ad-blocker-stats__label {
  font-size: 12px;
  line-height: 16px;
  color: var(--primary-color);
}

</style>
