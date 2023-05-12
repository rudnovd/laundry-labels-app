<template>
  <q-page class="item-page q-pb-md">
    <template v-if="currentItem">
      <q-img
        v-if="currentItem.images.length"
        class="item-image q-mb-md"
        :src="currentItem.images[0]"
        loading="lazy"
        fit="contain"
        decoding="async"
        height="100%"
      />

      <section class="q-px-sm" :class="{ 'q-pt-sm': !currentItem.images.length }">
        <h1 v-if="currentItem.name" class="text-h5 ellipsis">{{ currentItem.name }}</h1>

        <section class="item-icons q-mb-md">
          <div v-for="icon in currentItem.icons" :key="icon" class="icon-chip">
            <q-icon :name="laundryIconsMap[icon]._id" size="5em" />
            <span>{{ t(laundryIconsMap[icon].description) }}</span>
          </div>
        </section>

        <section v-if="currentItem.tags.length" class="item-tags q-mb-md">
          <q-chip v-for="tag in currentItem.tags" :key="tag">{{ tag }}</q-chip>
        </section>

        <section class="flex justify-between">
          <q-btn color="negative" outline :label="t('common.delete')" icon="delete" @click="showDeleteDialog" />
          <q-btn
            color="primary"
            outline
            :label="t('common.edit')"
            icon="edit"
            @click="router.push(`/items/edit/${currentItem?._id}`)"
          />
        </section>

        <section v-if="currentItem._id.includes('offline-')" class="q-mt-sm flex">
          <q-btn
            class="full-width"
            color="primary"
            outline
            :label="t('pages.item.saveOnServer')"
            icon="sync"
            @click="showSaveOnServerDialog"
          />
        </section>
      </section>
    </template>
    <template v-else-if="!currentItem && !loading"> Item not found </template>
  </q-page>
</template>

<script setup lang="ts">
import { laundryIconsMap } from '@/assets/laundryIcons'
import useItems from '@/composables/useItems'
import { db } from '@/db'
import type { Item } from '@/interfaces/item'
import type { UserSettings } from '@/interfaces/types'
import { useItemsStore } from '@/store/items'
import { useUserStore } from '@/store/user'
import { useLocalStorage } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { loading, dialog, notify } = useQuasar()
const router = useRouter()
const { t } = useI18n()
const route = useRoute()
const itemsStore = useItemsStore()
const { isOnline } = useUserStore()
const { items, deleteItem, getItemById, createItem, uploadImage } = useItems()
const userSettings = useLocalStorage<Partial<UserSettings>>('user-settings', {
  offlineMode: false,
})

const currentItem = ref<Item>()

onBeforeMount(async () => {
  currentItem.value = items.value.find((item) => item._id === route.params.id)

  if (currentItem.value) {
    return
  }

  loading.show()
  try {
    if (isOnline) {
      currentItem.value = await getItemById({ _id: route.params.id as string })
    } else {
      const items = await itemsStore.getItems()
      const item = items.find((_item) => _item._id === route.params.id)
      if (item) {
        currentItem.value = item
      }
    }
  } finally {
    loading.hide()
  }
})

const showDeleteDialog = () => {
  dialog({
    title: t('pages.item.deleteItem'),
    message: currentItem.value?.name,
    cancel: t('common.cancel'),
  }).onOk(() => {
    loading.show()
    deleteItem({ _id: route.params.id as string })
      .then(() => router.push({ name: 'Items' }))
      .finally(() => loading.hide())
  })
}

const showSaveOnServerDialog = () => {
  dialog({
    title: t('pages.item.saveOnServer'),
    message: currentItem.value?.name,
    cancel: t('common.cancel'),
    ok: t('common.save'),
  }).onOk(async () => {
    if (!currentItem.value) {
      return
    }

    loading.show()

    const isOfflineModeEnabled = userSettings.value.offlineMode
    userSettings.value.offlineMode = false

    const uploadedImages = []

    if (currentItem.value.images.length) {
      const offlineItem = await db.offlineItems.get({ _id: currentItem.value._id })
      if (offlineItem?.images.length) {
        const uploadItem = await db.upload.get({ _id: offlineItem.images[0] })
        if (uploadItem?.file) {
          const uploadedImage = await uploadImage(uploadItem.file)
          if ('url' in uploadedImage) {
            uploadedImages.push(uploadedImage.url)
          }
        }
      }
    }

    createItem({ item: { ...currentItem.value, images: uploadedImages } })
      .then(() => {
        if (currentItem.value?._id) {
          deleteItem({ _id: currentItem.value._id })
        }
        userSettings.value.offlineMode = isOfflineModeEnabled
        notify({
          color: 'positive',
          message: t('notifications.itemSaved'),
        })
        router.push({ name: 'Items' })
      })
      .finally(() => loading.hide())
  })
}
</script>

<style lang="scss" scoped>
.item-page {
  max-width: 1280px;
  margin: auto;
}

.item-image {
  max-width: 600px;
  max-height: 300px;

  @include media-medium {
    max-width: 100%;
  }
}

.item-info {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;

  div:first-child {
    font-size: 1.25rem;
    font-weight: 500;
  }
}

.item-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.item-icons {
  display: grid;
  gap: 1rem;

  @include media-small {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

.icon-chip {
  position: relative;
  display: grid;
  grid-template-columns: 64px auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.25rem;
  border: 1px solid $grey-4;
  border-radius: 8px;

  & img {
    font-size: 4rem;
  }

  & span:nth-child(2) {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
}
</style>
