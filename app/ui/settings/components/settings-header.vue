<template>
  <div class="settings-header">
    <BaseSvg
        class="settings-header__bg settings-header__bg--left"
        src="../icons/settings-header-left.svg"
      /> <BaseSvg
        class="settings-header__bg settings-header__bg--right"
        src="../icons/settings-header-right.svg"
      />
    <div class="settings-header__logo">
      <BaseSvg
        class="settings-header__icon"
        src="../icons/logo.svg"
      />
      <h2 class="settings-header__title">Open AdBlocker</h2>
    </div>
    <div class="settings-header__version">Version {{ version }}</div>
    <div class="settings-header__bottom"/>
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
import { getVersion } from '@/ui/settings/utils/get-version'

const version = getVersion()
</script>

<style lang="less" scoped>
.settings-header {
  overflow: hidden;
  border-radius: 20px 20px 0 0;
  color: #FFF;
  display: flex;
  justify-content: space-between;
  padding: 28px 32px;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(138.35deg, #4557FF -3.55%, #2739E7 82.09%);
}

.settings-header__bg {
  position: absolute;
}

.settings-header__bg--left {
  left: 100px;
}

.settings-header__bg--right {
  right: 0;
}

.settings-header__logo {
  display: flex;
  align-items: center;
  gap: 18px;
}

.settings-header__icon {
  width: 40px;
  height: 40px;
  fill: #FFF;
}

.settings-header__bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(-90deg, #3143F1 36.54%, #FFFFFF 100%);
}

.settings-header__title {
  margin: 0;
  padding: 0;
  line-height: 24px;
  font-size: 24px;
}

.settings-header__version {
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;

}
</style>
