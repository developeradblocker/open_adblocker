<template>
  <PrimaryLayout class="home-page">
    <template #header>
      <Header @menu-click="onMenuClick" />
    </template>
    <template #content>
      <Toggle />
      <Stats />
    </template>
  </PrimaryLayout>
</template>
<script lang="ts" setup>
import PrimaryLayout from '@/ui/toolbar-popup/layouts/primary.layout.vue'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'
import Header from '@/ui/toolbar-popup/components/header.vue'
import Stats from '@/ui/toolbar-popup/components/adblocker/stats.vue'
import Toggle from '@/ui/toolbar-popup/components/adblocker/toggle.vue'
import { useRouter } from 'vue-router'
const $router = useRouter()

const onMenuClick = async (): Promise<void> => {
  await $router.push({ name: ROUTE.MENU })
}
</script>
