<template>
  <section class="redirect-page">
    <div>{{ title }}</div>
    <div>{{ description }}</div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePage({
  meta: {
    title: 'common.redirect',
    isNavbarHidden: true,
  },
})

const router = useRouter()
const route = useRoute()
const title = route.query.title?.toString() ?? ''
const description = route.query.description?.toString() ?? ''
const redirectTo = route.query.redirectTo?.toString() ?? '/'
onMounted(() => {
  setTimeout(() => {
    router.replace(redirectTo)
  }, 5000)
})
</script>

<style>
.redirect-page {
  display: grid;
  place-content: center;
  place-items: center;
  font-size: 2rem;
  color: oklch(94% 0.01 245deg);
  background: linear-gradient(
    135deg,
    oklch(50.34% 0.1439 147.6deg) 0%,
    oklch(34.25% 0.1736 301.49deg) 50%,
    oklch(50.34% 0.1439 147.6deg) 100%
  );
}
</style>
