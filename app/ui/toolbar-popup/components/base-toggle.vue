<template>
  <div
    class="base-toggle"
    :class="{
      'base-toggle--active': isActive,
      'base-toggle--inactive': !isActive,
    }"
    @click="$emit('toggle', !isActive)"
  >
    <div class="base-toggle__circle"/>
  </div>
</template>

<script lang="ts" setup>
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

defineProps<{ isActive: boolean }>()
defineEmits(['toggle'])
</script>

<style lang="less" scoped>
.base-toggle {
  position: relative;
  width: 32px;
  height: 20px;
  border-radius: 20px;
  transition: 0.2s ease;
  cursor: pointer;
}

.base-toggle--inactive {
  background: var(--disabled-bg-color);

  &:hover {
    background: #D9D8DE;
  }
}

.base-toggle--active {
  background: var(--secondary-color);

  &:hover {
    background: #7992FF;
  }

  .base-toggle__circle {
    left: 14px;
  }
}

.base-toggle__circle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: #FFFFFF;
  border-radius: 50%;
  transition: 0.2s ease;
}

</style>
