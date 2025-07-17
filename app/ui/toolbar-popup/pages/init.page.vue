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
