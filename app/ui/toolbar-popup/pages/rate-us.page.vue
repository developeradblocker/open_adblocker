<template>
  <PrimaryLayout class="rate-us-page">
    <template #header>
      <Header :with-close="false" />
    </template>
    <template #content>
      <div class="rate-us-page__content">
        <div class="rate-us-page__stars">
          <BaseSvg
            v-for="(color, index) of STAR_COLORS"
            :key="index"
            class="rate-us-page__icon"
            src="../icons/star.svg"
            :fill="color"
          />
        </div>
        <h2 class="rate-us-page__title">Enjoy using Open AdBlocker?</h2>
        <p class="rate-us-page__description">Recommend us to others <br> by rating us on {{ browser }} store</p>
        <span data-test="reminder" class="rate-us-page__reminder" @click="onRemindClick">Remind later</span>
        <BaseButton label="Rate us!" class="rate-us-page__action" @click="openRateUs"/>
      </div>
    </template>
  </PrimaryLayout>
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
import Header from '@/ui/toolbar-popup/components/header.vue'
import { POPUP_ROUTE } from '@/ui/toolbar-popup/router/route-names'
import BaseButton from '@/ui/toolbar-popup/components/base-button.vue'
import { RATE_US_URL } from '@/modules/rate-us/constants'
import { browser } from '@/utils/env.constants'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { ClickEventToAction, ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { useRouter } from 'vue-router'

const STAR_COLORS: string[] = ['#5A6BFA', '#5A6BFA', '#5A6BFA', '#5A6BFA', '#BBCCEE']
const $router = useRouter()
const activity = useUserActivity()
const openRateUs = async (): Promise<void> => {
  await activity.click(ElementsUI.rateUsButton, {
    to: RATE_US_URL,
    page: POPUP_ROUTE.RATE_US
  })
  await chrome.tabs.create({
    url: RATE_US_URL
  })
}

const onRemindClick = async (): Promise<void> => {
  await activity.click(ElementsUI.rateUsReminder, {
    page: POPUP_ROUTE.RATE_US,
    to: ClickEventToAction.closePage
  })
  await $router.push({ name: POPUP_ROUTE.HOME })
}

</script>

<style scoped lang="less">
.rate-us-page__content {
  padding: 36px 16px;
  text-align: center;
}

.rate-us-page__stars {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.rate-us-page__icon {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.rate-us-page__title {
  margin: 12px 0 4px;
  color: #2D2A3C;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
}

.rate-us-page__description {
  margin: 0 0 16px;
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
}

.rate-us-page__reminder {
  display: inline-block;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: var(--secondary-color);
  cursor: pointer;
  margin-bottom: 13px;
}
</style>
