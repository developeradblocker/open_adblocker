<!--
 This file is part of Open Ad Blocker Browser Extension (https://github.com/developeradblocker/open_adblocker).

 Open Ad Blocker Browser Extension is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Open Ad Blocker Browser Extension is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Open Ad Blocker Browser Extension. If not, see <http://www.gnu.org/licenses/>.
-->

<template>
  <div
    class="header"
    :class="{'header--with-border': withBorder}"
  >
    <div data-test="logo" class="header__logo" @click="onLogoClick">
      <BaseSvg
        class="header__logo-icon"
        src="../icons/logo.svg"
      />
      <h1 v-if="!title" class="header__text">
        Open AdBlocker
      </h1>
    </div>
    <h1 v-if="title" class="header__title">
      {{ title }}
    </h1>
    <div
      data-test="menu"
      class="header__menu"
      @click="onMenuClick"
    >
      <BaseSvg
        class="header__menu-icon"
        :src="`../icons/${showMenu ? 'hamburger' : 'close' }.svg`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserActivity } from '@/modules/user-activity/external/utils'
import {
  BaseUserClickPayload,
  ClickEventToAction,
  ElementsUI,
  PageUI
} from '@/modules/user-activity/common/user-activity.types'
import { useRoute } from 'vue-router'

const $emit = defineEmits(['menu-click'])
const props = withDefaults(defineProps<{
  withBorder?: boolean
  title?: string
  showMenu?: boolean
}>(), {
  withBorder: false,
  showMenu: true
})
const activity = useUserActivity()
const $route = useRoute()
const onLogoClick = async (): Promise<void> => {
  await activity.click(ElementsUI.logo, {
    to: 'https://openadblocker.com/',
    page: $route.name as PageUI
  })
  await chrome.tabs.create({ url: 'https://openadblocker.com/' })
}

const onMenuClick = async (): Promise<void> => {
  const element: ElementsUI = props.showMenu ? ElementsUI.menu : ElementsUI.close
  const payload: BaseUserClickPayload = props.showMenu
    ? {
        page: $route.name as PageUI,
        to: ClickEventToAction.openMenu
      }
    : {
        page: $route.name as PageUI,
        to: ClickEventToAction.closePage
      }
  await activity.click(element, payload)
  $emit('menu-click')
}
</script>

<style scoped lang="less">
.header {
  position: relative;
  display: flex;
  padding: 16px;
  border-bottom: 1px solid transparent;
}

.header--with-border {
  border-bottom-color: #D9D8DE;
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

.header__text, .header__title {
  margin: 0;
  font-size: 17px;
  line-height: 20px;
}

.header__title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header__menu {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    cursor: pointer;
    background: var(--secondary-bg-color);

    .header__menu-icon {
      fill: var(--primary-color)
    }
  }
}

.header__menu-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  fill: #9693A5;
  transform: translate(-50%, -50%);
}
</style>
