<template>
  <div class="draggable-heading" @pointerdown="toggleDragMode">
    <base-svg class="draggable-heading__logo" src="../../icons/logo.svg"/>
    <h1 class="draggable-heading__title">{{ title }}</h1>
    <base-svg class="draggable-heading__close" src="../../icons/close.svg" @click="onClose" @pointerdown.stop @pointerup.stop/>
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
import { finishDragging, startDragging } from '@/ui/manually-blocking-ads/helpers/drag-n-drop.helper'
import { useUIManuallyBlockingAds } from '@/modules/manually-blocking-ads/ui/manually-blocking-ads.setup'
import { ref } from 'vue'

defineProps<{
  title: string
}>()
const $manuallyBlockingAds = useUIManuallyBlockingAds()
const isDragging = ref(false)
const onClose = () => {
  $manuallyBlockingAds.close()
}
const toggleDragMode = (e: MouseEvent) => {
  if (isDragging.value) {
    finishDragging()
  } else {
    startDragging(e)
  }
}
</script>

<style scoped lang="less">
.draggable-heading {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 15px 16px;
  cursor: grab;
}

.draggable-heading__logo {
  width: 22px;
  fill: #3A40EF;
}

.draggable-heading__title {
  margin: 0;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
}

.draggable-heading__close {
  cursor: pointer;
  width: 20px;
  fill: #9693A5;
}
</style>
