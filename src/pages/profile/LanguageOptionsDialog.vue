<template>
  <q-dialog v-model="isActive" :transition-duration="DIALOG_TRANSITION_DURATION" @before-hide="backToProfile">
    <q-card class="settings-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ t('pages.profile.languageSettings') }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>

      <q-card-section>
        <q-select
          v-model="lang.nativeName"
          class="q-mb-md"
          :options="langOptions"
          :label="t('pages.profile.appLanguage')"
          dense
          borderless
          emit-value
          map-options
          options-dense
          @update:model-value="setLocale($event)"
        />
        <q-select
          v-model="userSettingsStorage.items.standardTagsLocale"
          :options="langOptions"
          :label="t('pages.profile.itemsTagsLanguage')"
          dense
          borderless
          emit-value
          map-options
          options-dense
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import languages from 'quasar/lang/index.json'
import { type AvailableLocale, availableLocales } from '@/i18n'
import { userSettingsStorage } from '@/utils/localStorage'
import { setLocale } from '@/utils/locale'

const appLanguages = languages.filter((lang) => availableLocales.includes(lang.isoName as AvailableLocale))
const langOptions = appLanguages.map((lang) => ({
  label: lang.nativeName,
  value: lang.isoName,
}))
const { lang } = useQuasar()
const { t } = useI18n()
const router = useRouter()

const isActive = ref(true)
const DIALOG_TRANSITION_DURATION = 300
function backToProfile() {
  setTimeout(() => router.replace({ name: 'Profile' }), DIALOG_TRANSITION_DURATION)
}
</script>
