<template>
  <section class="error-page">
    <span>Page not found</span>
    <router-link to="/"> Return to Home page </router-link>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ErrorPage',
})
</script>

<style lang="scss" scoped>
.error-page {
  display: grid;
  place-content: center;
  place-items: center;
  gap: 0.5rem;
  padding: 8px;
}
</style>
