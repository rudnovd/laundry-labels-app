<template>
  <q-btn v-if="!images.length" class="full-width q-mb-sm" color="brand" :disable="isLoading" @click="() => open()">
    {{ t('components.uploadItemImage.uploadPhoto') }}
  </q-btn>
  <q-btn v-else class="full-width q-mb-sm" color="negative" @click="onRemoveImage">
    {{ t('components.uploadItemImage.removePhoto') }}
  </q-btn>

  <div class="flex justify-center q-mb-md">
    <q-circular-progress v-if="isLoading" indeterminate size="50px" color="brand" />
    <q-img
      v-else-if="images?.length"
      :src="images[0]"
      height="200px"
      width="200px"
      fit="contain"
      class="rounded-borders"
    />
  </div>
</template>

<script setup lang="ts">
import { useItemsStore } from '@/store/items'
import { useFileDialog } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const FIFTEEN_MEGABYTES = 15728640

const props = withDefaults(
  defineProps<{
    images: Array<string>
  }>(),
  {
    images: () => [],
  }
)
const emit = defineEmits<{
  (e: 'uploaded', url: string): void
  (e: 'remove', url: string): void
}>()

const { t } = useI18n()
const { notify } = useQuasar()
const { open, reset, onChange } = useFileDialog({ accept: 'image/*', multiple: false })
const { uploadImage } = useItemsStore()

const isLoading = ref(false)

const onRemoveImage = () => {
  emit('remove', props.images[0])
  reset()
}

onChange((files) => {
  if (!files) return
  const uploadPromises: Array<Promise<{ url: string }>> = []
  isLoading.value = true

  for (const file of files) {
    if (file.type.split('/')[0] !== 'image') {
      return notify({ type: 'negative', message: t('notifications.typeError') })
    } else if (file.size > FIFTEEN_MEGABYTES) {
      return notify({ type: 'negative', message: t('notifications.sizeError') })
    }
    uploadPromises.push(uploadImage(file))
  }

  Promise.allSettled(uploadPromises)
    .then((result) => {
      result.map((promiseResult) => {
        if (promiseResult.status === 'fulfilled') {
          emit('uploaded', promiseResult.value.url)
        }
      })
    })
    .finally(() => (isLoading.value = false))
})
</script>
