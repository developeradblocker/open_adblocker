<template>
  <div class="loader" data-test="loader">
    <div class="loader__overlay">
      <div class="loader__container">
          <BaseSvg src="../icons/loader.svg" class="loader__icon"/>
          <p class="loader__text">{{text}}</p>
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

defineProps<{text: string}>()
</script>

<style scoped lang="less">
.loader {
  cursor: not-allowed;
}

.loader__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.loader__container {
  border: 1px solid #D9D8DE;
  border-radius: 12px;
  padding: 20px 24px;
  min-width: 210px;
  background: white;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  z-index: 9999999;
}

.loader__icon {
  width: 20px;
  height: 20px;
  fill: var(--secondary-color);
  animation: rotate 1.5s linear infinite;
}

.loader__text {
  margin: 0;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #4A465D;
}

</style>
