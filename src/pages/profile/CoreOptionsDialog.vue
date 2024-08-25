<template>
  <q-dialog v-model="isActive" @hide="router.replace({ name: 'Profile' })">
    <q-card class="settings-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ t('pages.profile.coreSettings') }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>

      <q-card-section>
        <q-toggle
          v-model="userSettingsStorage.autoUpdateApp"
          :disable="IS_OFFLINE_APP"
          color="brand"
          :label="t('pages.profile.autoUpdateApp')"
        />
        <div>
          <q-toggle
            :model-value="userSettingsStorage.offlineMode"
            :disable="IS_OFFLINE_APP"
            class="q-mr-sm"
            color="brand"
            :label="t('pages.profile.offlineMode')"
            @update:model-value="updateOfflineMode"
          />
          <q-btn icon="help" flat round dense size="12px">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 20]">
              {{ t('pages.profile.offlineModeTooltip') }}
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { userSettingsStorage } from '@/utils/localStorage'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { IS_OFFLINE_APP } from '@/constants'
const { t } = useI18n()
const router = useRouter()
const isActive = ref(true)
function updateOfflineMode(isOffline: boolean) {
  userSettingsStorage.value.offlineMode = isOffline
  userSettingsStorage.value.previousOfflineMode = isOffline
}
</script>
