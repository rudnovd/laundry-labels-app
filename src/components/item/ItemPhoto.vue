<template>
  <q-circular-progress v-if="isLoading" indeterminate size="50px" color="brand" />
  <img v-else :src="photoUrl ?? 'favicon-512.png'" />
</template>

<script setup lang="ts">
import useItems from '@/composables/useItems'
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{ path: string }>()

const { isOfflineItem, getPhoto } = useItems()
const photoUrl = ref<string | null>(null)
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    photoUrl.value = await getPhoto(props.path)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (photoUrl.value && isOfflineItem(photoUrl.value)) URL.revokeObjectURL(photoUrl.value)
})
</script>
