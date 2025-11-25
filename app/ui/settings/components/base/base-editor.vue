<template>
    <v-ace-editor
     v-model:value="value"
     class="base-editor"
     theme="dreamweaver"
     lang="text"
     :min-lines="1"
     :print-margin="false"
     :options="{
        customScrollbar: true,
        cursorStyle: 'smooth'
     }"
    />
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
import { computed } from 'vue'
/**
 * Order does matter here:
 * You MUST make sure that `ace-builds` or `vue3-ace-editor`
 * (which imports `ace-builds` internally) is loaded before importing `mode` and `theme`
 */
import { VAceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-text'
import 'ace-builds/src-noconflict/theme-dreamweaver'

const { modelValue } = defineProps<{
 modelValue: string
}>()
const $emit = defineEmits<{
  'update:model-value': [value: string]
}>()

const value = computed({
  get () {
    return modelValue
  },

  set (newValue) {
    $emit('update:model-value', newValue)
  }
})
</script>

<style lang="less" scoped>
@import (css) url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap');

.base-editor {
  border: 3px solid white;
  outline: 1px solid #D9D8DE;
  border-radius: 6px;
  height: 240px;

  &,
  * {
    font-family: 'Geist Mono';
    font-size: 14px;
    font-weight: normal;
    line-height: 24px;
  }
}
.base-editor {
  :deep(.ace_gutter) {
    background-color: white;
  }

  :deep(.ace_gutter-active-line) {
    background-color: #F2F1F3;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  :deep(.ace_marker-layer .ace_active-line) {
    background-color: #F2F1F3;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  :deep(.ace_sb-v) {
    width: 4px !important;
    border-radius: 2px !important;
  }

  :deep(.ace_sb-h) {
    height: 4px !important;
    border-radius: 2px !important;
  }
}
</style>
