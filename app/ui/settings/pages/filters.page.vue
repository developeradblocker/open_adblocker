<template>
  <div class="filters-page filters">
    <BaseBox with-header>
      <div class="filters__header">
        <div class="filters__header-back" @click="$router.back()">
          <BaseSvg src="../icons/back.svg" class="filters__header-back-icon"/>
        </div>
        <div class="filters__header-content">
          <h3 class="filters__title">{{ activeGroup?.groupName }}</h3>
          <p class="filters__description">{{ activeGroup?.groupDescription }}</p>
        </div>
        <BaseToggle :is-active="isActiveGroup"
                    @toggle="toggleGroup"
                    large class="filters__header-action"/>
      </div>
      <div class="filters__separator"/>
      <div class="filters__list">
        <BaseListItem
          class="filters__list-item"
          v-for="filter of filters"
          :key="filter.filterId"
          :title="filter.name"
          :description="filter.description"
        >
          <BaseToggle :is-active="isActiveFilter(filter.filterId)" large
                      @toggle="toggleFilter(filter.filterId)"/>
        </BaseListItem>
      </div>
    </BaseBox>
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

import BaseBox from '@/ui/settings/components/base/base-box.vue'
import BaseToggle from '@/ui/shared/components/base-toggle.vue'
import BaseListItem from '@/ui/settings/components/base/base-list-item.vue'
import { useExternalFilters, useExternalGroups } from '@/modules/filters/external/filters.utils'
import { FilterId } from '@/modules/filters/common/filters.types'
import { useSettingsStore } from '@/ui/settings/store/settings.store'
import { computed } from 'vue'

const { id } = defineProps<{ id: string }>()

const $filters = useExternalFilters()
const $groups = useExternalGroups()
const $store = useSettingsStore()

const groupId = Number(id)
const isActiveFilter = (filterId: FilterId): boolean => $store.enabledFilters.includes(filterId)

const isActiveGroup = computed(() => $store.enabledGroups.includes(groupId))
const activeGroup = computed(() => $store.groups.find((group) => group.groupId === groupId))
const filters = computed(() => $store.filters.filter((filter) => filter.groupId === groupId))

const toggleFilter = async (filterId: FilterId): Promise<void> => {
  $store.toggleFilter(filterId)
  await $filters.toggle(filterId)
}
const toggleGroup = async (): Promise<void> => {
  $store.toggleGroup(groupId)
  await $groups.toggle(groupId)
}
</script>

<style scoped lang="less">
.filters__header {
  padding-right: 14px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.filters__header-back {
  width: 40px;
  height: 40px;
  background: var(--secondary-bg-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #D9D8DE;
  }
}

.filters__header-content {
  flex: 1;
}

.filters__list-item {
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
}

.filters__header-back-icon {
  width: 16px;
  height: 16px;
}

.filters__title {
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
  color: #2D2A3C;
  margin: 0 0 10px;
}

.filters__description {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: var(--primary-color);
  margin: 0;
}

.filters__separator {
  margin: 28px 0;
  height: 1px;
  background: #D9D8DE;
}

</style>
