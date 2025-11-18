<template>
  <div class="base-list-item list-item">
    <BaseSvg :src="`../icons/${icon}.svg`" class="list-item__icon" v-if="icon"/>
    <div class="list-item__content">
      <h5 class="list-item__icon__title">{{ title }}</h5>
      <p class="list-item__icon__description">{{ description }}</p>
    </div>
    <div class="list-item__action">
      <slot/>
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
  icon?: string
  title: string
  description: string
}>()
</script>

<style scoped lang="less">
.list-item {
  cursor: pointer;
  border-radius: 15px;
  padding: 8px 14px;
  display: flex;
  gap: 20px;
  align-items: center;

  &:hover {
    background-color: var(--secondary-bg-color);
  }
}

.list-item__icon {
  width: 24px;
  height: 24px;
}

.list-item__content {
  flex: 1;
}

.list-item__action {
  display: flex;
  justify-content: flex-end;
  width: 130px;
}

.list-item__icon__title {
  margin: 0 0 10px;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #3C384C;
}

.list-item__icon__description {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: var(--primary-color)

}
</style>
