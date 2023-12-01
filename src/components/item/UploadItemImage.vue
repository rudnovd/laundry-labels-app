<template>
  <q-btn v-if="!images.length" class="full-width q-mb-sm" color="brand" :disable="isLoading" @click="() => open()">
    {{ t('components.uploadItemImage.uploadPhoto') }}
  </q-btn>
  <q-btn v-else class="full-width q-mb-sm" color="negative" @click="onRemoveImage">
    {{ t('components.uploadItemImage.removePhoto') }}
  </q-btn>

  <div v-if="isLoading || images.length" class="flex justify-center q-mb-md">
    <q-circular-progress v-if="isLoading" indeterminate size="50px" color="brand" />
    <q-img
      v-else-if="images?.length"
      :src="tmpImageUrl ? tmpImageUrl : images[0]"
      height="200px"
      width="200px"
      fit="contain"
      class="rounded-borders"
    />
  </div>
</template>

<script setup lang="ts">
import useItems from '@/composables/useItems'
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
  },
)
const emit = defineEmits<{
  (e: 'uploaded', url: string): void
  (e: 'uploaded', id: string): void
  (e: 'remove', url: string): void
}>()

const { t } = useI18n()
const { notify } = useQuasar()
const { open, reset, onChange } = useFileDialog({ accept: 'image/*', multiple: false })
const { uploadImage } = useItems()

const isLoading = ref(false)
const tmpImageUrl = ref('')

const onRemoveImage = () => {
  emit('remove', props.images[0])
  if (props.images[0].includes('offline-')) {
    URL.revokeObjectURL(props.images[0])
  }
  if (tmpImageUrl.value) {
    URL.revokeObjectURL(tmpImageUrl.value)
  }
  reset()
}

onChange((files) => {
  if (!files) return
  const uploadPromises: Array<Promise<{ url: string } | { _id: string; file: File }>> = []
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
      for (const promiseResult of result) {
        if (promiseResult.status === 'rejected') {
          continue
        }

        if ('file' in promiseResult.value) {
          if (tmpImageUrl.value) {
            URL.revokeObjectURL(tmpImageUrl.value)
          }
          tmpImageUrl.value = URL.createObjectURL(promiseResult.value.file)
        }

        emit('uploaded', 'url' in promiseResult.value ? promiseResult.value.url : promiseResult.value._id)
      }
    })
    .finally(() => (isLoading.value = false))
})
</script>
