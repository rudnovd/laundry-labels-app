<template>
  <section class="error-page">
    <span>{{ $t('pages.error.pageNotFound') }}</span>
    <router-link to="/">
      {{ $t('pages.error.backToHomePage') }}
    </router-link>
  </section>
</template>

<script setup lang="ts">
definePage({
  meta: {
    title: 'pages.error.pageNotFound',
  },
})
</script>

<style>
.error-page {
  display: grid;
  gap: 0.5rem;
  place-content: center;
  place-items: center;
}
</style>
