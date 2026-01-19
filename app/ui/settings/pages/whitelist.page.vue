<template>
  <div class="whitelist-page whitelist">
    <BaseBox with-header>
      <h3 class="whitelist__title">Whitelist</h3>
      <p class="whitelist__description">Open AdBlocker will not be active on websites from this list:</p>
      <BaseEditor class="whitelist__editor" v-model="whitelist"/>
      <div class="whitelist__controls">
        <BaseButton
         :type="BaseButtonType.primary"
         :disabled="!hasChanges"
         @click="onSave"
         label="Save"
         data-test="save"
        />
        <BaseImport @change="onImport" accept=".txt">
          <template #default="{ input }">
            <BaseButton
              data-test="import"
              label="Import"
              :type="BaseButtonType.secondary"
              @click="initImport(input)"/>
          </template>
        </BaseImport>
        <BaseButton
         :type="BaseButtonType.secondary"
         label="Export"
         @click="onExport"
         data-test="export"
        />
      </div>
    </BaseBox>
    <BaseModal
      class="whitelist__save-modal"
      title="Save changes"
      subtitle="Do you want to save changes before leaving this page?"
      v-if="showSaveModal"
    >
      <template #controls>
        <BaseButton
         :type="BaseButtonType.primary"
          label="Save"
          @click="onModalResponse(true)"
        />
        <BaseButton
         :type="BaseButtonType.secondary"
          label="Discard"
          @click="onModalResponse(false)"
        />
      </template>
    </BaseModal>
  </div>
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
import { useExternalWhitelist } from '@/modules/whitelist/external/utils'
import { BaseButtonType } from '@/ui/shared/components/button/base-button.types'
import BaseButton from '@/ui/shared/components/button/base-button.vue'
import { computed, onMounted, Ref, ref, watch } from 'vue'
import BaseBox from '../components/base/base-box.vue'
import BaseEditor from '../components/base/base-editor.vue'
import BaseImport from '../components/base/base-import.vue'
import { useSettingsStore } from '../store/settings.store'
import { exportData, ExportFormat, ExportTypes } from '../utils/export-data'
import { importData } from '../utils/import-data'
import { logger } from '@/utils/logger/logger'
import { NavigationGuardNext, onBeforeRouteLeave, RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'
import { SnackbarId } from '@/ui/shared/components/snackbar/base-snackbar.types'
import { useUserActivity } from '@/modules/user-activity/external/utils'
import { ClickEventToAction } from '@/modules/user-activity/common/user-activity.types'
import { ElementsUI } from '@/modules/user-activity/common/user-activity.types'
import { SETTINGS_ROUTE } from '../router/route-names'

const $store = useSettingsStore()
const $whitelist = useExternalWhitelist()
const $activity = useUserActivity()

const whitelist = ref('')
const nextNavigation: Ref<() => void> = ref(null)
const showSaveModal = ref(false)

const hasChanges = computed(() => {
  return whitelist.value !== $store.stringWhiteList
})

const initImport = async (input: HTMLInputElement): Promise<void> => {
  $activity.click(ElementsUI.import, {
    page: SETTINGS_ROUTE.WHITELIST,
    to: ClickEventToAction.importWhitelist
  })
  $store.resetSnackbar()
  input.click()
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
    const content = await importData(file, ExportFormat.txt)
    const savedList = await $whitelist.save(content, false)
    if (!savedList) {
      $store.setSnackbar({
        message: 'Couldn\'t import the whitelist. Please retry',
        type: 'error',
        trackActivity: true,
        snackbarId: SnackbarId.importWhitelist
      })
      return
    }

    $store.settings.filters.whiteList.domains = savedList
    $store.setSnackbar({
      message: 'Whitelist was imported successfully',
      type: 'info',
      trackActivity: true,
      snackbarId: SnackbarId.importWhitelist
    })
  } catch (error) {
    logger.error('Couldn\'t import the whitelist due to error', error)
    $store.setSnackbar({
      message: 'Couldn\'t import the whitelist. Please retry',
      type: 'error',
      trackActivity: true,
      snackbarId: SnackbarId.importWhitelist
    })
  } finally {
    $store.setShowLoader(false)
    target.value = null
  }
}

const onExport = async (): Promise<void> => {
  $store.resetSnackbar()
  $activity.click(ElementsUI.export, {
    page: SETTINGS_ROUTE.WHITELIST,
    to: ClickEventToAction.exportWhitelist
  })

  await exportData<string>(ExportTypes.whitelist, $store.stringWhiteList, ExportFormat.txt)
}

const onSave = async (): Promise<void> => {
  $store.setShowLoader(true)
  $activity.click(ElementsUI.save, {
    page: SETTINGS_ROUTE.WHITELIST,
    to: ClickEventToAction.saveWhitelist
  })
  const savedList = await $whitelist.save(whitelist.value)

  if (!savedList) {
    $store.setSnackbar({
      message: 'Couldn\'t save changes. Please retry',
      type: 'error',
      trackActivity: true,
      snackbarId: SnackbarId.saveWhitelist
    })
    $store.setShowLoader(false)
    return
  }

  $store.settings.filters.whiteList.domains = savedList
  $store.setSnackbar({
    message: 'Changes were saved successfully',
    type: 'info',
    trackActivity: true,
    snackbarId: SnackbarId.saveWhitelist
  })
  $store.setShowLoader(false)
}
const onModalResponse = async (shouldSave: boolean): Promise<void> => {
  if (shouldSave) {
    await onSave()
  }

  nextNavigation.value()
}

watch(
  () => $store.settings.filters.whiteList.domains,
  () => {
    whitelist.value = $store.stringWhiteList
  }
)

onMounted(() => {
  whitelist.value = $store.stringWhiteList
  $activity.visitPage(SETTINGS_ROUTE.WHITELIST)
})

onBeforeRouteLeave((to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) => {
  if (hasChanges.value) {
    nextNavigation.value = () => next()
    showSaveModal.value = true
  } else {
    next()
  }
})
</script>

<style lang="less" scoped>
.whitelist__title {
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
  color: #2D2A3C;
  margin: 0 0 10px;
}

.whitelist__description {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: var(--primary-color);
  margin-bottom: 24px;
}

.whitelist__editor {
  margin-top: 28px;
}

.whitelist__controls {
  margin-top: 28px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  row-gap: 12px;

  .base-button {
    width: 228px;
    height: 40px;
    font-weight: 700;
  }
}

.whitelist__save-modal {
  .base-button {
    width: 170px;
    height: 40px;
    font-weight: 700;
  }
}
</style>
