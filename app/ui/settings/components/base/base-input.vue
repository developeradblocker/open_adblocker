<template>
  <div
    class="base-input"
    :class="{
      'base-input--disabled': disabled,
      'base-input--with-errors': error !== undefined
    }"
  >
    <input
      class="base-input__native"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p class="base-input__error" v-show="error">{{ error }}</p>
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
defineProps<{
  modelValue: string,
  placeholder?: string,
  disabled?: boolean,
  error?: string,
  maxChars?: number
}>()
</script>

<style lang="less" scoped>
.base-input {
  position: relative;
  padding-bottom: 12px;
}

.base-input__native {
  width: 100%;
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

  &:hover {
    border-color: rgba(191, 189, 199, 1)
  }

  &:active {
    outline: none;
  }

  &::placeholder {
    color: rgba(150, 147, 165, 1)
  }
}

.base-input--disabled {
  cursor: not-allowed;
  .input__native {
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

.base-input--with-errors {
  .base-input__native {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: 2px solid rgba(204, 51, 85, 1);

      &:hover {
        border-color: rgba(191, 189, 199, 1);
        border-bottom-color: rgba(204, 51, 85, 1);
      }
    }
}

.base-input__error {
  position: relative;
  width: 100%;
  margin: 0;
  position: absolute;
  bottom: -3px;
  left: 0;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: rgba(204, 51, 85, 1);
}
</style>
