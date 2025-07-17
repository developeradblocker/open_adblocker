<!--
 This file is part of Open Ad Blocker Browser Extension (https://github.com/developeradblocker/open_adblocker).

 Open Ad Blocker Browser Extension is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Open Ad Blocker Browser Extension is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Open Ad Blocker Browser Extension. If not, see <http://www.gnu.org/licenses/>.
-->

<template>
  <div class="primary-layout">
    <div class="primary-layout__header">
      <slot name="header"/>
    </div>
    <div class="primary-layout__content">
      <slot v-if="!loading" name="content"/>
      <div v-else class="primary-layout__loader">
        <h3 class="primary-layout__loader-header">Loading</h3>
        <BaseSvg
          class="primary-layout__loader-icon"
          src="../icons/loader.svg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ loading?: boolean }>(), { loading: false })

</script>

<style scoped lang="less">
.primary-layout {
  height: 100%;
}

.primary-layout__loader {
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  color: var(--secondary-color);
}

.primary-layout__loader-header {
  margin: 0 0 22px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.primary-layout__loader-icon {
  fill: var(--secondary-color);
  width: 32px;
  height: 32px;
  animation: rotate 1.5s linear infinite;
}
</style>
