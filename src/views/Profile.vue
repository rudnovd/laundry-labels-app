<template>
  <section class="profile-page q-pa-sm flex justify-center">
    <q-btn
      v-if="user.isAnonymous"
      color="primary"
      label="Register account with email"
      @click="router.push('/registration')"
    />

    <q-btn v-if="user" color="primary" label="Logout" icon="logout" @click="showLogoutDialog = true" />
  </section>

  <!-- <q-dialog v-if="user.isAnonymous" v-model="showCreateProfileDialog">
    <q-card>
      <q-card-section>
        <span>Create profile ?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Cancel" color="primary" />
        <q-btn v-close-popup flat label="Continue" color="positive" />
      </q-card-actions>
    </q-card>
  </q-dialog> -->

  <q-dialog v-model="showLogoutDialog">
    <q-card>
      <q-card-section>
        <span>Logout?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Cancel" color="primary" />
        <q-btn v-close-popup flat label="Confirm" color="negative" to="/logout" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { getAuth } from '@firebase/auth'
import { defineComponent, ref } from '@vue/runtime-core'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Profile',
  setup() {
    const router = useRouter()

    return {
      router,

      user: getAuth().currentUser,

      // showCreateProfileDialog: ref(false),
      showLogoutDialog: ref(false),
    }
  },
})
</script>

<style lang="scss" scoped>
.profile-page {
  display: grid;
  gap: 1rem;
}
</style>
