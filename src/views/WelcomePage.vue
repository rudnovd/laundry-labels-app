<template>
  <section class="welcome-page q-pa-sm">
    <section class="buttons-section">
      <q-btn color="primary" label="Login" icon="login" to="/login" />
      <q-btn color="primary" label="Registration" icon="person" to="/registration" />
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'WelcomePage',
  setup() {
    const router = useRouter()
    const store = useStore()

    if (store.state.user._id) router.push('/')
  },
})
</script>

<style lang="scss" scoped>
.welcome-page {
  display: grid;
}

.buttons-section {
  display: grid;
  justify-content: center;
  gap: 2rem;

  button,
  a {
    max-width: 300px;
  }
}
</style>
