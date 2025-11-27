<template>
  <div class="report-issue">
    <BaseModal
    class="report-issue"
    title="Report an issue"
    subtitle="Let us know what we could improve."
    @close="closePopup"
  >
    <template #content>
      <div class="report-issue__form">
          <BaseInput
            v-model="email"
            :error="errors.email"
            placeholder="Your email"
          />
          <BaseTextarea
            v-model="description"
            :error="errors.description"
            :max-chars="MAX_CHARS_DESCRIPTION"
            placeholder="Issue description"
          />
      </div>
    </template>
    <template #controls>
      <BaseButton
        :type="BaseButtonType.primary"
        label="Submit"
        @click="onSubmit"
      />
      <BaseButton
        :type="BaseButtonType.secondary"
        label="Discard"
        @click="onDiscard"
      />
    </template>
  </BaseModal>
  <Loader v-if="reportSendingInProgress" text="Submitting the report" />
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
import BaseModal from '@/ui/settings/components/base/base-modal.vue'
import BaseInput from '@/ui/settings/components/base/base-input.vue'
import BaseButton from '@/ui/shared/components/button/base-button.vue'
import BaseTextarea from '@/ui/settings/components/base/base-textarea.vue'
import Loader from '@/ui/settings/components/loader.vue'
import { useForm } from 'vee-validate'
import { Validators } from '@/ui/settings/validations/validators.types'
import { useExternalSettings } from '@/modules/settings/external/settings.utils'
import { BaseButtonType } from '@/ui/shared/components/button/base-button.types'
import { useSettingsStore } from '../store/settings.store'
import { ref } from 'vue'

const $emit = defineEmits(['close'])
const $settings = useExternalSettings()
const $store = useSettingsStore()
const MAX_CHARS_DESCRIPTION = 800
const reportSendingInProgress = ref(false)

const { errors, defineField, resetForm, submitForm, meta } = useForm({
  validationSchema: {
    email: `${Validators.email}|${Validators.required}`,
    description: `${Validators.required}|${Validators.maxLen}:${MAX_CHARS_DESCRIPTION}`
  },
  initialValues: {
    email: '',
    description: ''
  }
})
const [email] = defineField('email', { validateOnModelUpdate: false })
const [description] = defineField('description', { validateOnModelUpdate: false })

const onSubmit = async (): Promise<void> => {
  await submitForm()

  if (!meta.value.valid) {
    return
  }
  reportSendingInProgress.value = true

  const success = await $settings.reportIssue({
    email: email.value,
    description: description.value.trim()
  })

  reportSendingInProgress.value = false

  if (!success) {
    $store.setSnackbar({
      type: 'error',
      message: 'Couldn\'t submit the report. Please retry'
    })
    return
  }

  $store.setSnackbar({
    type: 'info',
    message: 'Report was submitted successfully'
  })
  closePopup()
}

const onDiscard = async (): Promise<void> => {
  closePopup()
}

const closePopup = () => {
  resetForm({
    values: {
      email: '',
      description: ''
    }
  })
  $emit('close')
}
</script>

<style lang="less" scoped>
.report-issue__form {
  width: 352px;
  display: flex;
  flex-flow: column nowrap;
  row-gap: 4px;

  .base-textarea {
    height: 112px;
  }
}

.report-issue {
  .base-button {
    width: 170px;
    height: 40px;
    font-weight: 700;
  }
}
</style>
