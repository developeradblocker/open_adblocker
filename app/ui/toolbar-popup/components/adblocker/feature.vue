<template>
  <div class="ad-blocker-feature">
    <div class="ad-blocker-feature__main">
      <BaseSvg class="ad-blocker-feature__icon" :src="`../icons/${icon}.svg`"/>
      <p class="ad-blocker-feature__label">{{ label }}</p>
      <Popper
        v-if="info"
        :content="info"
        class="ad-blocker-feature__hint"
        hover
        data-test="hint"
        arrow
      >
        <BaseSvg
          @click.prevent.stop
          class="ad-blocker-feature__info"
          src="../icons/info-round.svg"
        />
      </Popper>
    </div>
    <div class="ad-blocker-feature__action">
      <slot name="action" />
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

defineProps<{ label: string, icon: string, info?: string }>()
</script>

<style scoped lang="less">
.ad-blocker-feature {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background-color: var(--secondary-bg-color);

    .ad-blocker-feature__label {
      color: #3C384C;
    }

    .ad-blocker-feature__info {
      fill: #9693A5;
    }
  }
}

.ad-blocker-feature__main {
  display: flex;
  align-items: center;
}
.ad-blocker-feature__icon {
  fill: var(--secondary-color);
  width: 20px;
  height: 20px;
  margin-right: 12px;
}

.ad-blocker-feature__label {
  transition: 0.3s ease;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: #57536A;
  margin: 0 6px 0 0;
}

.ad-blocker-feature__info {
  transition: 0.3s ease;
  fill: var(--disabled-bg-color);
  width: 16px;
  height: 16px;
}

:deep(.ad-blocker-feature__hint) {
  margin: 0 !important;
  border: none !important;
  display: block;
  .popper {
    width: 90%;
  }
}
</style>
