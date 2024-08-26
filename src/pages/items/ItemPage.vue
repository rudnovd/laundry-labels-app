<template>
  <q-page :class="['item-page', { 'centered-container': isLoading || !currentItem }]">
    <q-circular-progress v-if="isLoading" indeterminate size="50px" color="brand" />
    <template v-else-if="!isLoading && currentItem">
      <div v-if="currentItem.photos.length" class="item-photo-container">
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
            :disable="!allowModifyItem"
            @click="showDeleteDialog(currentItem)"
          >
            <q-tooltip v-if="!allowModifyItem">
              {{ t('pages.item.cannotDeleteTooltipText') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            color="primary"
            outline
            :label="t('common.edit')"
            icon="edit"
            :disable="!allowModifyItem"
            @click="router.push(`/items/edit/${currentItem?.id}`)"
          >
            <q-tooltip v-if="!allowModifyItem">
              {{ t('pages.item.cannotEditTooltipText') }}
            </q-tooltip>
          </q-btn>
        </div>

        <q-btn
          v-if="userStore.isAuthenticated && isCurrentItemOfflineItem"
          class="full-width"
          color="primary"
          outline
          :label="t('pages.item.saveInCloud')"
          :disabled="!userStore.isOnline"
          icon="sync"
          @click="showSaveInCloudDialog(currentItem)"
        >
          <q-tooltip v-if="!userStore.isOnline">
            {{ t('pages.item.cannotSaveInCloudTooltipText') }}
          </q-tooltip>
        </q-btn>
      </section>
    </template>
    <div v-else class="item-not-found-container">
      <div>{{ t('pages.item.itemNotFound') }}</div>
      <q-btn :to="{ name: 'Items' }" color="primary" outline>{{ t('pages.item.backToItems') }}</q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import useItems from '@/composables/useItems'
import { db } from '@/db'
import { useUserStore } from '@/store/user'
import type { Item, ItemBlank } from '@/types/item'
import { userSettingsStorage } from '@/utils/localStorage'
import LaundrySymbolButton from '@/components/item/symbols/LaundrySymbolButton.vue'
const ItemPhoto = defineAsyncComponent(() => import('@/components/item/ItemPhoto.vue'))
const ItemTag = defineAsyncComponent(() => import('@/components/item/tags/ItemTag.vue'))
const ItemMaterial = defineAsyncComponent(() => import('@/components/item/materials/ItemMaterial.vue'))

const { loading, dialog, notify } = useQuasar()
const router = useRouter()
const { t } = useI18n()
const route = useRoute()
const { items, deleteItem, getItemById, createItem, uploadPhoto, deletePhoto, symbols, isOfflineItem } = useItems()
const userStore = useUserStore()
const isLoading = ref(false)

const currentItem = ref<Item | null>(null)
const isCurrentItemOfflineItem = computed(() => (currentItem.value ? isOfflineItem(currentItem.value.id) : false))
const allowModifyItem = computed(() => isCurrentItemOfflineItem.value || userStore.isOnline)

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
    message: item.name ?? undefined,
    cancel: t('common.cancel'),
    ok: t('common.delete'),
    focus: 'none',
  }).onOk(async () => {
    loading.show({ message: t('loading.deletingItem') })
    try {
      await deleteItem(route.params.id.toString())
      item.photos.forEach(deletePhoto)
      notify({ type: 'positive', message: t('notifications.itemDeleted') })
      router.replace({ name: 'Items' })
    } catch {
      notify({ type: 'negative', message: t('notifications.itemDeleteFailed') })
    } finally {
      loading.hide()
    }
  })
}

function showSaveInCloudDialog(item: Item) {
  dialog({
    title: t('pages.item.saveInCloud'),
    message: item.name ?? undefined,
    cancel: t('common.cancel'),
    ok: t('common.save'),
    focus: 'none',
  }).onOk(async () => {
    loading.show({ message: t('loading.creatingItem') })

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
    const itemBlank: ItemBlank = {
      name: item.name,
      photos: uploadedPhotos,
      symbols: item.symbols,
      materials: item.materials,
      tags: item.tags,
    }
    try {
      await createItem(itemBlank)
      deleteItem(item.id).catch(() => notify({ color: 'negative', message: t('notifications.itemDeleteFailed') }))
      userSettingsStorage.value.offlineMode = isOfflineModeEnabled
      notify({ type: 'positive', message: t('notifications.itemSaved') })
      router.replace({ name: 'Items' })
    } catch {
      notify({ color: 'negative', message: t('notifications.itemCreateFailed') })
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

  .item-not-found-container {
    display: grid;
    gap: 8px;
    justify-items: center;
    font-size: 2rem;
    font-weight: bold;
  }
}
</style>
