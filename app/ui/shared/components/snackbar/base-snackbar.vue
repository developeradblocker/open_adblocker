<template>
  <transition name="fade">
    <div
      v-if="value"
      class="base-snackbar snackbar"
      :class="{[`snackbar--${value.type}`]: true}"
    >
      <BaseSvg class="snackbar__icon" :src="`../icons/${icons[value.type]}.svg`"/>

      <p class="snackbar__message">{{ value.message }}</p>

      <BaseSvg
        data-test="close"
        class="snackbar__close snackbar__icon"
        src="../icons/close.svg" @click="$emit('close')"/>
    </div>
  </transition>
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
import { type SnackbarProps } from '@/ui/shared/components/snackbar/base-snackbar.types'
import { watch } from 'vue'

const DEFAULT_SNACKBAR_TIMEOUT = 4000
const icons = {
  info: 'check',
  error: 'info-round'
}

const props = defineProps<{ value: SnackbarProps | null }>()
let timeoutId: ReturnType<typeof setTimeout>
const emit = defineEmits(['close'])
watch(() => props.value, (current: SnackbarProps | null) => {
  if (current) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => emit('close'), current.timeout ?? DEFAULT_SNACKBAR_TIMEOUT)
  }
}, { immediate: true })
</script>

<style scoped lang="less">
.snackbar {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  padding: 12px 64px 12px 16px;
  gap: 12px;
  color: #FFF;
  border-radius: 4px;
  box-shadow: 0 10px 20px 0 #1B1B1B0D;
  z-index: 9999;
  min-width: 320px;
}

.snackbar--info {
  background: var(--secondary-color);
}

.snackbar--error {
  background: #C62828;
}

.snackbar__icon {
  width: 24px;
  height: 24px;
  fill: #FFF;
}

.snackbar__message {
  margin: 0;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
}

.snackbar__close {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 16px;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .18s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
