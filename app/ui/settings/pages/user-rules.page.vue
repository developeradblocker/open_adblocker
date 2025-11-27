<template>
  <div class="user-rules-page user-rules">
    <BaseBox with-header>
      <h3 class="user-rules__title">User rules</h3>
      <p class="user-rules__description">Customize your ad-blocking experience with custom-defined rules.</p>
      <div class="user-rules__attention">
        <BaseSvg
          class="attention__icon"
          src="../icons/info-rounded.svg"
        />
        For experienced users only
      </div>
      <BaseEditor class="user-rules__editor" v-model="userRules"/>
      <div class="user-rules__controls">
        <BaseButton
         :type="BaseButtonType.primary"
         :disabled="!hasChanges"
         @click="onSave"
         label="Save"
        />
        <BaseImport @change="onImport" accept="txt">
          <template #default="{ input }">
            <BaseButton
              data-test="import"
              label="Import settings" :type="BaseButtonType.secondary" @click="initImport(input)"/>
          </template>
        </BaseImport>
        <BaseButton
         :type="BaseButtonType.secondary"
         label="Export"
         @click="onExport"
        />
      </div>
    </BaseBox>
    <BaseModal
      class="user-rules__save-modal"
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
import { useExternalManualBlocking } from '@/modules/features/manual-blocking/external/manual-blocking.setup'
import { exportData, ExportFormat, ExportTypes } from '@/ui/settings/utils/export-data'
import { importData } from '@/ui/settings/utils/import-data'
import { BaseButtonType } from '@/ui/shared/components/button/base-button.types'
import BaseButton from '@/ui/shared/components/button/base-button.vue'
import { logger } from '@/utils/logger/logger'
import { computed, onMounted, Ref, ref, watch } from 'vue'
import { NavigationGuardNext, onBeforeRouteLeave, RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'
import BaseBox from '../components/base/base-box.vue'
import BaseEditor from '../components/base/base-editor.vue'
import BaseImport from '../components/base/base-import.vue'
import BaseModal from '../components/base/base-modal.vue'
import { useSettingsStore } from '../store/settings.store'

const $store = useSettingsStore()
const $userRules = useExternalManualBlocking()

const nextNavigation: Ref<() => void> = ref(null)
const userRules = ref('')
const showSaveModal = ref(false)

const hasChanges = computed(() => {
  return userRules.value !== $store.stringUserRules
})

const initImport = async (input: HTMLInputElement): Promise<void> => {
  input.click()
}

const onImport = async (event: InputEvent): Promise<void> => {
  $store.resetSnackbar()
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    target.value = null
    return
  }

  try {
    $store.setShowLoader(true)
    const content = await importData(file, ExportFormat.txt)
    const success = await $userRules.import(content.split('\n'))
    if (!success) {
      $store.setSnackbar({
        message: 'Couldn\'t import user rules. Please retry',
        type: 'error'
      })
      $store.setShowLoader(false)
      return
    }

    $store.setSnackbar({
      message: 'User rules were imported successfully',
      type: 'info'
    })
  } catch (error) {
    logger.error('Couldn\'t import user rules due to error', error)
    $store.setSnackbar({
      message: 'Couldn\'t import user rules. Please retry',
      type: 'error'
    })
  } finally {
    $store.setShowLoader(false)
    target.value = null
  }
}

const onExport = async (): Promise<void> => {
  $store.resetSnackbar()
  await exportData<string>(ExportTypes.userRules, $store.stringUserRules, ExportFormat.txt)
}

const onSave = async (): Promise<void> => {
  $store.setShowLoader(true)
  const content = userRules.value.split('\n')
  const success = await $userRules.import(content)

  if (!success) {
    $store.setSnackbar({
      message: 'Couldn\'t save changes. Please retry',
      type: 'error'
    })
    $store.setShowLoader(false)
    return
  }

  $store.settings.filters.userRules = content
  $store.setSnackbar({
    message: 'Changes were saved successfully',
    type: 'info'
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
  () => $store.settings.filters.userRules,
  () => {
    userRules.value = $store.settings.filters.userRules.join('\n')
  }
)

onMounted(() => {
  userRules.value = $store.stringUserRules
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
.user-rules__title {
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
  color: #2D2A3C;
  margin: 0 0 10px;
}

.user-rules__description {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: var(--primary-color);
  margin-bottom: 24px;
}

.user-rules__attention {
  padding: 12px 16px;
  width: fit-content;
  background: #FDF4E2;
  border-radius: 8px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  font-family: Lato;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #6B4906;
}

.user-rules__editor {
  margin-top: 28px;
}

.user-rules__controls {
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

.user-rules__save-modal {
  .base-button {
    width: 170px;
    height: 40px;
    font-weight: 700;
  }
}
</style>
