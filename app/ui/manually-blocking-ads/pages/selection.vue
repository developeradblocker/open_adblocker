<template>
  <primary-layout class="selection-page">
    <template #header>
      <div class="selection-page__heading">
        <base-svg class="heading__logo" src="../../icons/logo.svg"/>
        <h1 class="heading__title">{{ pageTitle }}</h1>
        <base-svg class="heading__close" src="../../icons/close.svg" @click="onClose"/>
      </div>
    </template>
    <template #content>
      <div class="selection-page__content">
        <div class="selection-page__control">
          <div class="control__slider" v-if="sliderParams.max">
            <p class="slider__title">
              Adjust the slider so the selection matches your expectations
            </p>
            <slider class="slider__control" :max-value="sliderParams.max" :min-value="sliderParams.min" v-model="sliderValue"/>
          </div>
          <div class="control__options">
            <base-checkbox label="Apply to all websites" v-model="applyToAll"/>
            <base-checkbox label="Block similar elements" v-model="blockSimilar"/>
          </div>
        </div>
        <div class="selection-page__footer">
          <base-button :label="previewBtnTitle" class="footer__action" :type="BaseButtonType.secondary" @click="togglePreview"/>
          <base-button label="Reselect" class="footer__action" :type="BaseButtonType.secondary" @click="onReselect"/>
          <base-button label="Block" class="footer__action footer__action--full" :type="BaseButtonType.primary" @click="onBlock"/>
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
import { computed, onMounted, ref } from 'vue'
import Slider from '@/ui/manually-blocking-ads/components/slider.vue'
import BaseCheckbox from '@/ui/shared/components/checkbox/base-checkbox.vue'
import { useRoute, useRouter } from 'vue-router'
import { Route } from '@/ui/manually-blocking-ads/router/route-names'
import { useUIManuallyBlockingAds } from '@/modules/manually-blocking-ads/ui/manually-blocking-ads.setup'

const $router = useRouter()
const $route = useRoute()

const isPreviewMode = ref(false)
const applyToAll = ref(false)
const blockSimilar = ref(false)
const sliderValue = ref(1)
const sliderParams = ref({
  min: 0,
  max: 0
})
const pageTitle = computed<string>(() => {
  return isPreviewMode.value ? 'Preview removal' : 'Remove element'
})
const previewBtnTitle = computed<string>(() => {
  return isPreviewMode.value ? 'Exit preview' : 'Preview'
})

const togglePreview = () => {
  isPreviewMode.value = !isPreviewMode.value
}
const onReselect = () => {
  $router.push({ name: Route.main })
}
const onBlock = () => {
  $router.push({ name: Route.main })
}
const onClose = () => {
  useUIManuallyBlockingAds().stop()
}
onMounted(() => {
  sliderValue.value = parseInt($route.query.elementIndex as string)
  sliderParams.value = {
    min: 0,
    max: parseInt($route.query.elementsInTraversedTree as string)
  }
})
</script>

<style scoped lang="less">

.selection-page__footer {
  display: flex;
  flex-flow: row wrap;
  gap: 8px;
}

.footer__action {
  width: calc(50% - 4px);

  &--full {
    flex-grow: 1;
  }
}

.selection-page__heading {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 15px 16px;
}

.selection-page__content {
  padding: 16px 0;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  box-sizing: border-box;
}
.selection-page__main {
  flex-grow: 1;
  overflow-y: auto;
  padding: 48px 24px 28px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
}

.selection-page__footer {
  padding: 8px 16px 0;
}

.selection-page__list-item {
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

.selection-page__control {
  padding: 48px 24px 24px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
}

.control__slider {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  .slider__title {
    color: #4A465D;
    width: 100%;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0;
    text-align: center;
    margin: 0;
  }

  .slider__control {
    width: 100%;
  }
}

.control__options {
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  width: 100%;
}

.heading__title {
  margin: 0;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
}

.heading__logo {
  width: 22px;
  fill: #3A40EF;
}

.heading__close {
  cursor: pointer;
  width: 20px;
  fill: #9693A5;
}

:deep(.primary-layout__content) {
  height: calc(100% - 54px);
}

:deep(.primary-layout__header) {
  border-bottom: 1px solid #D9D8DE;
}
</style>
