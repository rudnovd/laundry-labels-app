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
      <q-btn
        color="primary"
        :label="t('pages.profile.coreSettings')"
        icon="settings"
        :to="{ name: 'Core options', replace: true }"
      />
      <q-btn
        color="primary"
        :label="t('pages.profile.languageSettings')"
        icon="translate"
        :to="{ name: 'Language options', replace: true }"
      />
      <q-btn
        v-if="isOnline && isAuthenticated"
        color="primary"
        :label="t('pages.profile.updatePassword')"
        icon="password"
        :to="{ name: 'Update password', replace: true }"
      />
      <q-btn
        v-if="isSupported"
        :disable="!items.length"
        color="primary"
        :label="t('pages.profile.exportItems')"
        icon="upload"
        @click="exportItems"
      />
      <q-btn
        v-if="isSupported"
        color="primary"
        :label="t('pages.profile.importItems')"
        icon="download"
        @click="importItems"
      />
      <q-btn
        v-if="isOnline && isAuthenticated"
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
      <import-items-dialog v-if="showImportItemsDialog" v-model="showImportItemsDialog" :items="importedItems" />
      <router-view />
    </teleport>
  </q-page>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useFileSystemAccess } from '@vueuse/core'
import { useAppSettingsStore } from '@/store/settings'
import { useUserStore } from '@/store/user'
import useItems from '@/composables/useItems'
import { userSettingsStorage } from '@/utils/localStorage'
import type { Item } from '@/types/item'
import { useItemsStore } from '@/store/items'
const ImportItemsDialog = defineAsyncComponent(() => import('@/components/dialogs/ImportItemsDialog.vue'))

const appVersion = import.meta.env.__APP_VERSION__

const { loading, dialog, notify } = useQuasar()
const userStore = useUserStore()
const appSettingsStore = useAppSettingsStore()
const router = useRouter()
const { t } = useI18n()

const isOnline = computed(() => userStore.isOnline)
const isAuthenticated = computed(() => userStore.user)
const { items } = useItems()
const { getStandardSymbols, getStandardTags, getStandardMaterials } = useItemsStore()
watch(
  () => userSettingsStorage.value.locale,
  () => {
    getStandardSymbols()
    getStandardMaterials()
  },
)
watch(() => userSettingsStorage.value.items.standardTagsLocale, getStandardTags)

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

const { isSupported, data, open, saveAs } = useFileSystemAccess()
async function exportItems() {
  data.value = JSON.stringify(items.value)
  try {
    await saveAs({ suggestedName: `laundry-labels-items-${Date.now()}.json` })
    notify({ type: 'positive', message: t('notifications.exportSuccess') })
  } catch (error) {
    console.info(error)
  } finally {
    data.value = ''
  }
}

const showImportItemsDialog = ref(false)
const importedItems = ref<Array<Item>>([])
async function importItems() {
  try {
    await open()
    if (!data.value || typeof data.value !== 'string') {
      return notify({ type: 'negative', message: t('notifications.wrongFileType') })
    }
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
