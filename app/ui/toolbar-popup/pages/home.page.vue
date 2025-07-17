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
