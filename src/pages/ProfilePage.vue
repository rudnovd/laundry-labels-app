<template>
  <q-page class="profile-page q-pa-sm">
    <section class="actions">
      <q-btn
        v-if="isOnline && appSettingsStore.appInstallation?.showInstallButton"
        color="primary"
        :label="t('pages.profile.installApp')"
        icon="install_mobile"
        @click="appSettingsStore.appInstallation?.event.prompt()"
      />
      <q-btn
        v-if="isOnline && !userSettingsStorage.autoUpdateApp && appSettingsStore.appHasUpdate"
        color="primary"
        :label="t('pages.profile.updateApp')"
        icon="upgrade"
        @click="updateAppFromEvent"
      />
      <q-btn color="primary" :label="t('pages.profile.coreSettings')" icon="settings" @click="showCoreOptions = true" />
      <q-btn
        color="primary"
        :label="t('pages.profile.languageSettings')"
        icon="translate"
        @click="showLanguageOptions = true"
      />
      <q-btn
        color="primary"
        :label="t('pages.profile.updatePassword')"
        icon="password"
        :to="{ name: 'Update password' }"
      />
      <q-btn
        :disable="!items.length"
        color="primary"
        :label="t('pages.profile.exportItems')"
        icon="upload"
        @click="exportItems"
      />
      <q-btn color="primary" :label="t('pages.profile.importItems')" icon="download" @click="importItems" />
      <q-btn
        v-if="isOnline && userStore.user?.id"
        color="primary"
        :label="t('common.signOut')"
        icon="logout"
        @click="showSignOutDialog"
      />
    </section>

    <section class="app-version">
      {{ t('pages.profile.appVersion') }}: {{ appVersion }}
      <a href="https://github.com/rudnovd/laundry-labels-app" rel="noopener" target="_blank">
        <img src="/icons/social/github-mark.svg" width="16" />
      </a>
    </section>

    <teleport to="body">
      <q-dialog v-model="showCoreOptions">
        <q-card class="settings-card">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ t('pages.profile.coreSettings') }}</div>
            <q-space />
            <q-btn v-close-popup icon="close" flat round dense />
          </q-card-section>

          <q-card-section>
            <q-toggle
              v-model="userSettingsStorage.autoUpdateApp"
              color="brand"
              :label="t('pages.profile.autoUpdateApp')"
            />
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

      <q-dialog v-model="showLanguageOptions">
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
      <import-items-dialog v-if="showImportItemsDialog" v-model="showImportItemsDialog" :items="importedItems" />
    </teleport>

    <router-view />
  </q-page>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import languages from 'quasar/lang/index.json'
import { useFileSystemAccess } from '@vueuse/core'
import { availableLocales, type AvailableLocale } from '@/i18n'
import { useAppSettingsStore } from '@/store/settings'
import { useUserStore } from '@/store/user'
import useItems from '@/composables/useItems'
import { userSettingsStorage } from '@/utils/localStorage'
import { setLocale } from '@/utils/locale'
import type { Item } from '@/types/item'
import { useItemsStore } from '@/store/items'
const ImportItemsDialog = defineAsyncComponent(() => import('@/components/dialogs/ImportItemsDialog.vue'))

const appVersion = import.meta.env.__APP_VERSION__
const appLanguages = languages.filter((lang) => availableLocales.includes(lang.isoName as AvailableLocale))
const langOptions = appLanguages.map((lang) => ({
  label: lang.nativeName,
  value: lang.isoName,
}))

const { loading, dialog, notify, lang } = useQuasar()
const userStore = useUserStore()
const appSettingsStore = useAppSettingsStore()
const router = useRouter()
const { t } = useI18n()

const isOnline = computed(() => userStore.isOnline)
const { items } = useItems()
const { getStandardSymbols, getStandardTags } = useItemsStore()
watch(() => userSettingsStorage.value.locale, getStandardSymbols)
watch(() => userSettingsStorage.value.items.standardTagsLocale, getStandardTags)

const showLanguageOptions = ref(false)
const showCoreOptions = ref(false)

async function showSignOutDialog() {
  dialog({
    title: t('common.signOut'),
    message: t('pages.profile.signOut'),
    cancel: t('common.cancel'),
  }).onOk(async () => {
    loading.show({ message: t('pages.profile.signingOut') })
    try {
      await userStore.signOut()
      notify({ type: 'positive', message: t('notifications.signOutSuccess') })
      router.push({ name: 'Home' })
    } finally {
      loading.hide()
    }
  })
}

function updateAppFromEvent() {
  window.dispatchEvent(new CustomEvent('update-app'))
}

async function exportItems() {
  const { saveAs, data } = useFileSystemAccess()
  data.value = JSON.stringify(items.value)
  try {
    await saveAs({ suggestedName: `laundry-labels-items-${Date.now()}.json` })
    notify({ type: 'positive', message: t('notifications.exportSuccess') })
  } catch (error) {
    console.info(error)
  }
}

const showImportItemsDialog = ref(false)
const importedItems = ref<Array<Item>>([])
async function importItems() {
  const { data, open } = useFileSystemAccess()
  try {
    await open()
    if (!data.value || typeof data.value !== 'string') return
    for (const item of JSON.parse(data.value)) importedItems.value.push(item)
    showImportItemsDialog.value = true
  } catch (error) {
    console.error(error)
  }
}
</script>

<style>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  .actions {
    display: grid;
    gap: 1rem;
  }

  .app-version {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    & > a {
      display: flex;
    }
  }

  .settings-card {
    width: clamp(300px, 30vw, 500px);
  }
}
</style>
