<template>
  <div class="items-page__placeholder">
    <template v-if="Object.keys(searchRecord).length">
      {{ $t('pages.items.noItemsWithSelectedTags') }}
    </template>
    <template v-else>
      <span>{{ $t('pages.items.noItemsAdded') }}</span>
      <router-link v-if="userStore.isAuthenticated" class="button-link button-primary" to="/items/modify">
        {{ $t('pages.items.addFirstItem') }}
      </router-link>
      <template v-else-if="!IS_OFFLINE_APP">
        <span>{{ $t('pages.items.signInToSaveItems') }}</span>
        <router-link to="/signin" class="button-link button-primary">
          <IconLogin />
          {{ $t('common.signIn') }}
        </router-link>
        <span>{{ $t('common.or') }}</span>
        <button class="button-primary" data-onboarding-element="add-item-button" @click="addFirstLocalItem">
          {{ $t('pages.items.addFirstLocalItem') }}
        </button>
      </template>
      <router-link v-else to="/items/modify" class="button-link button-primary" data-onboarding-element="add-item-button">
        {{ $t('pages.items.addFirstLocalItem') }}
      </router-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { IS_OFFLINE_APP } from '@/constants'
import { useUserStore } from '@/stores/user'

defineProps<{ searchRecord: Record<string, Array<string>> }>()

const IconLogin = defineAsyncComponent(() => import('~icons/mdi/login'))

const userStore = useUserStore()
const router = useRouter()
function addFirstLocalItem() {
  userStore.settings.offlineMode = true
  router.push('/items/modify')
}
</script>

<style>
.items-page__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
