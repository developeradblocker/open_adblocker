<template>
  <PrimaryLayout class="rate-us-notification app">
    <template #header>
      <div
        class="rate-us-notification__header header"
      >
        <div data-test="logo" class="header__logo">
          <BaseSvg
            class="header__logo-icon"
            src="../../icons/logo.svg"
          />
          <h1 class="header__text">
            Open AdBlocker
          </h1>
        </div>
      </div>
    </template>
    <template #content>
      <div class="rate-us-notification__content">
        <div class="rate-us-notification__stars">
          <BaseSvg
            v-for="(color, index) of STAR_COLORS"
            :key="index"
            class="rate-us-notification__icon"
            src="../../icons/star.svg"
            :fill="color"
          />
        </div>
        <h2 class="rate-us-notification__title">Enjoy using Open AdBlocker?</h2>
        <p class="rate-us-notification__description">Recommend us to others <br> by rating us on {{ browser }} store</p>
        <span data-test="reminder" class="rate-us-notification__reminder" @click="onRemindClick">Remind later</span>
        <BaseButton
          full-width
          :type="BaseButtonType.primary"
          label="Rate us!" class="rate-us-notification__action" @click="openRateUs"/>
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
import { browser } from '@/utils/env.constants'
import BaseButton from '@/ui/shared/components/button/base-button.vue'
import { BaseButtonType } from '@/ui/shared/components/button/base-button.types'
import { useUIRateUs } from '@/modules/rate-us/ui/rate-us.setup'
import { BaseUserClickPayload, ClickEventToAction, ElementsUI, UserActivityType, UserClickActivity } from '@/modules/user-activity/common/user-activity.types'
import { RATE_US_URL } from '@/modules/rate-us/constants'
import { POPUP_ROUTE } from '../toolbar-popup/router/route-names'
import { UserActivityMessage } from '@/modules/user-activity/common/user-activity.messages'
import { UserActivityMessages } from '@/modules/user-activity/common/user-activity.messages'
import { useContentBroadcast } from '@/modules/broadcast/content/broadcast.setup'
import { v4 as uuidv4 } from 'uuid'

const sessionId: string = uuidv4()
const STAR_COLORS: string[] = ['#5A6BFA', '#5A6BFA', '#5A6BFA', '#5A6BFA', '#BBCCEE']
const $rateUs = useUIRateUs()
const openRateUs = async (): Promise<void> => {
  const activity: UserClickActivity<BaseUserClickPayload> = {
    sessionId,
    type: UserActivityType.click,
    element: ElementsUI.rateUsButton,
    payload: {
      to: RATE_US_URL,
      page: POPUP_ROUTE.RATE_US
    }
  }
  const message: UserActivityMessage = {
    type: UserActivityMessages.activity,
    payload: activity
  }
  useContentBroadcast().sendMessage(message)

  await chrome.tabs.create({
    url: RATE_US_URL
  })

  $rateUs.closeNotification()
}

const onRemindClick = async (): Promise<void> => {
  const activity: UserClickActivity<BaseUserClickPayload> = {
    sessionId,
    type: UserActivityType.click,
    element: ElementsUI.rateUsReminder,
    payload: {
      to: ClickEventToAction.closePage,
      page: POPUP_ROUTE.RATE_US
    }
  }
  const message: UserActivityMessage = {
    type: UserActivityMessages.activity,
    payload: activity
  }

  useContentBroadcast().sendMessage(message)
  $rateUs.closeNotification()
}

</script>

<style scoped lang="less">
.rate-us-notification__content {
  padding: 36px 16px;
  text-align: center;
}

.rate-us-notification__stars {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.rate-us-notification__icon {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.rate-us-notification__title {
  margin: 12px 0 4px;
  color: #2D2A3C;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
}

.rate-us-notification__description {
  margin: 0 0 16px;
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
}

.rate-us-notification__reminder {
  display: inline-block;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: var(--secondary-color);
  cursor: pointer;
  margin-bottom: 13px;
}

.header {
  position: relative;
  display: flex;
  padding: 14px 16px;
  border-bottom: 1px solid transparent;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__logo-icon {
  width: 24px;
  height: 24px;
  fill: var(--primary-bg-color);
}

.header__text {
  margin: 0;
  font-size: 15px;
  line-height: 20px;
}

.header__icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  fill: #9693A5;
  transform: translate(-50%, -50%);
}
</style>
