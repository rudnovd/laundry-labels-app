<template>
  <section class="welcome-page q-pa-sm"></section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WelcomePage',
})
</script>

<style lang="scss" scoped>
.buttons-section {
  display: grid;
  justify-content: center;
  gap: 1rem;

  button,
  a {
    max-width: 300px;
  }
}
</style>
