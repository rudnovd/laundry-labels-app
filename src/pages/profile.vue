<template>
  <section class="profile-page">
    <ProfileData />
    <ProfileActions />
    <section class="app-data">
      {{ t('pages.profile.appVersion') }}:
      <component :is="VITE_IS_TAURI ? 'button' : 'a'" v-bind="repositoryLinkProps">
        {{ VITE_APP_VERSION }} ({{ VITE_GIT_COMMIT_SHA }})
      </component>
    </section>
    <teleport to="body">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" v-if="modalsRoutes.includes(route.path)" />
      </router-view>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { openUrl } from '@tauri-apps/plugin-opener'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ProfileActions from '@/components/profile/ProfileActions.vue'
import ProfileData from '@/components/profile/ProfileData.vue'
import { useLaundryDataStore } from '@/stores/laundryData'
import { useUserStore } from '@/stores/user'

const { VITE_APP_VERSION, VITE_IS_TAURI, VITE_GIT_COMMIT_SHA } = import.meta.env
const { t } = useI18n()
const modalsRoutes: ReadonlyArray<RouteLocationRaw> = [
  '/profile/options/core',
  '/profile/options/locale',
  '/profile/update-password',
  '/profile/import-items',
]
const { getStandardSymbols, getStandardTags, getStandardMaterials } = useLaundryDataStore()
const userStore = useUserStore()
watch(
  () => userStore.settings.locale,
  () => {
    getStandardSymbols()
    getStandardMaterials()
  },
)
watch(() => userStore.settings.standardTagsLocale, getStandardTags)
const REPOSITORY_LINK = 'https://github.com/rudnovd/laundry-labels'
const repositoryLinkProps = (() => {
  return VITE_IS_TAURI ? { onClick: () => openUrl(REPOSITORY_LINK) } : { href: REPOSITORY_LINK, target: '_blank' }
})()
</script>

<style>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  .user-data {
    display: grid;
    gap: 4px;
    place-content: center;
    place-items: center;
    width: 100%;
    border-bottom: 1px solid rgb(0 0 0 / 30%);
    .user-data__avatar-img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    .user-data__verification {
      display: grid;
      gap: 0.5rem;
      place-items: center;
      margin-bottom: 8px;
      user-data__verification-button {
        min-width: 300px;
      }
    }
  }
  .profile-actions {
    display: grid;
    grid-template-columns: 300px;
    gap: 1rem;
  }
  .app-data {
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
