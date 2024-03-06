<template>
  <q-dialog v-model="isActive" persistent>
    <q-card class="settings-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">New version announcement</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense @click="router.back" />
      </q-card-section>

      <q-card-section>
        <p>Starting from March 7th (version 0.0.0-beta.0), our application is transitioning to a new infrastructure!</p>
        <p>
          To continue using it, please re-register using your
          <span class="google-link" @click="userStore.signInWithOAuth({ provider: 'google' })">Google</span> account or
          through the <router-link :to="{ name: 'Sign in' }">registration page</router-link>.
        </p>
        <p>Once you're all set, if you had any items saved before, you'll be prompted to migrate your data.</p>
        <q-btn
          size="small"
          class="full-width q-mb-sm"
          color="white"
          text-color="black"
          @click="userStore.signInWithOAuth({ provider: 'google' })"
        >
          <l-icon class="q-mr-sm" icon="google-logo" />
          {{ t('pages.signIn.signInWithGoogle') }}
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LIcon from '@/components/LIcon.vue'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const isActive = ref(true)
</script>

<style>
.google-link {
  color: #4285f4;
  text-decoration: underline;
  cursor: pointer;
}
</style>
