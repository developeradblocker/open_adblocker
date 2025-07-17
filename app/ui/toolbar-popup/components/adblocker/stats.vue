<!--
 This file is part of Open Ad Blocker Browser Extension (https://github.com/developeradblocker/open_adblocker).

 Open Ad Blocker Browser Extension is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Open Ad Blocker Browser Extension is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Open Ad Blocker Browser Extension. If not, see <http://www.gnu.org/licenses/>.
-->

<template>
  <div class="ad-blocker-stats">
    <div class="ad-blocker-stats__box">
      <p class="ad-blocker-stats__value">{{ current }}</p>
      <p class="ad-blocker-stats__label">Blocked on this page</p>
    </div>
    <div class="ad-blocker-stats__box">
      <p class="ad-blocker-stats__value">{{ total }}</p>
      <p class="ad-blocker-stats__label">Blocked all time</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'
import { computed, ComputedRef } from 'vue'

const appStore = useAppStore()
const total: ComputedRef<number> = computed(() => appStore.app.totalBlocked)
const current: ComputedRef<number | string> = computed(() => {
  if (appStore.app.isServicePage || appStore.app.isPaused) {
    return '-'
  }
  return appStore.app.blockedByTab
})
</script>

<style scoped>
.ad-blocker-stats {
  padding: 20px;
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  background: var(--secondary-bg-color);
}

.ad-blocker-stats__box {
  display: flex;
  padding: 9px 0;
  gap: 10px;
}

.ad-blocker-stats__value {
  width: 50px;
  margin: 0;
  text-align: center;
}

.ad-blocker-stats__label {
  margin: 0;
}

</style>
