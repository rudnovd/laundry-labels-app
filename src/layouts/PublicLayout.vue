<template>
  <q-layout container>
    <q-page-container>
      <router-link
        v-if="!userSettingsStorage.isMigrated"
        class="new-version-announcement"
        :to="{ name: 'New version announcement' }"
      >
        New version announcement
      </router-link>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
      <router-view v-if="!userSettingsStorage.isMigrated" v-slot="{ Component }" name="dialog">
        <component :is="Component" />
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { userSettingsStorage } from '@/utils/localStorage'
</script>

<style>
.new-version-announcement {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: rgb(0 0 0);
  background: rgb(76 175 80);
}
</style>
