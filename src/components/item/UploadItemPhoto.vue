<template>
  <q-btn v-if="!modelValue.size" class="full-width" color="brand" :disable="isLoading" @click="() => open()">
    {{ t('components.uploadItemPhoto.uploadPhoto') }}
  </q-btn>
  <q-btn v-else class="full-width q-mb-sm" color="negative" @click="onRemovePhoto">
    {{ t('components.uploadItemPhoto.removePhoto') }}
  </q-btn>

  <div v-if="isLoading || modelValue.size" class="flex justify-center q-mb-md">
    <q-circular-progress v-if="isLoading" indeterminate size="50px" color="brand" />
    <item-photo v-for="photo in modelValue" :key="photo" class="uploaded-photo" :path="photo" height="300px" />
  </div>
</template>

<script setup lang="ts">
import useItems from '@/composables/useItems'
import { MAX_ITEM_PHOTO_UNCOMPRESSED_SIZE } from '@/constants'
import { useFileDialog } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ItemPhoto from './ItemPhoto.vue'

const modelValue = defineModel<Set<string>>({ default: new Set() })

const { t } = useI18n()
const { notify } = useQuasar()
const { open, reset, onChange } = useFileDialog({ accept: 'image/*', multiple: false })
const { uploadPhoto } = useItems()

const isLoading = ref(false)

onChange(async (files) => {
  if (!files) return
  const uploadPromises: Array<Promise<string>> = []
  isLoading.value = true

  for (const file of files) {
    if (file.type.split('/')[0] !== 'image') {
      return notify({ type: 'negative', message: t('notifications.typeError') })
    } else if (file.size > MAX_ITEM_PHOTO_UNCOMPRESSED_SIZE) {
      return notify({ type: 'negative', message: t('notifications.sizeError') })
    }
    uploadPromises.push(uploadPhoto(file))
  }

  try {
    const result = await Promise.allSettled(uploadPromises)
    for (const promise of result) {
      if (promise.status === 'rejected') {
        notify({ type: 'negative', message: t('notifications.uploadError') })
        continue
      }
      modelValue.value.add(promise.value)
    }
  } finally {
    isLoading.value = false
  }
})

const onRemovePhoto = () => {
  reset()
  modelValue.value.delete(modelValue.value.values().next().value)
}
</script>

<style>
.uploaded-photo {
  max-width: 600px;
}
</style>
