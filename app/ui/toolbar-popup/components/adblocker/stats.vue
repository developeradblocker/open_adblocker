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
