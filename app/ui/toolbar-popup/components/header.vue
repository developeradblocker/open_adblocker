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
      v-if="withClose"
      data-test="menu"
      class="header__menu"
      @click="onMenuClick"
    >
      <BaseSvg
        class="header__menu-icon"
        :src="`../icons/${menuClosed ? 'hamburger' : 'close' }.svg`"
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
  withClose?: boolean
  withBorder?: boolean
  title?: string
  menuClosed?: boolean
}>(), {
  withClose: true,
  withBorder: false,
  menuClosed: true
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
  const element: ElementsUI = props.menuClosed ? ElementsUI.menu : ElementsUI.close
  const payload: BaseUserClickPayload = props.menuClosed
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
