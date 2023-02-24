<template>
  <q-layout container>
    <q-header>
      <q-toolbar>
        <q-btn
          :class="{ invisible: route.name === 'Items' }"
          icon="arrow_back"
          flat
          no-wrap
          padding="0"
          :to="previousPageLink"
          replace
        />
        <q-toolbar-title class="flex items-center justify-between">
          <q-btn flat :to="{ name: 'Items' }" :ripple="false" padding="0">
            <l-icon icon="logo" width="32px" height="32px" />
            <span class="q-mt-sm">aundry Labels</span>
          </q-btn>
          <q-btn flat icon="person" padding="0" :to="{ name: 'Profile' }" :ripple="false">
            <q-badge v-if="userStore.settings.appHasUpdate" floating rounded color="red" />
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <KeepAlive :include="keepAliveComponents">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import LIcon from '@/components/LIcon.vue'
import { useUserStore } from '@/store/user'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const keepAliveComponents = ['ItemsPage']

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const previousPageLink = computed(() => {
  if (window.history.state.back === router.currentRoute.value.path) {
    return '/items'
  } else {
    return window.history.state.back || '/items'
  }
})
</script>

<style lang="scss" scoped>
header {
  color: black;
  background-color: $brand;

  .q-toolbar__title:last-child {
    padding-right: 4px;
  }
}
</style>
