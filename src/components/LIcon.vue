<template>
  <component :is="icon" height="16px" width="16px" v-bind="attrs" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    icon: string
  }>(),
  {},
)
const attrs = useAttrs()

const icon = computed(() => {
  return defineAsyncComponent(() => import(`@/assets/icons/${props.icon}.svg`))
})
</script>
