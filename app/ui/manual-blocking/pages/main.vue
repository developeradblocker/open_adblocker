<template>
  <primary-layout class="main-page">
    <template #header>
      <draggable-heading title="Remove element"/>
    </template>
    <template #content>
      <div class="main-page__content">
        <div class="main-page__list"
             v-if="appliedRules.length"
        >
          <div class="main-page__list-item"
               v-for="(element, index) in appliedRules"
               :key="index"
          >
            <p class="list-item__title">
              Element {{ index + 1 }}
            </p>
            <div class="list-item__controls">
              <base-svg class="controls__action-item action-item--remove"
                        src="../../icons/delete.svg" @click="onRemoveRule(element)"/>
            </div>
          </div>
        </div>
        <div class="main-page__list-placeholder" v-else>
          <base-svg src="../../icons/blocked-elements-placeholder.svg"/>
          <p class="list-placeholder__label">Click the element<br/>you want to remove</p>
        </div>
        <div class="main-page__footer">
          <template v-if="appliedRules.length">
            <base-button label="Reset all" class="footer__action" :type="BaseButtonType.secondary" @click="onResetAll"/>
            <base-button label="Block another element" class="footer__action" :type="BaseButtonType.primary" @click="onSelectElement"/>
          </template>
          <template v-else>
            <base-button label="Cancel" class="footer__action" :type="BaseButtonType.secondary" @click="onClose"/>
          </template>
        </div>
      </div>
    </template>
  </primary-layout>
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
import PrimaryLayout from '@/ui/toolbar-popup/layouts/primary.layout.vue'
import BaseButton from '@/ui/shared/components/button/base-button.vue'
import { BaseButtonType } from '@/ui/shared/components/button/base-button.types'
import { useUIManualBlocking } from '@/modules/features/manual-blocking/ui/manual-blocking.setup'
import { storeToRefs } from 'pinia'
import { useBlockElementStore } from '@/ui/manual-blocking/store/block-element.store'
import DraggableHeading from '@/ui/manual-blocking/components/draggable-heading.vue'

const $store = useBlockElementStore()
const { appliedRules } = storeToRefs($store)
const $manuallyBlockingAdsService = useUIManualBlocking()

const onClose = () => {
  $manuallyBlockingAdsService.stop()
}
const onSelectElement = () => {
  $manuallyBlockingAdsService.startSelecting()
}
const onResetAll = () => {
  $manuallyBlockingAdsService.resetRules(appliedRules.value)
  $manuallyBlockingAdsService.stop()
}
const onRemoveRule = (ruleText: string) => {
  $manuallyBlockingAdsService.resetRules([ruleText])
  $store.removeRule(ruleText)
}
</script>

<style scoped lang="less">

.main-page__footer {
  display: flex;
  flex-flow: row wrap;
  gap: 8px;
}

.footer__action {
  width: 100%;
}

.main-page__content {
  padding: 0 0 16px;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  box-sizing: border-box;
}

.main-page__list {
  flex-grow: 1;
  overflow-y: auto;
}

.main-page__footer {
  padding: 8px 16px 0;
}

.main-page__list-item {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;
  border-bottom: 1px solid #F2F1F3;

  &:last-child {
    border-bottom: none;
  }
}

.list-item__title {
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0;
  color: #57536A;
  margin: 0;
}

.list-item__controls {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.controls__action-item {
  width: 16px;
  height: 16px;
  cursor: pointer;

  &--show {
    fill: #BFBDC7;
  }

  &--hide {
    fill: #5A6BFA;
  }

  &--remove {
    fill: #CC3355;
  }
}

.main-page__list-placeholder {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.list-placeholder__label {
  color: #7D7A90;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0;
  text-align: center;

}

:deep(.primary-layout__content) {
  height: calc(100% - 54px);
}

:deep(.primary-layout__header) {
  border-bottom: 1px solid #D9D8DE;
}
</style>
