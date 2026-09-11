<template>
  <section class="error-page">
    <span>{{ t('pages.error.pageNotFound') }}</span>
    <router-link class="color-primary" to="/">
      {{ t('pages.error.backToHomePage') }}
    </router-link>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style>
.error-page {
  display: grid;
  gap: 0.5rem;
  place-content: center;
  place-items: center;
}
</style>
