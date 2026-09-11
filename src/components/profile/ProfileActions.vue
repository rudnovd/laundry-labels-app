<template>
  <section class="profile-actions">
    <router-link
      v-if="!isAuthenticated"
      class="button-link button-primary"
      :disabled="!isOnline"
      to="/signin"
    >
      <IconLogin />
      {{ $t('common.signIn') }}
    </router-link>
    <router-link class="button-link button-primary" :to="{ path: '/profile/options/core', replace: true }">
      <IconCog />
      {{ $t('pages.profile.coreSettings') }}
    </router-link>
    <router-link class="button-link button-primary" :to="{ path: '/profile/options/locale', replace: true }">
      <IconTranslate />
      {{ $t('pages.profile.languageSettings') }}
    </router-link>
    <router-link
      v-if="isAuthenticated && !isGoogleProvider"
      class="button-link button-primary"
      :disabled="!isOnline"
      :to="{ path: '/profile/options/locale', replace: true }"
    >
      <IconPassword />
      {{ $t('pages.profile.updatePassword') }}
    </router-link>
    <button v-if="isSupported" :disabled="!items.length" class="button-primary" @click="exportItems">
      <IconUpload />
      {{ $t('pages.profile.exportItems') }}
    </button>
    <router-link
      v-if="isSupported"
      to="/profile/import-items"
      class="button-link button-primary"
    >
      <IconDownload />
      {{ $t('pages.profile.importItems') }}
    </router-link>
    <button v-if="isAuthenticated" class="button-primary" :disabled="!isOnline" @click="isSignOutDialogActive = true">
      <IconLogout />
      {{ $t('common.signOut') }}
    </button>
    <teleport to="body">
      <BaseDialog v-if="isSignOutDialogActive" v-model="isSignOutDialogActive" :title="t('common.signOut')">
        {{ $t('pages.profile.signOut') }}
        <template #footer>
          <button @click="isSignOutDialogActive = false">
            {{ $t('common.stay') }}
          </button>
          <button @click="confirmSignOut">
            {{ $t('common.signOut') }}
          </button>
        </template>
      </BaseDialog>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { useFileSystemAccess } from '@vueuse/core'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import useItems from '@/composables/useItems'
import { useUserStore } from '@/stores/user'
import BaseDialog from '../base/BaseDialog.vue'

const IconCog = defineAsyncComponent(() => import('~icons/mdi/cog'))
const IconDownload = defineAsyncComponent(() => import('~icons/mdi/download'))
const IconLogout = defineAsyncComponent(() => import('~icons/mdi/logout'))
const IconLogin = defineAsyncComponent(() => import('~icons/mdi/login'))
const IconPassword = defineAsyncComponent(() => import('~icons/mdi/password'))
const IconTranslate = defineAsyncComponent(() => import('~icons/mdi/translate'))
const IconUpload = defineAsyncComponent(() => import('~icons/mdi/upload'))

const userStore = useUserStore()
const isAuthenticated = computed(() => userStore.isAuthenticated)
const isOnline = computed(() => userStore.isOnline)
const isGoogleProvider = computed<boolean>(() => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.app_metadata?.providers?.includes('google') ?? false
})

const { t } = useI18n()
const { isSupported, data, saveAs } = useFileSystemAccess()
const { items } = useItems()
async function exportItems() {
  data.value = JSON.stringify(items.value)
  try {
    await saveAs({ suggestedName: `laundry-labels-items-${Date.now()}.json` })
    toast.success(t('notifications.exportSuccess'))
  }
  finally {
    data.value = ''
  }
}

const isSignOutDialogActive = ref<boolean>(false)
const isSignOutDialogLoading = ref<boolean>(false)
const router = useRouter()
async function confirmSignOut() {
  isSignOutDialogLoading.value = true
  try {
    await userStore.signOut()
    isSignOutDialogActive.value = false
    toast.success(t('notifications.signOutSuccess'))
    router.push('/')
  }
  finally {
    isSignOutDialogLoading.value = false
  }
}
</script>
