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

import { ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { POPUP_ROUTE } from '@/ui/toolbar-popup/router/route-names'
import { PRIVACY_POLICY_LINK, TERMS_LINK, WEB_PAGE_LINK } from '@/ui/shared/constants'

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
    url: WEB_PAGE_LINK,
    element: ElementsUI.about
  },
  {
    icon: 'policy',
    text: 'Privacy Policy',
    url: PRIVACY_POLICY_LINK,
    element: ElementsUI.privacy
  },
  {
    icon: 'link',
    text: 'Terms and conditions',
    url: TERMS_LINK,
    element: ElementsUI.terms
  }
]

const activity = useUserActivity()
const onLinkClick = async (link: MenuLink): Promise<void> => {
  await activity.click(link.element, {
    page: POPUP_ROUTE.MENU,
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
  fill: #7992FF;
  width: 20px;
  height: 20px;
}
</style>
