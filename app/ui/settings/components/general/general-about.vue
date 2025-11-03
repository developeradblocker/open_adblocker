<template>
  <BaseBox class="general-about about">
    <div class="about__content">
      <h4 class="about__title">About Open AdBlocker</h4>
      <p class="about__version">Version {{ version }} <br>
        DNR rulesets v{{dnrVersion}}
      </p>
      <div class="about__links">
        <span
          data-test="policy"
          @click="openPolicy" class="about__link">Privacy Policy</span>
        <span
          data-test="terms"
          @click="openTerms" class="about__link">Terms and Conditions</span>
      </div>
    </div>
    <div class="about__actions">
      <BaseButton
        data-test="github"
        label="Github" :type="BaseButtonType.secondary" @click="openGithub" icon="link" />
      <BaseButton
        data-test="website"
        label="Website" :type="BaseButtonType.secondary" @click="openWebsite" icon="link" />
    </div>
  </BaseBox>
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

import BaseBox from '@/ui/settings/components/base/base-box.vue'
import BaseButton from '@/ui/shared/components/button/base-button.vue'
import { BaseButtonType } from '@/ui/shared/components/button/base-button.types'
import { GITHUB_LINK, PRIVACY_POLICY_LINK, TERMS_LINK, WEB_PAGE_LINK } from '@/ui/shared/constants'
// @ts-expect-error
import { getVersion } from '@adguard/dnr-rulesets/utils'

const { version } = chrome.runtime.getManifest()
const dnrVersion = getVersion()
const openPolicy = async (): Promise<void> => {
  await chrome.tabs.create({
    url: PRIVACY_POLICY_LINK
  })
}

const openTerms = async (): Promise<void> => {
  await chrome.tabs.create({
    url: TERMS_LINK
  })
}

const openGithub = async (): Promise<void> => {
  await chrome.tabs.create({
    url: GITHUB_LINK
  })
}
const openWebsite = async (): Promise<void> => {
  await chrome.tabs.create({
    url: WEB_PAGE_LINK
  })
}
</script>

<style scoped>
.about {
  display: flex;
  align-items: flex-start;
}

.about__content {
  flex: 1;
}

.about__title {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  margin: 0 0 12px;
}

.about__version {
  color: var(--primary-color);
  margin-bottom: 12px;
}

.about__links {
  color: var(--primary-color);
  display: flex;
  gap: 12px;
}

.about__link {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  text-decoration: underline;
  cursor: pointer;
}

.about__actions {
  display: flex;
  gap: 12px;
}
</style>
