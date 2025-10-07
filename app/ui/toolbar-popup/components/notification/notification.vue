<template>
  <transition name="slide-up">
    <div v-if="isVisible" :class="['base-notification', typeClass]">
      <div class="base-notification__content">
        <p class="base-notification__message">{{ message }}</p>
      </div>
    </div>
  </transition>
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
import { computed } from 'vue'

import { NotificationTypes } from '@/ui/toolbar-popup/components/notification/notification.types'

interface NotificationProps {
  message: string
  type?: NotificationTypes
  isVisible: boolean
}

const {
  type = NotificationTypes.info,
  isVisible,
  message
} = defineProps<NotificationProps>()

const typeClass = computed(() => {
  return `base-notification--${type}`
})
</script>

<style scoped lang="less">
.base-notification {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 100vw;
  padding: 8px 16px;
  color: white;

  &--success {
    background-color: #4CAF50;
  }

  &--error {
    background-color: #CC3355;
  }

  &--warning {
    background-color: #FF9800;
  }

  &--info {
    background-color: #2196F3;
  }
}

.base-notification__content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.base-notification__message {
  margin: 0;
  font-size: 12px;
  flex-grow: 1;
  text-align: center;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.5s ease;
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}
</style>
