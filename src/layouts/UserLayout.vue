<template>
  <q-layout container>
    <q-header class="user-layout-header">
      <q-toolbar>
        <q-btn
          :class="{ invisible: route.name === 'Items' }"
          icon="arrow_back"
          flat
          no-wrap
          padding="0"
          :to="previousPageLink"
          replace
        />
        <q-toolbar-title class="flex items-center">
          <q-btn flat :to="{ name: 'Items' }" :ripple="false" padding="0">
            <l-icon icon="logo" width="32px" height="32px" />
            <span class="q-ml-xs q-mt-sm logo-text">Laundry Labels</span>
          </q-btn>

          <q-space />

          <q-icon v-if="userSettingsStorage.offlineMode || !userStore.isOnline" class="q-mr-sm" name="cloud_off">
            <q-popup-proxy transition-show="flip-up" transition-hide="flip-down">
              <q-banner class="bg-white">
                <q-toggle
                  v-model="userSettingsStorage.offlineMode"
                  color="brand"
                  :label="t('pages.profile.offlineMode')"
                />
                <q-btn icon="help" flat round dense size="12px">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 20]">
                    {{ t('pages.profile.offlineModeTooltip') }}
                  </q-tooltip>
                </q-btn>
              </q-banner>
            </q-popup-proxy>
          </q-icon>

          <q-btn flat icon="person" padding="0" :to="{ name: 'Profile' }" :ripple="false">
            <q-badge v-if="appSettingsStore.appHasUpdate" floating rounded color="red" />
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <KeepAlive :include="keepAliveComponents">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import LIcon from '@/components/LIcon.vue'
import { useAppSettingsStore } from '@/store/settings'
import { useUserStore } from '@/store/user'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { userSettingsStorage } from '@/utils/localStorage'

const keepAliveComponents = ['ItemsPage']

const router = useRouter()
const route = useRoute()
const appSettingsStore = useAppSettingsStore()
const { t } = useI18n()
const userStore = useUserStore()

const previousPageLink = computed<string>(() => {
  if (window.history.state.back === router.currentRoute.value.path) {
    return '/items'
  } else {
    return window.history.state.back || '/items'
  }
})

watch(
  () => userSettingsStorage.value.offlineMode,
  async (isOffline) => {
    if (!isOffline) {
      try {
        const session = await userStore.getSession()
        if (!session) router.replace({ name: 'Sign in' })
      } catch (error) {
        router.replace({ name: 'Sign in' })
      }
    }
  },
)
</script>

<style>
.user-layout-header {
  color: rgb(0 0 0);
  background-color: var(--color-brand);

  /* stylelint-disable-next-line selector-class-pattern */
  .q-toolbar__title:last-child {
    padding-right: 4px;
  }

  .logo-text::first-letter {
    font-family: cursive;
    font-size: 1.2em;
    font-style: italic;
    font-weight: bold;
  }
}
</style>
