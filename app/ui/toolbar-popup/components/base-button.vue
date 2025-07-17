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
  <button
    type="button"
    class="base-button"
    :disabled="disabled"
    :class="{'base-button--disabled': disabled}"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  disabled?: boolean
}>()
</script>

<style scoped lang="less">
.base-button {
  width: 100%;
  margin: 0;
  padding: 8px 12px;
  color: #FFF;
  text-align: center;
  background: #3C384C;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none;

  &:hover {
    background: #302D3A;
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
