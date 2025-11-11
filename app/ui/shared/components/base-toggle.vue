<template>
  <div
    class="base-toggle"
    :class="{
      'base-toggle--active': isActive,
      'base-toggle--inactive': !isActive,
      'base-toggle--loading': loading,
      'base-toggle--large': large,
    }"
    :aria-disabled="loading"
    @click="onToggle"
  >
    <div class="base-toggle__circle">
      <span v-show="loading" class="base-toggle__loader"/>
    </div>
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

const {
  loading,
  isActive
} = defineProps<{
  isActive: boolean
  loading?: boolean
  large?: boolean
}>()

const $emit = defineEmits<{(e: 'toggle', value: boolean): void }>()
const onToggle = (event: MouseEvent): void => {
  event.stopPropagation()
  if (loading) {
    return
  }
  $emit('toggle', !isActive)
}
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

.base-toggle--large {
  width: 48px;
  height: 28px;

  .base-toggle__circle {
    width: 22px;
    height: 22px;
    top: 3px;
    left: 3px;
  }
}

.base-toggle--large.base-toggle--active {
  .base-toggle__circle {
    left: 23px;
  }
}

.base-toggle--large.base-toggle--loading {
  .base-toggle__circle {
    left: 13px;
  }

  .base-toggle__loader {
    width: 18px;
    height: 18px;
  }
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

.base-toggle--loading {
  background: #8C94E1;
  cursor: wait;

  &:hover {
    background: #8C94E1;
  }

  .base-toggle__circle {
    left: 7px;
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

.base-toggle__loader {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--secondary-color);
  border-top-color: transparent;
  border-bottom-color: transparent;
  transform: rotate(45deg);
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(45deg);

  }
  to {
    transform: rotate(405deg);
  }
}

</style>
