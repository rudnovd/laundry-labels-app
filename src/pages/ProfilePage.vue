<template>
  <q-page class="profile-page q-pa-sm">
    <section class="actions">
      <q-toggle v-model="userSettings.autoUpdateApp" color="brand" :label="t('meta.autoUpdateApp')" />

      <q-btn
        v-if="isOnline && userStore.settings.installApp?.show"
        color="primary"
        label="Install app"
        icon="install_mobile"
        @click="userStore.settings.installApp?.event.prompt()"
      />

      <q-btn
        v-if="isOnline && !userSettings.autoUpdateApp && userStore.settings.appHasUpdate"
        color="primary"
        :label="t('meta.updateApp')"
        icon="upgrade"
        @click="updateAppFromEvent"
      />

      <q-btn
        v-if="isOnline && userStore.user?._id"
        color="primary"
        :label="t('signOut')"
        icon="logout"
        @click="callLogoutDialog"
      />

      <q-select
        v-model="lang.nativeName"
        :options="langOptions"
        label="Language"
        dense
        borderless
        emit-value
        map-options
        options-dense
        @update:model-value="locale = $event"
      />
    </section>

    <section class="app-version">
      {{ t('meta.appVersion') }}: {{ appVersion }}
      <a href="https://github.com/rudnovd/laundry-labels-app" rel="noopener" target="_blank">
        <img src="/icons/social/github-mark.svg" width="16" />
      </a>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { availableLocales, useLocale } from '@/i18n'
import type { UserSettings } from '@/interfaces/types'
import { useUserStore } from '@/store/user'
import { useLocalStorage, useOnline } from '@vueuse/core'
import { useQuasar } from 'quasar'
import languages from 'quasar/lang/index.json'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const appVersion = import.meta.env.__APP_VERSION__
const appLanguages = languages.filter((lang) => availableLocales.includes(lang.isoName))
const langOptions = appLanguages.map((lang) => ({
  label: lang.nativeName,
  value: lang.isoName,
}))

const { loading, dialog, notify, lang } = useQuasar()
const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()
const isOnline = useOnline()
const userSettings = useLocalStorage('user-settings', {} as UserSettings)
const locale = useLocale()

const callLogoutDialog = () => {
  dialog({
    title: t('dialog.logout'),
    message: t('dialog.signOut'),
    cancel: t('dialog.cancel'),
  }).onOk(() => {
    loading.show()
    userStore
      .signOut()
      .then(() => {
        notify({
          type: 'positive',
          message: t('notification.signOutSuccess'),
        })
        router.push({ name: 'Home' })
      })
      .finally(() => loading.hide())
  })
}

const updateAppFromEvent = () => {
  window.dispatchEvent(new CustomEvent('update-app'))
}
</script>

<style lang="scss" scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
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
</style>
