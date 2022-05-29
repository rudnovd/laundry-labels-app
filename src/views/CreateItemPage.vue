<template>
  <section class="create-item-page" :class="{ 'q-pb-md': route.params.id, 'q-py-md': !route.params.id }">
    <section class="info-container">
      <!-- Uploaded image displays in edit route -->
      <q-img
        v-if="route.params.id"
        class="item-image"
        :height="isDesktop ? '300px' : 'auto'"
        :src="newItem.images[0] || ''"
        :class="{ 'no-image': !newItem.images.length }"
      />

      <q-uploader
        v-if="!route.params.id"
        ref="uploadImageForm"
        class="upload-image"
        :max-total-size="10485760"
        accept="image/jpg, image/jpeg, image/png"
        :max-files="1"
        @added="onAddImage"
        @rejected="onAddFileReject"
      >
        <template #header>
          <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
            <div class="col">
              <div class="q-uploader__title">Upload image</div>
            </div>
            <q-btn v-if="!newItem.images.length" type="a" icon="add_box" round dense flat>
              <q-uploader-add-trigger />
            </q-btn>
            <q-btn v-if="newItem.images.length" icon="delete" round dense flat @click="onRemoveFile" />
          </div>
        </template>

        <template #list="scope: any">
          <q-list separator>
            <q-item v-for="file in scope.files" :key="file.name">
              <q-item-section>
                <q-item-label v-if="uploadImageIsLoading" caption>
                  <q-spinner color="primary" size="3em" />
                </q-item-label>
                <q-item-label v-if="!uploadImageIsLoading && newItem.images.length" caption>
                  <q-img :src="newItem.images[0]" height="200px" alt="Uploaded image" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </template>
      </q-uploader>

      <q-select
        v-model="newItem.tags"
        class="select-tags"
        outlined
        clearable
        label="tags"
        use-input
        multiple
        hide-dropdown-icon
        new-value-mode="add-unique"
        :placeholder="!newItem.tags.length ? 'Input or select tags from list' : ''"
        :max-values="10"
        :options="standardTags"
        use-chips
        autocomplete="off"
      />
    </section>

    <section class="washing-icons-container">
      <div v-for="(icons, group) in iconsByGroups" :key="group" class="icons-group">
        <span>{{ group }}</span>

        <div class="icons-chips">
          <!-- TODO: v-ripple error (https://github.com/quasarframework/quasar/issues/13154)  -->
          <button
            v-for="icon in icons"
            :key="icon._id"
            type="button"
            :class="{ selected: isIconSelected(icon) }"
            @click="selectIcon(icon)"
          >
            <q-icon class="icon-chip-icon" :name="`${icon.icon}`" size="5em" />
            <span>{{ icon.description }}</span>
          </button>
        </div>
      </div>
    </section>

    <q-btn color="positive" class="submit-button" :label="route.params.id ? 'Save' : 'Create'" @click="onSubmit" />
  </section>
</template>

<script setup lang="ts">
import { laundryIcons } from '@/assets/laundryIcons'
import { db } from '@/db'
import type { Item, ItemBlank } from '@/interfaces/item'
import type { laundryIcon } from '@/interfaces/laundryIcon'
import request from '@/services/request'
import { useItemsStore } from '@/store/items'
import { useUserStore } from '@/store/user'
import Compressor from 'compressorjs'
import { QUploader, uid, useQuasar } from 'quasar'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const items = useItemsStore()

const offlineMode = computed(() => user.offlineMode)
const userItems = computed(() => items.items)
const standardTags = [
  'black',
  'white',
  'red',
  'yellow',
  'green',
  'jeans',
  't-shirt',
  'dress',
  'sweater',
  'shorts',
  'skirts',
]

const iconsByGroups = computed(() => {
  const map: {
    [key: string]: Array<laundryIcon>
  } = {}

  laundryIcons.forEach((icon) => {
    if (map[icon.group]) map[icon.group].push(icon)
    else map[icon.group] = [icon]
  })

  return map
})

const newItem = reactive({
  icons: [],
  images: [],
  tags: [],
} as ItemBlank)
const uploadImageForm = ref(QUploader)
const uploadImageIsLoading = ref(false)

if (route.params.id) {
  // Get item data if this doesn't exist in store
  if (!userItems.value.find((userItem: Item) => userItem._id === route.params.id)) {
    $q.loading.show()
    items
      .getItem({ _id: route.params.id as string })
      .then((response) => {
        if (!response.item) return
        newItem.icons = response.item.icons
        newItem.images = response.item.images
        newItem.tags = response.item.tags
      })
      .finally(() => $q.loading.hide())
  } else {
    const currentUserItem = userItems.value.find((userItem: Item) => userItem._id === route.params.id)
    if (currentUserItem) {
      newItem.icons = currentUserItem.icons
      newItem.images = currentUserItem.images
      newItem.tags = currentUserItem.tags
    }
  }
}

const selectIcon = (selectedIcon: laundryIcon) => {
  const iconIndex = newItem.icons.findIndex((icon) => icon === selectedIcon._id)
  iconIndex !== -1 ? newItem.icons.splice(iconIndex, 1) : newItem.icons.push(selectedIcon._id)
}

const isIconSelected = (selectedIcon: laundryIcon) => {
  return newItem.icons.find((icon) => icon === selectedIcon._id)
}

const onAddImage = (files: readonly any[]) => {
  uploadImageIsLoading.value = true
  const compressorResult = new Promise((resolve: (value: Blob) => void, reject) => {
    new Compressor(files[0], {
      quality: 0.4,
      success: resolve,
      error: reject,
    })
  })

  compressorResult
    .then((image) => {
      if (!offlineMode.value) {
        let formData = new FormData()
        formData.append('images', image)

        request
          .post('/api/upload/items', {
            body: formData,
          })
          .json<{ images: Array<string> }>()
          .then((imagesUrls) => {
            newItem.images = imagesUrls.images
          })
      } else {
        const imageId = `offline-${uid()}`
        const imgURL = URL.createObjectURL(image)
        db.itemsImages.add({ _id: imageId, itemId: null, image, imageUrl: imgURL })
        newItem.images = [imgURL]
      }
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      uploadImageIsLoading.value = false
    })
}

const onRemoveFile = () => {
  newItem.images = []
  uploadImageForm.value.reset()
}

const onAddFileReject = (errors: Array<{ failedPropValidation: string; file: File }>) => {
  if (errors.find((error) => error.failedPropValidation === 'max-total-size')) {
    $q.notify({ type: 'negative', message: 'Max file size is 10 mb' })
  } else if (errors.find((error) => error.failedPropValidation === 'accept')) {
    $q.notify({ type: 'negative', message: 'Wrong file type' })
  }
}

const onSubmit = () => {
  $q.loading.show()

  if (route.params.id) {
    items
      .editItem({ item: { ...newItem, _id: route.params.id as string } })
      .then(() => router.push('/'))
      .finally(() => $q.loading.hide())
  } else {
    items
      .postItem({ item: newItem })
      .then(() => router.push('/'))
      .finally(() => $q.loading.hide())
  }
}

const isDesktop = $q.platform.is.desktop
</script>

<style lang="scss" scoped>
.create-item-page {
  max-width: 1920px;
  margin: auto;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto;
  grid-template-areas:
    'info'
    'icons'
    'submit';

  gap: 1.5rem;
  padding: 16px;

  @include media-medium {
    grid-template-columns: 2fr 5fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      'info icons'
      '. submit';
  }
}

.info-container {
  grid-area: info;
}

.item-image {
  margin-bottom: 16px;
}

.no-image {
  background: $grey-4;
}

.upload-image {
  margin-bottom: 16px;
  width: 100%;
}

.select-tags {
  margin-bottom: 16px;
}

.washing-icons-container {
  display: grid;
  gap: 1rem;
  grid-area: icons;
  margin-bottom: 16px;
}

.icons-group {
  display: grid;
  gap: 0.25rem;

  span:first-child {
    text-transform: capitalize;
    font-size: 1.125rem;
    font-weight: 500;
    text-align: center;
  }
}

.icons-chips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 5.625rem;
  gap: 0.5rem;

  @include media-small {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  & > button {
    display: grid;
    position: relative;
    padding: 0.25rem;
    grid-template-columns: 64px auto;
    gap: 0.5rem;
    align-items: center;
    border: 1px solid $grey-4;
    border-radius: 8px;
    background: white;
    cursor: pointer;

    & img {
      font-size: 4rem;
      width: 100%;
    }

    & span:nth-child(2) {
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow-wrap: break-word;
      overflow: hidden;
    }

    &.selected {
      background-color: rgba($grey-6, 0.3);
    }
  }
}

.icon-chip-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button {
  width: 100%;
  grid-area: submit;
}
</style>
