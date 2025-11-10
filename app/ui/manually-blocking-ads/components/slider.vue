<template>
  <div class="slider-container" @click="handleInput">
    <div class="slider__wrapper">
      <input
        type="range"
        :min="minValue"
        :max="maxValue"
        :step="step"
        :value="modelValue"
        class="slider-container__input"
        @input="handleInput"
      />
      <div class="slider-container__ticks">
        <div
          v-for="(tick, index) in (maxValue/step + 1)"
          :key="index"
          class="slider-container__tick"
          :style="tickStyle(index)"
        ></div>
      </div>
    </div>
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

const props = defineProps({
  minValue: {
    type: Number,
    default: 0
  },
  maxValue: {
    type: Number,
    default: 10
  },
  step: {
    type: Number,
    default: 1
  },
  modelValue: {
    type: Number,
    required: true
  }
})
const $emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  if ((event.target as HTMLInputElement).value !== undefined) {
    $emit('update:modelValue', Number((event.target as HTMLInputElement).value))
  }
}

const tickStyle = (tick: number) => {
  const pos = tick / props.maxValue * 100
  return {
    left: `${pos}%`
  }
}
</script>

<style scoped lang="less">
.slider-container {
  position: relative;
  padding: 20px 0 0;
  &::before {
    content: 'MIN';
    left: 0;
  }

  &::after {
    content: 'MAX';
    right: 0;
  }

  &::before,
  &::after {
    color: #9693A5;
    position: absolute;
    top: 0;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    letter-spacing: 0;
    text-align: center;
  }
}

.slider-container__input {
  height: 20px;
  z-index: 9999;
  margin: 0;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;
  position: absolute;
  left: -8px;
  right: -8px;
  top: 50%;
  bottom: 0;
  transform: translateY(-50%);
  background: transparent;
}

.slider-container__ticks {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
}

.slider-container__tick {
  position: absolute;
  width: 2px;
  height: 8px;
  background-color: #5A6BFA;
  transform: translateY(-50%);
  top: 50%;
}

.slider-container__input::-webkit-slider-thumb {
  appearance: none;
  background: #5A6BFA;
  width: 18px;
  height: 18px;
  border: 2px solid #FFF;
  border-radius: 50%;
}
.slider-container__input::-webkit-slider-runnable-track,
.slider-container__input::-moz-range-track {
  background: transparent;
}

.slider__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  padding: 8px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    transform: translateY(-50%);
    background: #5A6BFA;
  }
}

</style>
