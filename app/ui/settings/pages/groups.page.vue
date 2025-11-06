<template>
  <div class="groups-page groups">
    <BaseBox with-header>
      <h3 class="groups__title">Filters</h3>
      <p class="groups__description">Adjust your preferred settings for customised protection.</p>

      <div class="groups__separator"/>
      <div class="groups__list">
        <BaseListItem
          class="groups__list-item"
          v-for="group in settings?.metadata?.groups ?? []"
          :key="group.groupId"
          :title="group.groupName"
          icon="no-ad"
          @click="$router.push({ name: SETTINGS_ROUTE.FILTERS, params: { id: group.groupId } })"
          :description="group.groupDescription"
        >
          <BaseToggle :is-active="settings.filters.enabledGroups.includes(group.groupId)" large
                      @toggle="toggleGroup(group.groupId)"/>
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
import { useExternalSettings } from '@/modules/settings/external/settings.utils'
import { onMounted, ref } from 'vue'
import { OpenADBSettings } from '@/modules/settings/common/settings.types'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'
import BaseToggle from '@/ui/shared/components/base-toggle.vue'
import BaseListItem from '@/ui/settings/components/base/base-list-item.vue'
import { GroupId } from '@/modules/filters/common/filters.types'
import { useExternalGroups } from '@/modules/filters/external/filters.utils'

const settings = ref<OpenADBSettings>(null)

const $settings = useExternalSettings()
const $groups = useExternalGroups()
const toggleGroup = async (groupId: GroupId): Promise<void> => {
  await $groups.toggle(groupId)
}
onMounted(async () => {
  settings.value = await $settings.get()
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
