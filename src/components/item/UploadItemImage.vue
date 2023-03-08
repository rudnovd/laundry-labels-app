<template>
  <q-uploader
    ref="uploadImageRef"
    class="full-width q-mb-sm"
    :max-file-size="FIFTEEN_MEGABYTES"
    :max-files="1"
    accept="image/jpg, image/jpeg, image/png, image/webp, image/avif"
    multiple
    auto-upload
    url="/api/upload/items"
    :headers="() => [{ name: 'Authorization', value: `bearer ${accessToken}` }]"
    color="brand"
    @uploaded="onUploaded"
    @failed="onFailed"
    @rejected="onRejected"
  >
    <template #header>
      <div class="row items-center justify-between q-pa-sm">
        {{ t('uploadPhoto') }}
        <q-btn v-if="!images.length" type="a" icon="add_box" round dense flat>
          <q-uploader-add-trigger />
        </q-btn>
      </div>
    </template>

    <template #list="scope">
      <div class="row justify-lg-center">
        <template v-if="scope.files.length">
          <q-item v-for="file in scope.files" :key="file">
            <div thumbnail class="col">
              <q-btn
                v-if="file.__status === 'uploaded'"
                icon="close"
                round
                color="black"
                size="xs"
                class="delete-icon"
                @click="onRemove(scope, file)"
              />

              <q-img
                v-if="file.__status === 'uploaded'"
                :src="file.__img.src"
                height="200px"
                width="200px"
                fit="contain"
                class="rounded-borders"
              />

              <q-spinner v-else-if="file.__status === 'uploading'" color="primary" size="3em" />
            </div>
          </q-item>
        </template>
        <template v-else>
          <q-item v-for="file in images" :key="file">
            <div thumbnail class="col">
              <q-btn icon="close" round color="black" size="xs" class="delete-icon" @click="emit('remove', file)" />
              <q-img :src="file" height="200px" width="200px" fit="contain" class="rounded-borders" />
            </div>
          </q-item>
        </template>
      </div>
    </template>
  </q-uploader>
</template>

<script setup lang="ts">
import { LocalStorage, QUploader, useQuasar, type QRejectedEntry } from 'quasar'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const FIFTEEN_MEGABYTES = 15728640
const accessToken = LocalStorage.getItem('accessToken')?.toString()

withDefaults(
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

const uploadImageRef = ref<QUploader>()

const onUploaded = (info: { files: Readonly<Array<File>>; xhr: Record<string, string> }) => {
  const response: Record<string, string> = JSON.parse(info.xhr.response)
  emit('uploaded', response.url)
}

const onFailed = (info: { files: Readonly<Array<File>>; xhr: Record<string, string> }) => {
  const response: Record<string, { name: string; message: string }> = JSON.parse(info.xhr.response)
  notify({ type: 'negative', message: response.error.message })
}

const onRejected = (rejectedEntries: Array<QRejectedEntry>) => {
  for (const error of rejectedEntries) {
    if (error.failedPropValidation === 'max-file-size') {
      notify({ type: 'negative', message: t('notification.sizeError') })
    } else if (error.failedPropValidation === 'accept') {
      notify({ type: 'negative', message: t('notification.typeError') })
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onRemove = (scope: QUploader, file: any) => {
  scope.removeFile(file)
  const response = JSON.parse(file.xhr.response)
  emit('remove', response.url)
}
</script>

<style lang="scss" scoped>
.delete-icon {
  position: absolute;
  right: 0;
  z-index: 1;
  transform: translate(-5px, -10px);
}
</style>
