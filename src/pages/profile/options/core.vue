<template>
  <BaseDialog v-model="isDialogActive" :title="$t('pages.profile.coreSettings')" class="profile-options-core-page" @close="router.replace('/profile')">
    <div>
      <BaseToggle
        :model-value="userStore.settings.offlineMode"
        :disabled="IS_OFFLINE_APP"
        :label="$t('pages.profile.offlineMode')"
        @update:model-value="updateOfflineMode"
      />
      <BaseTooltip teleport=".profile-options-core-page">
        <template #activator>
          <button class="icon-button">
            <IconHelp />
          </button>
        </template>
        {{ $t('pages.profile.offlineModeTooltip') }}
      </BaseTooltip>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import IconHelp from '~icons/mdi/help'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'
import BaseTooltip from '@/components/base/BaseTooltip.vue'
import { IS_OFFLINE_APP } from '@/constants'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const isDialogActive = ref(true)
const userStore = useUserStore()
function updateOfflineMode(isOffline: boolean) {
  userStore.settings.offlineMode = isOffline
}
</script>

<style>
.base-dialog__content > div {
  display: flex;
}
</style>
