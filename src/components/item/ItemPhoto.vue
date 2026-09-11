<template>
  <div v-if="isLoading">
    {{ $t('common.loading') }}...
  </div>
  <img v-else :src="photoUrl ?? 'favicon-512.png'">
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import useItems from '@/composables/useItems'

const props = defineProps<{ path: string }>()

const { isOfflineItem, getPhoto } = useItems()
const photoUrl = ref<string | null>(null)
const isLoading = ref(false)
onMounted(async () => {
  isLoading.value = true
  try {
    photoUrl.value = await getPhoto(props.path)
  }
  finally {
    isLoading.value = false
  }
})
onUnmounted(() => {
  if (photoUrl.value && isOfflineItem(photoUrl.value)) {
    URL.revokeObjectURL(photoUrl.value)
  }
})
</script>
