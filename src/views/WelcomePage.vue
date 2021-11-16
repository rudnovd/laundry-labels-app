<template>
  <section class="welcome-page q-pa-sm">
    <section class="buttons-section">
      <q-btn color="primary" label="Login" icon="login" to="/login" />
      <q-btn color="primary" label="Registration" icon="person" to="/registration" />
    </section>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'WelcomePage',
  setup() {
    const router = useRouter()
    const store = useStore()

    const user = computed(() => store.state.user)
    watch(user, () => user.value._id && router.push('/'))
  },
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
