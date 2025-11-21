<template>
  <div class="app">
    <div class="app__content">
      <div class="app__navigation">
        <div class="app__nav">
          <RouterLink
            v-for="link of NAV_LINKS"
            :key="link.route"
            class="app__nav-link"
            :class="{ 'app__nav-link--active': isActive(link.route) }"
            :to="{ name: link.route }"
          >
            {{ link.text }}
          </RouterLink>
        </div>
      </div>
      <div class="app__view">
        <router-view />
      </div>
    </div>
    <Loader v-if="$store.showLoader" text="Applying changes" />
    <BaseSnackbar :value="$store.snackbar" @close="$store.setSnackbar(null)"/>
  </div>
</template>
<script lang="ts" setup>
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
import Loader from '@/ui/settings/components/loader.vue'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'
import { useSettingsStore } from '@/ui/settings/store/settings.store'
import BaseSnackbar from '@/ui/shared/components/snackbar/base-snackbar.vue'
import { useRoute } from 'vue-router'

interface MenuNavLink {
  route: SETTINGS_ROUTE
  text: string
}

const NAV_LINKS: MenuNavLink[] = [
  {
    route: SETTINGS_ROUTE.GENERAL,
    text: 'General'
  },
  {
    route: SETTINGS_ROUTE.GROUPS,
    text: 'Filters'
  },
  {
    route: SETTINGS_ROUTE.USERRULES,
    text: 'User rules'
  }
]

const $route = useRoute()
const isActive = (route: SETTINGS_ROUTE): boolean => {
  return $route.name === route || $route.path.includes(route.toLowerCase())
}

const $store = useSettingsStore()

</script>
<style lang="less" scoped>
.app {
  min-height: 100vh;
  width: 100%;
  position: relative;
  height: 100%;
  margin: 0;
  padding: 48px;
  background: linear-gradient(180deg, #F1F5FD 0%, #E1EAFC 100%) fixed;
}

.app__content {
  position: relative;
  width: 100%;
  max-width: 772px;
  margin: auto;
}

.app__navigation {
  position: absolute;
  top: 0;
  right: calc(100% + 48px);
  bottom: 0;
  display: block;
}

.app__nav {
  position: sticky;
  top: 120px;
  width: max-content;
}

.app__view {
  width: 100%;
  max-width: 772px;
  margin: auto;
}

.app__nav-link {
  text-decoration: none;
  color: var(--disabled-color);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  display: block;
  width: 100%;
  margin: 0 0 16px;
  padding: 0;
  text-align: right;

  &:hover {
    color: #2D2A3C;
  }
}

.app__nav-link--active {
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
  color: #2D2A3C;
}
</style>
