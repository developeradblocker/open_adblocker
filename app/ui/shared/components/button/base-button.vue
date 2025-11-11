<template>
  <button
    type="button"
    class="base-button"
    :disabled="disabled"
    :class="{
      'base-button--disabled': disabled,
      'base-button--full-width': fullWidth,
      'base-button--with-icon': icon,
      [`base-button--${type}`]: true
    }"
  >
    <BaseSvg v-if="icon" :src="`../icons/${icon}.svg`" class="base-button__icon" />
    {{ label }}
  </button>
</template>

<script setup lang="ts">/**
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
import { BaseButtonType } from '@/ui/shared/components/button/base-button.types'

withDefaults(defineProps<{
  label: string
  type: BaseButtonType
  disabled?: boolean
  icon?: string
  fullWidth?: boolean
}>(), { type: BaseButtonType.primary })
</script>

<style scoped lang="less">
.base-button {
  margin: 0;
  padding: 8px 12px;
  text-align: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
}

.base-button--full-width {
  width: 100%;
}

.base-button--with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 23px;
}

.base-button__icon {
  fill: #4A465D;
  width: 20px;
  height: 20px;
}

.base-button--primary {
  color: #FFF;
  background: #3C384C;

   &:hover {
    background: #302D3A;
  }
}

.base-button--secondary {
  color: #4A465D;
  background: var(--secondary-bg-color);

   &:hover {
    background: #D9D8DE;
  }
}

.base-button--disabled {
  cursor: not-allowed;
  background: var(--disabled-bg-color);

  &:hover {
    background: var(--disabled-bg-color);
  }
}
</style>
