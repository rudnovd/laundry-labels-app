<template>
  <button v-if="!model.length" class="button-primary" :disabled="disabled || isLoading" @click="() => open()">
    {{ t('components.uploadItemPhoto.uploadPhoto') }}
  </button>
  <button v-else class="button-error" :disabled @click="onRemovePhoto">
    {{ t('components.uploadItemPhoto.removePhoto') }}
  </button>
  <div v-if="isLoading || model.length" class="modify-item-photo">
    <div v-if="isLoading">
      {{ $t('common.loading') }}...
    </div>
    <ItemPhoto v-for="photo in model" :key="photo" class="uploaded-photo" :path="photo" height="300px" />
  </div>
</template>

<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import ItemPhoto from '@/components/item/ItemPhoto.vue'
import useItems from '@/composables/useItems'
import { MAX_ITEM_PHOTO_UNCOMPRESSED_SIZE } from '@/constants'

defineProps<{ disabled: boolean }>()
const model = defineModel<Array<string>>({ default: () => [] })

const { t } = useI18n()
const { open, reset, onChange } = useFileDialog({ accept: 'image/*', multiple: false })
const { uploadPhoto } = useItems()

const isLoading = ref(false)
onChange(async (files) => {
  if (!files) {
    return
  }
  const uploadPromises: Array<Promise<string>> = []
  isLoading.value = true
  for (const file of files) {
    if (file.type.split('/')[0] !== 'image') {
      toast.error(t('notifications.typeError'))
    }
    else if (file.size > MAX_ITEM_PHOTO_UNCOMPRESSED_SIZE) {
      toast.error(t('notifications.sizeError'))
    }
    uploadPromises.push(uploadPhoto(file))
  }
  try {
    const result = await Promise.allSettled(uploadPromises)
    for (const promise of result) {
      if (promise.status === 'rejected') {
        toast.error(t('notifications.uploadError'))
        continue
      }
      model.value.push(promise.value)
    }
  }
  finally {
    isLoading.value = false
  }
})

function onRemovePhoto() {
  reset()
  model.value = []
}
</script>

<style>
.modify-item-photo {
  display: flex;
  justify-content: center;
}
</style>
