<template>
  <section class="profile-page q-pa-sm flex justify-center">
    <q-btn v-if="auth.currentUser" to="/logout" color="primary" label="Logout" icon="logout" />
  </section>
</template>

<script lang="ts">
import { getAuth } from '@firebase/auth'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'Profile',
  setup() {
    const auth = getAuth()

    return {
      auth,
    }
  },
})
</script>
