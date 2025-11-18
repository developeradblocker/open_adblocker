<template>
  <BaseBox with-header class="general-main main">
    <h3 class="main__title">General</h3>
    <p class="main__description">Import and export settings between browsers or accounts for a quick configuration.</p>

    <div class="main__actions">
      <BaseImport @change="onImport" accept="application/json">
        <template #default="{ input }">
          <BaseButton
            data-test="import"
            label="Import settings" :type="BaseButtonType.secondary" @click="initImport(input)"/>
        </template>
      </BaseImport>
      <BaseButton
        data-test="export"
        label="Export settings" :type="BaseButtonType.secondary" @click="onExport"/>
    </div>

    <p class="main__validation-error" v-if="importError">
      {{ importError }}
    </p>

    <div class="main__separator"/>

    <div class="main__cards">
      <BaseCard
        disabled
        data-test="report"
        label="Report a bug (coming soon)" icon="bug" class="main__card" />
      <BaseCard
        data-test="rate"
        label="Share feedback" icon="rate" class="main__card" @click="onRateUsClicked"/>
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

import { ref } from 'vue'

import BaseBox from '@/ui/settings/components/base/base-box.vue'
import BaseButton from '@/ui/shared/components/button/base-button.vue'
import { BaseButtonType } from '@/ui/shared/components/button/base-button.types'
import BaseCard from '@/ui/settings/components/base/base-card.vue'
import { RATE_US_URL } from '@/modules/rate-us/constants'
import { exportData, ExportFormat, ExportTypes } from '@/ui/settings/utils/export-data'
import { useExternalSettings } from '@/modules/settings/external/settings.utils'
import BaseImport from '@/ui/settings/components/base/base-import.vue'
import { importData, ImportErrorReason, ImportErrors } from '@/ui/settings/utils/import-data'
import { useSettingsStore } from '@/ui/settings/store/settings.store'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { SETTINGS_ROUTE } from '@/ui/settings/router/route-names'
import { ClickEventToAction, ElementsUI } from '@/modules/user-activity/common/user-activity.types'

const $activity = useUserActivity()
const importError = ref<string>(null)
const $settings = useExternalSettings()
const $store = useSettingsStore()
const onRateUsClicked = async (): Promise<void> => {
  $activity.click(ElementsUI.rateUsButton, {
    page: SETTINGS_ROUTE.GENERAL,
    to: RATE_US_URL
  })
  await chrome.tabs.create({
    url: RATE_US_URL
  })
}

const onExport = async (): Promise<void> => {
  $activity.click(ElementsUI.exportSettings, {
    page: SETTINGS_ROUTE.GENERAL,
    to: ClickEventToAction.exportSettings
  })
  importError.value = null
  await exportData(ExportTypes.settings, await $settings.export(), ExportFormat.json)
}

const initImport = async (input: HTMLInputElement): Promise<void> => {
  $activity.click(ElementsUI.importSettings, {
    page: SETTINGS_ROUTE.GENERAL,
    to: ClickEventToAction.importSettings
  })
  input.click()
  importError.value = null
}

const onImport = async (event: InputEvent): Promise<void> => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    target.value = null
    return
  }

  try {
    $store.setShowLoader(true)
    const content = await importData(file, ExportFormat.json)
    const success = await $settings.import(content)
    if (!success) {
      $activity.settingsImportError(ImportErrorReason.validationError)
      importError.value = ImportErrors[ImportErrorReason.validationError]
      return
    }

    $store.setSettingsInfo(await $settings.get())
    $store.setSnackbar({
      message: 'Successfully imported settings',
      type: 'info'
    })
  } catch (error) {
    // @ts-ignore-error
    const reason = error?.message as ImportErrorReason
    const existingError = ImportErrors[reason]
    $activity.settingsImportError(existingError ? reason : ImportErrorReason.readingError)
    importError.value = existingError ?? ImportErrors[ImportErrorReason.readingError]
  } finally {
    $store.setShowLoader(false)
    target.value = null
  }
}

</script>

<style scoped>
.main__title {
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
  color: #2D2A3C;
  margin: 0 0 10px;
}

.main__description {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: var(--primary-color);
  margin-bottom: 24px;
}

.main__actions {
  display: flex;
  gap: 16px;
}

.main__separator {
  margin: 28px 0;
  height: 1px;
  background: #D9D8DE;
}

.main__validation-error {
  color: #CC3355;
  margin: 12px 0 0;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
}

.main__cards {
  display: flex;
  gap: 28px;
}

.main__card {
  flex: 1;
}
</style>
