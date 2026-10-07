<template>
  <section class="profile-actions">
    <router-link
      v-if="!userStore.isAuthenticated"
      class="button-link button-primary"
      :disabled="!userStore.isOnline"
      to="/signin"
    >
      <IconLogin />
      {{ $t('common.signIn') }}
    </router-link>
    <router-link
      v-if="!IS_OFFLINE_APP"
      class="button-link button-primary"
      :to="{ path: '/profile/options/core', replace: true }"
    >
      <IconCog />
      {{ $t('pages.profile.coreSettings') }}
    </router-link>
    <router-link
      class="button-link button-primary"
      :disabled="!userStore.isOnline && !IS_TAURI"
      :to="{ path: '/profile/options/locale', replace: true }"
    >
      <IconTranslate />
      {{ $t('pages.profile.languageSettings') }}
    </router-link>
    <router-link
      v-if="userStore.isAuthenticated && !isGoogleProvider"
      class="button-link button-primary"
      :disabled="!userStore.isOnline && !IS_TAURI"
      :to="{ path: '/profile/update-password', replace: true }"
    >
      <IconPassword />
      {{ $t('pages.profile.updatePassword') }}
    </router-link>
    <button
      v-if="isSupported && !IS_TAURI"
      :disabled="!items.length"
      class="button-primary"
      @click="exportItems"
    >
      <IconUpload />
      {{ $t('pages.profile.exportItems') }}
    </button>
    <router-link
      v-if="isSupported && !IS_TAURI"
      to="/profile/import-items"
      class="button-link button-primary"
    >
      <IconDownload />
      {{ $t('pages.profile.importItems') }}
    </router-link>
    <button class="button-primary" @click="startOnboarding">
      <IconAcademicCap />
      {{ $t('pages.profile.onboarding') }}
    </button>
    <button
      v-if="userStore.isAuthenticated"
      class="button-primary"
      :disabled="!userStore.isOnline"
      @click="isSignOutDialogActive = true"
    >
      <IconLogout />
      {{ $t('common.signOut') }}
    </button>
    <teleport to="body">
      <BaseDialog
        v-if="isSignOutDialogActive"
        v-model="isSignOutDialogActive"
        :title="$t('common.signOut')"
      >
        {{ $t('pages.profile.signOut') }}
        <template #footer>
          <button @click="isSignOutDialogActive = false">
            {{ $t('common.stay') }}
          </button>
          <button class="color-error" @click="confirmSignOut">
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
import { IS_OFFLINE_APP, IS_TAURI } from '@/constants'
import { IS_ONBOARDING_FINISHED_KEY } from '@/constants/onboarding'
import { useUserStore } from '@/stores/user'

const BaseDialog = defineAsyncComponent(() => import('../base/BaseDialog.vue'))
const IconCog = defineAsyncComponent(() => import('~icons/mdi/cog'))
const IconDownload = defineAsyncComponent(() => import('~icons/mdi/download'))
const IconLogout = defineAsyncComponent(() => import('~icons/mdi/logout'))
const IconLogin = defineAsyncComponent(() => import('~icons/mdi/login'))
const IconPassword = defineAsyncComponent(() => import('~icons/mdi/password'))
const IconTranslate = defineAsyncComponent(() => import('~icons/mdi/translate'))
const IconUpload = defineAsyncComponent(() => import('~icons/mdi/upload'))
const IconAcademicCap = defineAsyncComponent(() => import('~icons/mdi/academic-cap'))

const userStore = useUserStore()
const isGoogleProvider = computed<boolean>(() => {
  return userStore.user?.app_metadata?.providers?.includes('google') ?? false
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
function startOnboarding() {
  localStorage.setItem(IS_ONBOARDING_FINISHED_KEY, 'false')
  router.push({ path: '/items', query: { onboarding: 'true' } })
}
</script>
