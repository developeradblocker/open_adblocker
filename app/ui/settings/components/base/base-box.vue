<template>
  <div class="base-box" :class="{ 'base-box--with-header': withHeader }">
    <SettingsHeader v-if="withHeader" />
    <slot />
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
import SettingsHeader from '@/ui/settings/components/settings-header.vue'

defineProps<{withHeader?: boolean}>()
</script>

<style scoped lang="less">
  .base-box {
    position: relative;
    background: #FFF;
    padding: 24px 32px;
    border-radius: 20px;
    border: 1px solid #D9D8DE;
  }

  .base-box--with-header {
    padding-top: 120px;
  }
</style>
