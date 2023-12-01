<template>
  <q-page> {{ text }} </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    text: string
    path: string
  }>(),
  {},
)

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.replace(props.path)
  }, 5000)
})
</script>
