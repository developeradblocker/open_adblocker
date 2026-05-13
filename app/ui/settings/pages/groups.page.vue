<template>
  <div class="groups-page groups">
    <BaseBox with-header>
      <h3 class="groups__title">Filters</h3>
      <p class="groups__description">Adjust your preferred settings for customised protection.</p>

      <div class="groups__separator"/>
      <div class="groups__list">
        <BaseListItem
          class="groups__list-item"
          v-for="group in $store.groups"
          :data-test="`group--${group.groupId}`"
          :key="group.groupId"
          :title="groupName(group)"
          :icon="groupIcon(group.groupId)"
          @click="onGroupClick(group.groupId)"
          :description="group.groupDescription"
        />
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
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'
import BaseListItem from '@/ui/settings/components/base/base-list-item.vue'
import { useSettingsStore } from '@/ui/settings/store/settings.store'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { onMounted } from 'vue'
import { ClickEventToAction } from '@/modules/user-activity/common/user-activity.types'
import { useRouter } from 'vue-router'
import { GroupMetadata } from '@/modules/settings/common/settings.types'

const $activity = useUserActivity()
const $store = useSettingsStore()
const $router = useRouter()
const onGroupClick = (groupId: number): void => {
  $activity.click(`group_${groupId}`, {
    page: SETTINGS_ROUTE.GROUPS,
    to: ClickEventToAction.openGroup
  })
  $router.push({ name: SETTINGS_ROUTE.FILTERS, params: { id: groupId } })
}

const GROUP_ICON_MAP = {
  1: 'no-ad',
  2: 'eye',
  3: 'connection',
  4: 'popup',
  5: 'shield',
  6: 'language',
  7: 'more'
}
const groupIcon = (groupId: number): string => {
  return GROUP_ICON_MAP[groupId] || GROUP_ICON_MAP[1]
}
const groupName = ({ groupId, groupName }: GroupMetadata): string => {
  const groupFilters = $store.filters.filter(filter => filter.groupId === groupId)
  const enabledFilters = groupFilters.filter(filter => $store.enabledFilters.includes(filter.filterId))
  return `${groupName} (${enabledFilters.length} of ${groupFilters.length})`
}
onMounted(() => {
  $activity.visitPage(SETTINGS_ROUTE.GROUPS)
})

</script>

<style scoped lang="less">
.groups__title {
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
  color: #2D2A3C;
  margin: 0 0 10px;
}

.groups__description {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: var(--primary-color);
  margin-bottom: 24px;
}

.groups__separator {
  margin: 28px 0;
  height: 1px;
  background: #D9D8DE;
}

.groups__list-item {
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
