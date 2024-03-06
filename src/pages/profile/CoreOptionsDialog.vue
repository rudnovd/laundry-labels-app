<template>
  <q-dialog v-model="isActive" persistent>
    <q-card class="settings-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ t('pages.profile.coreSettings') }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense @click="router.replace({ name: 'Profile' })" />
      </q-card-section>

      <q-card-section>
        <q-toggle v-model="userSettingsStorage.autoUpdateApp" color="brand" :label="t('pages.profile.autoUpdateApp')" />
        <div>
          <q-toggle
            v-model="userSettingsStorage.offlineMode"
            class="q-mr-sm"
            color="brand"
            :label="t('pages.profile.offlineMode')"
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

const { t } = useI18n()
const router = useRouter()

const isActive = ref(true)
</script>
