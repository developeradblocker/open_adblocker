<template>
  <div class="base-card" :class="{'base-card--disabled': disabled }">
    <div class="base-card__content">
      <BaseSvg :src="`../icons/${icon}.svg`" class="base-card__icon"/>
      <p class="base-card__label">{{ label }}</p>
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
  label: string
  icon: string
  disabled?: boolean
}>()
</script>

<style scoped lang="less">
.base-card {
  padding: 32px;
  height: 130px;
  text-align: center;
  border: 1px solid #C3D5FF;
  border-radius: 12px;
  background: #DEE9FF80;
  cursor: pointer;

  &:hover {
    background: #DEE9FF;
  }
}

.base-card--disabled {
  background: white;
  cursor: not-allowed;
  border-color: #D9D8DE;

  &:hover {
    background: white;
  }

  .base-card__icon {
    fill: #9693A5;
  }

  .base-card__label {
    color: #9693A5;
  }
}

.base-card__content {
  margin: auto;
}

.base-card__icon {
  margin-bottom: 14px;
  width: 32px;
  height: 32px;
  fill: var(--secondary-color);
}

.base-card__label {
  margin: 0;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #4A465D;
}
</style>
