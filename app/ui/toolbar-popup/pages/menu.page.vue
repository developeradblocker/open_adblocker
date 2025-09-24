<template>
  <PrimaryLayout class="menu-page">
    <template #header>
      <Header
        title="Menu"
        with-border
        :menu-closed="false"
        @menu-click="onMenuClick"
      />
    </template>
    <template #content>
      <div class="menu-page__content">
        <MenuLinks />
      </div>
    </template>
  </PrimaryLayout>
</template>

<script setup lang="ts">
import PrimaryLayout from '@/ui/toolbar-popup/layouts/primary.layout.vue'
import Header from '@/ui/toolbar-popup/components/header.vue'
import MenuLinks from '@/ui/toolbar-popup/components/menu-links.vue'
import { useRouter } from 'vue-router'
const $router = useRouter()

const onMenuClick = (): void => {
  $router.back()
}

</script>

<style scoped lang="less">
.menu-page__content {
  padding: 8px 0;
}
</style>
