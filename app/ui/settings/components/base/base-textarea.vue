<template>
  <div
    class="base-textarea"
    :class="{
      'base-textarea--disabled': disabled,
      'base-textarea--with-errors': error !== undefined
    }"
  >
    <textarea
      class="base-textarea__native"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div class="base-textarea__bottom">
      <p class="base-textarea__error" v-show="error">{{ error }}</p>
      <span
       :class="{
        'base-textarea__counter': true,
        'base-textarea__counter--error': valueLen > maxChars
       }"
        v-if="maxChars"
      >
        {{ valueLen }}/{{ maxChars }}
      </span>
    </div>
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
import { computed } from 'vue'

const { modelValue } = defineProps<{
  modelValue: string,
  placeholder?: string,
  disabled?: boolean,
  error?: string
  maxChars?: number
}>()
const valueLen = computed(() => modelValue.trim().length)
</script>

<style lang="less" scoped>
.base-textarea {
  position: relative;
  padding-bottom: 12px;
}

.base-textarea__native {
  width: 100%;
  height: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: rgba(60, 57, 76, 1);
  border: 1px solid rgba(217, 216, 222, 1);
  background: #FFF;
  transition: border-color, color, background linear .3s;
  outline-style: none;
  resize: none;

  &:hover {
    border-color: rgba(191, 189, 199, 1)
  }

  &:active {
    outline: none;
  }

  &::placeholder {
    color: rgba(150, 147, 165, 1)
  }

  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(217, 216, 222, 1);
    border: 2px solid #FFF;
    border-radius: 2px;
  }
}

.base-textarea--disabled {
  cursor: not-allowed;

  .base-textarea__native {
      color: rgba(125, 122, 144, 1);
      background: rgba(242, 241, 243, 1);
      border-color: rgba(191, 189, 199, 1);

      &:hover {
        border-color: rgba(191, 189, 199, 1);
      }

      &::placeholder {
        color: rgba(191, 189, 199, 1)
      }
    }
}

.base-textarea--with-errors {
  .base-textarea__native {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: 2px solid rgba(204, 51, 85, 1);

      &:hover {
        border-color: rgba(191, 189, 199, 1);
        border-bottom-color: rgba(204, 51, 85, 1);
      }
    }
}

.base-textarea__bottom {
  width: 100%;
  bottom: -3px;
  left: 0;
  position: absolute;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
}

.base-textarea__error {
  margin: 0;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: rgba(204, 51, 85, 1);
  flex: 1;
}

.base-textarea__counter {
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  text-align: right;
  color: rgba(150, 147, 165, 1);

  &--error {
    color: rgba(204, 51, 85, 1);
  }
}
</style>
