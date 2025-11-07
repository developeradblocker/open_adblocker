<template>
  <div class="base-import">
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      @change="$emit('change', $event)"
      class="base-import__input"
  />
    <slot :input="inputRef" />
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
import { ref } from 'vue'

defineProps<{ accept: string }>()
defineEmits(['change'])
const inputRef = ref<HTMLInputElement>(null)
</script>
<style lang="less" scoped>
.base-import__input {
  display: none;
}
</style>
