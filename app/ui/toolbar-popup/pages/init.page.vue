<template>
  <PrimaryLayout class="init-page" loading>
    <template #header>
      <Header @menu-click="onMenuClick"/>
    </template>
  </PrimaryLayout>
</template>

<script setup lang="ts">
import { useAppService } from '@/modules/app/external/app.service'
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import PrimaryLayout from '@/ui/toolbar-popup/layouts/primary.layout.vue'
import Header from '@/ui/toolbar-popup/components/header.vue'

const $router = useRouter()
const $appStore = useAppStore()
const $app = useAppService()
onMounted(async () => {
  await $app.establishConnection()
  const state = await $app.getState()
  $appStore.setAppInfo(state)
  if (state.needVisitRateUs) {
    await $router.push({ name: ROUTE.RATE_US })
  } else {
    await $router.push({ name: ROUTE.HOME })
  }
})

const onMenuClick = async (): Promise<void> => {
  await $router.push({ name: ROUTE.MENU })
}
</script>
