<template>
  <div class="ad-blocker-toggle">
    <ToggleButton class="ad-blocker-toggle__button" :loading="isLoading" @click="onChange"/>
    <div
      :class="{'ad-blocker-toggle__title--disabled': appStore.app.isServicePage}"
      class="ad-blocker-toggle__title"
    >
      {{ title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'
import ToggleButton from '@/ui/toolbar-popup/components/adblocker/toggle-button.vue'
import { useExternalAdBlocker } from '@/modules/ad-blocker/external/ad-blocker.setup'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { ClickEventToAction, ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'

const isLoading: Ref<boolean> = ref(false)
const appStore = useAppStore()
const activity = useUserActivity()
const adBlocker = useExternalAdBlocker()

const title: ComputedRef<string> = computed(() => {
  if (appStore.app.isServicePage) {
    return 'Can’t block on this page'
  }

  return appStore.app.isPaused ? 'Resume for this website' : 'Pause for this website'
})
const onChange = async (): Promise<void> => {
  if (appStore.app.isServicePage || isLoading.value) {
    return
  }

  isLoading.value = true
  const state = appStore.app.isPaused
  await activity.click(ElementsUI.adblockerToggle, {
    to: !state ? ClickEventToAction.pause : ClickEventToAction.play,
    page: ROUTE.HOME
  })

  try {
    await adBlocker.toggle(!state)
    isLoading.value = false
  } catch {
    isLoading.value = false
  }
}
</script>

<style scoped lang="less">
.ad-blocker-toggle {
  display: flex;
  align-items: center;
  padding: 28px 12px 28px 24px;
  gap: 14px;
}

.ad-blocker-toggle__title {
  color: var(--secondary-color);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.ad-blocker-toggle__title--disabled {
  color: var(--disabled-color);
}
</style>
