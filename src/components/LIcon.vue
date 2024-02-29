<template>
  <component :is="iconComponent" width="16px" height="16px" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps<{ icon: string }>()
const iconComponent = computed(() => defineAsyncComponent(() => import(`@/assets/icons/${props.icon}.svg`)))
</script>
