<template>
  <BaseDialog
    v-model="isActive"
    class="profile-options-locale-page"
    :title="$t('pages.profile.languageSettings')"
    @close="router.replace('/profile')"
  >
    <div class="locale-settings-item">
      <label for="locale">{{ $t('pages.profile.appLanguage') }}</label>
      <select
        id="locale"
        :value="userStore.settings.locale"
        name="locale"
        @change="changeLocale"
      >
        <option v-for="{ title, value } in locales" :key="value" :value>
          {{ title }}
        </option>
      </select>
    </div>
    <div class="locale-settings-item">
      <label for="tags-locale">{{ $t('pages.profile.itemsTagsLanguage') }}</label>
      <select
        id="tags-locale"
        :value="userStore.settings.standardTagsLocale"
        name="tags-locale"
        @change="changeTagsLocale"
      >
        <option v-for="{ title, value } in locales" :key="value" :value>
          {{ title }}
        </option>
      </select>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import type { Locale } from 'vue-i18n'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseDialog from '@/components/base/BaseDialog.vue'
import { useUserStore } from '@/stores/user'

definePage({
  meta: {
    title: 'pages.profile.languageSettings',
  },
})

const locales: ReadonlyArray<{ title: string, value: Locale }> = [
  { title: 'English', value: 'en' },
  { title: 'Русский', value: 'ru' },
]
const router = useRouter()
const userStore = useUserStore()
const isActive = ref(true)
function changeLocale(event: Event) {
  const select = event.target as HTMLSelectElement
  userStore.changeLocale(select.value)
}
function changeTagsLocale(event: Event) {
  const select = event.target as HTMLSelectElement
  userStore.changeTagsLocale(select.value)
}
</script>

<style>
.profile-options-locale-page {
  .base-dialog__content {
    display: grid;
    gap: 1rem;
    .locale-settings-item {
      display: grid;
      gap: 0.25rem;
    }
  }
}
</style>
