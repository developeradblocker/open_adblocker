<template>
  <label
    class="base-checkbox"
    :class="{
      'base-checkbox--checked': isChecked,
      'base-checkbox--disabled': disabled,
      'base-checkbox--indeterminate': indeterminate,
    }"
    :for="inputId"
  >
    <input
      ref="inputEl"
      :id="inputId"
      class="base-checkbox__input"
      type="checkbox"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
    />

    <span class="base-checkbox__box" aria-hidden="true">
      <span class="base-checkbox__icon" />
    </span>

    <span class="base-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
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
import { computed, onMounted, ref, watch } from 'vue'

export type Emits = {
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}

const props = withDefaults(defineProps<{
  modelValue: boolean
  label?: string
  disabled?: boolean
  indeterminate?: boolean
  id?: string
}>(), {
  modelValue: false,
  label: '',
  disabled: false,
  indeterminate: false
})

const emit = defineEmits<Emits>()

const inputEl = ref<HTMLInputElement | null>(null)
const uid = Math.random().toString(36).slice(2)
const inputId = computed(() => props.id ?? `base-checkbox-${uid}`)

const isChecked = computed(() => props.modelValue)

const syncIndeterminate = (): void => {
  if (inputEl.value) inputEl.value.indeterminate = !!props.indeterminate
}

onMounted(syncIndeterminate)
watch(() => props.indeterminate, syncIndeterminate)

function onChange (e: Event): void {
  const next = (e.target as HTMLInputElement).checked
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<style lang="less" scoped>
.base-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;

  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

/* Hide native input visually */
.base-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;

  &:focus-visible + .base-checkbox__box {
    box-shadow: 0 0 0 3px fade(#5A6BFA, 25%);;
  }

  &:checked + .base-checkbox__box {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);

    .base-checkbox__icon {
      opacity: 1;
      transform: scale(1);
    }
  }
}

/* Custom box */
.base-checkbox__box {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--secondary-bg-color);
  background: #FFF;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color .15s ease, border-color .15s ease, box-shadow .15s ease;

  .base-checkbox:not(.base-checkbox--disabled):hover & {
    border-color: darken(#BFBDC7, 10%);
  }

  .base-checkbox--checked:not(.base-checkbox--disabled):hover & {
    border-color: darken(#5A6BFA, 10%);
    background-color: darken(#5A6BFA, 10%);
  }
}

/* Checkmark */
.base-checkbox__icon {
  position: relative;
  display: block;
  width: 12px;
  height: 12px;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity .15s ease, transform .15s ease;

  &:after {
    content: '';
    position: absolute;
    left: 3px;
    top: -2px;
    width: 5px;
    height: 10px;
    border: 3px solid #FFF;
    border-radius: 2px;
    border-top: 0; border-left: 0;
    transform: rotate(45deg);
  }
}

/* Indeterminate */
.base-checkbox--indeterminate {
  .base-checkbox__box {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
  }

  .base-checkbox__icon {
    opacity: 1;
    transform: scale(1);

    &:after {
      left: 2px; top: 5px;
      width: 12px; height: 2px;
      border: 0;
      background: #FFF;
      border-radius: 1px;
      content: '';
    }
  }
}

.base-checkbox__label {
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0;
  text-align: center;
  color: #000;
}
</style>
