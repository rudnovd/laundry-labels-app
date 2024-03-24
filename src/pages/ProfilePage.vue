<template>
  <q-page class="profile-page q-pa-sm">
    <div v-if="isAuthenticated" class="user">
      <q-avatar>
        <img :src="avatarUrl" :alt="`${username} avatar`" width="32px" height="32px" />
      </q-avatar>
      {{ username }}
      <div v-if="!isEmailVerified">
        <strong>Email not verified</strong>
      </div>
    </div>

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
        v-if="isOnline && isAuthenticated && !isGoogleProvider"
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
const isAuthenticated = computed(() => !!userStore.user)
const isGoogleProvider = computed<boolean>(() => userStore.user?.app_metadata?.providers.includes('google'))
const username = computed(() => {
  const name: string = userStore.user?.user_metadata.full_name
  const email = userStore.user?.email
  return name ? `${name} (${email})` : email
})
const avatarUrl = computed(() => userStore.user?.user_metadata.avatar_url ?? '/favicon.svg')
const isEmailVerified = computed(() => userStore.user?.user_metadata?.email_verified ?? false)
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

  .user {
    display: grid;
    gap: 4px;
    place-content: center;
    place-items: center;
    width: 100%;
    border-bottom: 1px solid rgb(0 0 0 / 30%);

    .q-avatar img {
      background: var(--color-brand);
    }

    strong {
      color: rgb(255 0 0);
    }
  }

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
