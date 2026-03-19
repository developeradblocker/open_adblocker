<template>
  <div class="base-modal__overlay" @click="$emit('close')">
    <div class="base-modal" @click.stop>
      <h3 class="base-modal__title">{{  title  }}</h3>
      <p class="base-modal__subtitle">{{ subtitle }}</p>
      <slot name="content"></slot>
      <div class="base-modal__controls">
        <slot name="controls"></slot>
      </div>
    </div>
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
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<style lang="less" scoped>
.base-modal {
  padding: 20px 24px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background-color: #FFF;
  border: 1px solid rgba(217, 216, 222, 1);
  border-radius: 12px;
}

.base-modal__overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
}
.base-modal__title {
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  margin: 0 0 8px 0;
}
.base-modal__subtitle {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  margin: 0 0 16px 0;
}

.base-modal__controls {
  margin-top: 8px;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
</style>
