<template>
  <router-view />
</template>

<script setup lang="ts">
import { laundryIcons } from '@/assets/laundryIcons'
import { useLocalStorage, watchOnce } from '@vueuse/core'
import { QSpinnerGears, useQuasar } from 'quasar'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import usePwa from '@/composables/usePwa'
const { t } = useI18n()
usePwa()
</script>
