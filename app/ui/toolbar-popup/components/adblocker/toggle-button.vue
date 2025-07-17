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
  <div
    class="ad-blocker-toggle-button"
    :class="{
      'ad-blocker-toggle-button--disabled': appStore.app.isServicePage,
      'ad-blocker-toggle-button--paused': appStore.app.isPaused,
      'ad-blocker-toggle-button--loading': loading
    }"
  >
    <BaseSvg :src="`../icons/${icon.src}.svg`" :fill="icon.fill" class="ad-blocker-toggle-button__icon" />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/ui/toolbar-popup/store/app.store'
import { computed, ComputedRef } from 'vue'
interface ToggleIcon {
  src: string
  fill: string
}

const props = defineProps<{ loading: boolean }>()

const appStore = useAppStore()
const icon: ComputedRef<ToggleIcon> = computed(() => {
  if (props.loading) {
    return {
      src: 'loader',
      fill: appStore.app.isPaused ? '#FFF' : '#5A6BFA'
    }
  }
  if (appStore.app.isServicePage) {
    return {
      src: 'logo',
      fill: '#7D7A90'
    }
  }

  return appStore.app.isPaused ? { src: 'play', fill: '#FFF' } : { src: 'pause', fill: '#5A6BFA' }
})
</script>

<style scoped lang="less">
  .ad-blocker-toggle-button {
    position: relative;
    width: 43px;
    height: 43px;
    background: transparent;
    border: 1px solid var(--secondary-color);
    border-radius: 50%;
    transition: 0.3s ease;
    box-sizing: border-box;
    cursor: pointer;
    outline: 6px solid #DEE9FF;

    &:hover {
      background: #DEE9FF;
      outline-color: #9FB9FE;
    }
  }

  .ad-blocker-toggle-button--disabled {
    cursor: not-allowed;
    border-color: var(--disabled-color);
    outline-color: var(--disabled-bg-color);
    background: var(--secondary-bg-color);

    &:hover {
      background: var(--secondary-bg-color);
      outline-color: var(--disabled-bg-color);
    }
  }

  .ad-blocker-toggle-button--paused {
    background: var(--secondary-color);

    &:hover {
      background: var(--primary-bg-color);
      border-color: var(--primary-bg-color);
    }
  }

  .ad-blocker-toggle-button--loading {
    cursor: wait;
    animation: rotate 1.5s linear infinite;
  }

  .ad-blocker-toggle-button__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
