<template>
  <q-page :class="['item-page', { 'centered-container': isLoading || loading.isActive || !currentItem }]">
    <q-circular-progress v-if="isLoading" indeterminate size="50px" color="brand" />
    <template v-else-if="!isLoading && currentItem">
      <div class="item-photo-container">
        <item-photo v-for="photo of currentItem.photos" :key="photo" :path="photo" height="100%" />
      </div>

      <section :class="['item-data', 'q-px-sm', { 'q-pt-sm': !currentItem.photos.length }]">
        <h1 v-if="currentItem.name" class="text-h5 q-my-none">{{ currentItem.name }}</h1>
        <ul class="item-symbols">
          <li v-for="symbol in currentItem.symbols" :key="symbol">
            <laundry-symbol-button :symbol="{ ...symbols[symbol], name: symbol }" />
          </li>
        </ul>

        <ul class="item-materials">
          <li v-for="material of currentItem.materials" :key="material">
            <item-material :material />
          </li>
        </ul>

        <ul v-if="currentItem.tags.size" class="item-tags">
          <li v-for="tag in currentItem.tags" :key="tag">
            <item-tag>{{ tag }}</item-tag>
          </li>
        </ul>

        <div class="flex justify-between">
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
        </div>

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
import { useQuasar } from 'quasar'
import { defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import useItems from '@/composables/useItems'
import { db } from '@/db'
import { useUserStore } from '@/store/user'
import type { Item } from '@/types/item'
import { userSettingsStorage } from '@/utils/localStorage'
import LaundrySymbolButton from '@/components/item/symbols/LaundrySymbolButton.vue'
const ItemPhoto = defineAsyncComponent(() => import('@/components/item/ItemPhoto.vue'))
const ItemTag = defineAsyncComponent(() => import('@/components/item/tags/ItemTag.vue'))
const ItemMaterial = defineAsyncComponent(() => import('@/components/item/materials/ItemMaterial.vue'))

const { loading, dialog, notify } = useQuasar()
const router = useRouter()
const { t } = useI18n()
const route = useRoute()
const { items, deleteItem, getItemById, createItem, uploadPhoto, symbols, isOfflineItem } = useItems()
const userStore = useUserStore()
const isLoading = ref(false)

const currentItem = ref<Item | null>(null)

onBeforeMount(async () => {
  const item = items.value.find(({ id }) => id === route.params.id)
  if (item) {
    currentItem.value = item
    return
  }

  isLoading.value = true
  try {
    currentItem.value = await getItemById(route.params.id.toString())
  } finally {
    isLoading.value = false
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

    const uploadedPhotos: Array<string> = []
    for (const photo of item.photos) {
      const uploadItem = await db.upload.get({ id: photo })
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
    height: 400px;
    margin-bottom: 8px;

    img {
      width: 100%;
      max-width: 600px;
      max-height: 400px;
      object-fit: cover;
    }
  }

  .item-data {
    display: grid;
    gap: 16px;
  }

  .item-tags,
  .item-materials {
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
