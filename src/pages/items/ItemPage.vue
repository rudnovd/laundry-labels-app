<template>
  <q-page :class="['item-page', { 'centered-container': loading.isActive || !currentItem }]">
    <q-circular-progress v-if="loading.isActive" indeterminate size="50px" color="brand" />
    <template v-else-if="!loading.isActive && currentItem">
      <div class="item-photo-container">
        <item-photo v-if="currentItem.photos.length" :path="currentItem.photos[0]" height="100%" />
      </div>

      <section :class="['item-data', 'q-px-sm', { 'q-pt-sm': !currentItem.photos.length }]">
        <h1 v-if="currentItem.name" class="text-h5 q-my-none">{{ currentItem.name }}</h1>
        <section class="item-symbols">
          <laundry-symbol-button
            v-for="symbol in currentItem.symbols"
            :key="symbol"
            :symbol="{ ...symbols[symbol], name: symbol }"
          />
        </section>

        <section v-if="currentItem.tags.length" class="item-tags">
          <item-tag v-for="tag in currentItem.tags" :key="tag">{{ tag }}</item-tag>
        </section>

        <section class="flex justify-between">
          <q-btn
            color="negative"
            outline
            :label="t('common.delete')"
            icon="delete"
            @click="showDeleteDialog(currentItem)"
          />
          <q-btn
            color="primary"
            outline
            :label="t('common.edit')"
            icon="edit"
            @click="router.push(`/items/edit/${currentItem?.id}`)"
          />
        </section>

        <q-btn
          v-if="userStore.isOnline && userStore.user && isOfflineItem(currentItem.id)"
          class="full-width"
          color="primary"
          outline
          :label="t('pages.item.saveOnServer')"
          icon="sync"
          @click="showSaveOnServerDialog(currentItem)"
        />
      </section>
    </template>
    <span v-else> Item not found </span>
  </q-page>
</template>

<script setup lang="ts">
import ItemPhoto from '@/components/item/ItemPhoto.vue'
import LaundrySymbolButton from '@/components/item/symbols/LaundrySymbolButton.vue'
import ItemTag from '@/components/item/tags/ItemTag.vue'
import useItems from '@/composables/useItems'
import { db } from '@/db'
import { useUserStore } from '@/store/user'
import type { Item } from '@/types/item'
import { userSettingsStorage } from '@/utils/localStorage'
import { useQuasar } from 'quasar'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { loading, dialog, notify } = useQuasar()
const router = useRouter()
const { t } = useI18n()
const route = useRoute()
const { items, deleteItem, getItemById, createItem, uploadPhoto, symbols, isOfflineItem } = useItems()
const userStore = useUserStore()

const currentItem = ref<Item | null>(null)

onBeforeMount(async () => {
  const item = items.value.find(({ id }) => id === route.params.id)
  if (item) {
    currentItem.value = item
    return
  }

  loading.isActive = true
  try {
    currentItem.value = await getItemById(route.params.id.toString())
  } finally {
    loading.isActive = false
  }
})

async function showDeleteDialog(item: Item) {
  dialog({
    title: t('pages.item.deleteItem'),
    message: item.name ?? 'item',
    cancel: t('common.cancel'),
  }).onOk(async () => {
    loading.show()
    try {
      await deleteItem(route.params.id.toString())
      notify({ color: 'positive', message: t('notifications.itemDeleted') })
      router.replace({ name: 'Items' })
    } finally {
      loading.hide()
    }
  })
}

function showSaveOnServerDialog(item: Item) {
  dialog({
    title: t('pages.item.saveOnServer'),
    message: item.name ?? 'item',
    cancel: t('common.cancel'),
    ok: t('common.save'),
  }).onOk(async () => {
    loading.show()

    const isOfflineModeEnabled = userSettingsStorage.value.offlineMode
    userSettingsStorage.value.offlineMode = false

    const uploadedPhotos = []
    if (item.photos.length) {
      const uploadItem = await db.upload.get({ id: item.photos[0] })
      if (uploadItem?.file) {
        const uploadedPhoto = await uploadPhoto(uploadItem.file)
        uploadedPhotos.push(uploadedPhoto)
      }
    }

    try {
      await createItem({ ...item, photos: uploadedPhotos })
      await deleteItem(item.id)
      userSettingsStorage.value.offlineMode = isOfflineModeEnabled
      notify({ color: 'positive', message: t('notifications.itemSaved') })
      router.replace({ name: 'Items' })
    } finally {
      loading.hide()
    }
  })
}
</script>

<style>
.item-page {
  max-width: 1280px;
  padding-bottom: 16px;
  margin: auto;

  .item-photo-container {
    display: flex;
    justify-content: center;

    img {
      max-width: 600px;
      max-height: 300px;
    }
  }

  .item-data {
    display: grid;
    gap: 16px;
  }

  .item-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .item-symbols {
    display: grid;
    gap: 1rem;

    @media (width >= 576px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
}
</style>
