<template>
  <q-layout container>
    <q-header class="bg-light-green-5 text-white">
      <q-toolbar>
        <q-btn
          v-show="route.name !== 'Items'"
          icon="arrow_back"
          flat
          no-wrap
          padding="0"
          :to="previousPageLink"
          replace
        />
        <q-toolbar-title class="flex items-center justify-between">
          <q-btn flat icon="sell" label="Laundry Labels" :to="{ name: 'Items' }" :ripple="false" padding="0" />
          <q-btn flat icon="person" :to="{ name: 'Profile' }" :ripple="false" padding="0" />
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const keepAliveComponents = ['HomePage']

const router = useRouter()
const route = useRoute()

const previousPageLink = computed(() => {
  if (window.history.state.back === router.currentRoute.value.path) {
    return '/items'
  } else {
    return window.history.state.back || '/items'
  }
})
</script>
