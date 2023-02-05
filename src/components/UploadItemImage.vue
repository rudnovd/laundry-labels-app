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
    color="light-green-5"
    @uploaded="onUploaded"
    @failed="onFailed"
    @rejected="onRejected"
  >
    <template #header>
      <div class="row items-center justify-between q-pa-sm">
        Upload photo
        <q-btn type="a" icon="add_box" round dense flat>
          <q-uploader-add-trigger />
        </q-btn>
      </div>
    </template>

    <template #list="scope">
      <div class="row justify-lg-center">
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
              class="rounded-borders"
            />

            <q-spinner v-else-if="file.__status === 'uploading'" color="primary" size="3em" />
          </div>
        </q-item>
      </div>
    </template>
  </q-uploader>
</template>

<script setup lang="ts">
import { LocalStorage, QUploader, useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    images: Array<string>
  }>(),
  {
    images: () => [],
  }
)
const emit = defineEmits(['uploaded', 'remove'])

const { notify } = useQuasar()

const FIFTEEN_MEGABYTES = 15728640

const accessToken = LocalStorage.getItem('accessToken')?.toString()

const uploadImageRef = ref<QUploader>()

onMounted(() => {
  uploadImageRef.value?.addFiles(props.images)
})

const onUploaded = (info: { files: Readonly<Array<File>>; xhr: Record<string, string> }) => {
  const response: Record<string, string> = JSON.parse(info.xhr.response)
  emit('uploaded', response.url)
}

const onFailed = (info: { files: Readonly<Array<File>>; xhr: Record<string, string> }) => {
  const response: Record<string, { name: string; message: string }> = JSON.parse(info.xhr.response)
  notify({ type: 'negative', message: response.error.message })
}

const onRejected = (errors: Array<{ failedPropValidation: string; file: File }>) => {
  if (errors.find((error) => error.failedPropValidation === 'max-total-size')) {
    notify({ type: 'negative', message: 'Max file size is 10 mb' })
  } else if (errors.find((error) => error.failedPropValidation === 'accept')) {
    notify({ type: 'negative', message: 'Wrong file type' })
  }
}

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
