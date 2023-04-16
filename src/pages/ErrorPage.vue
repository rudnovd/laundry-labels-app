<template>
  <q-page class="error-page">
    <span>{{ t('pages.error.pageNotFound') }}</span>
    <router-link :to="{ name: 'Home' }">{{ t('pages.error.backToHomePage') }}</router-link>
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.error-page {
  display: grid;
  gap: 0.5rem;
  place-content: center;
  place-items: center;
  padding: 8px;
}
</style>
