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
  <ul class="menu-links">
    <li
      v-for="link of LINKS"
      :key="link.url"
      data-test="link"
      class="menu-links__item"
      @click="onLinkClick(link)"
    >
      <BaseSvg
        class="menu-links__item-icon"
        :src="`../icons/${link.icon}.svg`"
      />
      <span class="menu-links__item-text">
        {{ link.text }}
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">

import { ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { ROUTE } from '@/ui/toolbar-popup/router/route-names'

export interface MenuLink {
  icon: string
  text: string
  url: string
  element: ElementsUI
}

const LINKS: MenuLink[] = [
  {
    icon: 'info',
    text: 'About',
    url: 'https://openadblocker.com/about-us/',
    element: ElementsUI.about
  },
  {
    icon: 'policy',
    text: 'Privacy Policy',
    url: 'https://openadblocker.com/privacy-policy/',
    element: ElementsUI.privacy
  },
  {
    icon: 'link',
    text: 'Terms and conditions',
    url: 'https://github.com/developeradblocker/open_adblocker?tab=readme-ov-file#open-ad-blocker',
    element: ElementsUI.terms
  }
]

const activity = useUserActivity()
const onLinkClick = async (link: MenuLink): Promise<void> => {
  await activity.click(link.element, {
    page: ROUTE.MENU,
    to: link.url
  })
  if (link.url) {
    chrome.tabs.create({ url: link.url })
  }
}
</script>

<style scoped lang="less">
.menu-links {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.menu-links__item {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  gap: 12px;

  &:hover {
    cursor: pointer;
    background: var(--secondary-bg-color);
  }
}

.menu-links__item-icon {
  width: 20px;
  height: 20px;
}
</style>
