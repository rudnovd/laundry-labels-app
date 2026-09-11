<template>
  <BaseDialog v-model="isActive" class="profile-options-locale-page" :title="$t('pages.profile.languageSettings')" @close="router.replace('/profile')">
    <div class="locale-settings-item">
      <label for="locale">{{ $t('pages.profile.appLanguage') }}</label>
      <select
        id="locale"
        v-model="userStore.settings.locale"
        name="locale"
        @update:model-value="() => void 0"
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
        v-model="userStore.settings.standardTagsLocale"
        name="tags-locale"
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

const locales: ReadonlyArray<{ title: string, value: Locale }> = [
  { title: 'English', value: 'en' },
  { title: 'Русский', value: 'ru' },
]
const router = useRouter()
const userStore = useUserStore()

const isActive = ref(true)
</script>

<style>
.profile-options-locale-page {
  .base-dialog__content {
    display: grid;
    gap: 1rem;
    .locale-settings-item {
      flex-direction: column;
    }
  }
}
</style>
