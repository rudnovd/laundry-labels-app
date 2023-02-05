<template>
  <q-page class="error-page">
    <span>Page not found</span>
    <router-link :to="{ name: 'Home' }"> Return to Home page </router-link>
  </q-page>
</template>

<style lang="scss" scoped>
.error-page {
  display: grid;
  gap: 0.5rem;
  place-content: center;
  place-items: center;
  padding: 8px;
}
</style>
