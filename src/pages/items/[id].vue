<template>
  <section class="item-page">
    <div v-if="isLoading">
      {{ $t('common.loading') }}...
    </div>
    <div v-else-if="!isLoading && currentItem" class="item-data">
      <div v-if="currentItem.photos.length" class="item-data__photo">
        <ItemPhoto v-for="photo of currentItem.photos" :key="photo" :path="photo" />
      </div>
      <h2 v-if="currentItem.name" class="item-data__title">
        {{ currentItem.name }}
      </h2>
      <ul class="item-data__symbols-list">
        <li v-for="symbol in currentItem.symbols" :key="symbol">
          <ModifyItemSymbolsListItem :symbol="{ ...symbols[symbol], name: symbol }" />
        </li>
      </ul>
      <ul class="item-data__materials-list">
        <li v-for="material of currentItem.materials" :key="material">
          <ItemMaterial :material />
        </li>
      </ul>
      <ul v-if="currentItem.tags.length" class="item-data__tags-list">
        <li v-for="tag in currentItem.tags" :key="tag">
          <ItemTag>{{ tag }}</ItemTag>
        </li>
      </ul>
      <div class="item-data__footer">
        <BaseTooltip :disabled="allowModifyItem">
          <template #activator>
            <button
              class="button-error"
              :disabled="!allowModifyItem"
              @click="isDeleteDialogActive = true"
            >
              <IconTrash />
              {{ $t('common.delete') }}
            </button>
          </template>
          {{ t('pages.item.cannotDeleteTooltipText') }}
        </BaseTooltip>
        <BaseTooltip :disabled="allowModifyItem">
          <template #activator>
            <button
              class="button-primary"
              :disabled="!allowModifyItem"
              @click="router.push(`/items/modify/${currentItem?.id}`)"
            >
              <IconPencil />
              {{ $t('common.edit') }}
            </button>
          </template>
          {{ t('pages.item.cannotEditTooltipText') }}
        </BaseTooltip>
      </div>
      <BaseTooltip v-if="userStore.isAuthenticated && isCurrentItemOfflineItem" :disabled="userStore.isOnline">
        <template #activator>
          <button class="button-success save-offline-item-button" :disabled="!userStore.isOnline" @click="isSaveDialogActive = true">
            <IconSync />
            {{ $t('pages.item.saveInCloud') }}
          </button>
        </template>
        {{ $t('pages.item.cannotSaveInCloudTooltipText') }}
      </BaseTooltip>
    </div>
    <div v-else class="item-not-found-container">
      <div>{{ $t('pages.item.itemNotFound') }}</div>
      <router-link class="button-link button-primary" to="/items">
        {{ $t('pages.item.backToItems') }}
      </router-link>
    </div>
    <BaseDialog v-if="isDeleteDialogActive" v-model="isDeleteDialogActive" :title="$t('pages.item.deleteItem')" :loading="isDeleting">
      <div>{{ currentItem?.name }}</div>
      <template #footer>
        <button class="button-primary" :disabled="isDeleting" @click="isDeleteDialogActive = false">
          {{ $t('common.cancel') }}
        </button>
        <button class="button-error" :disabled="isDeleting" @click="confirmItemDeletion">
          {{ $t('common.delete') }}
        </button>
      </template>
    </BaseDialog>
    <BaseDialog v-if="isSaveDialogActive" v-model="isSaveDialogActive" :title="$t('pages.item.saveInCloud')" :loading="isSaving">
      <div>{{ currentItem?.name }}</div>
      <template #footer>
        <button class="button-primary" :disabled="isSaving" @click="isSaveDialogActive = false">
          {{ $t('common.cancel') }}
        </button>
        <button v-if="currentItem" :disabled="isSaving" class="button-success" @click="confirmItemSaving(currentItem)">
          {{ $t('common.save') }}
        </button>
      </template>
    </BaseDialog>
  </section>
</template>

<script setup lang="ts">
import type { Item, ItemBlank } from '@/types/item'
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import IconPencil from '~icons/mdi/pencil'
import IconSync from '~icons/mdi/sync'
import IconTrash from '~icons/mdi/trash'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseTooltip from '@/components/base/BaseTooltip.vue'
import ModifyItemSymbolsListItem from '@/components/item/modify/ModifyItemSymbolsListItem.vue'
import useItems from '@/composables/useItems'
import { db } from '@/db'
import { useUserStore } from '@/stores/user'

const ItemPhoto = defineAsyncComponent(() => import('@/components/item/ItemPhoto.vue'))
const ItemTag = defineAsyncComponent(() => import('@/components/item/ItemTag.vue'))
const ItemMaterial = defineAsyncComponent(() => import('@/components/item/ItemMaterial.vue'))

const router = useRouter()
const route = useRoute('/items/[id]')
const { t } = useI18n()
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
    currentItem.value = await getItemById(route.params.id)
  }
  finally {
    isLoading.value = false
  }
})

const isDeleteDialogActive = ref<boolean>(false)
const isDeleting = ref<boolean>(false)
async function confirmItemDeletion() {
  if (!currentItem.value) {
    return
  }
  isDeleting.value = true
  try {
    await deleteItem(route.params.id)
    currentItem.value.photos.forEach(deletePhoto)
    toast.success(t('notifications.itemDeleted'))
    router.replace('/items')
  }
  catch {
    toast.error(t('notifications.itemDeleteFailed'))
  }
  finally {
    isDeleting.value = false
  }
}

const isSaveDialogActive = ref<boolean>(false)
const isSaving = ref<boolean>(false)
async function confirmItemSaving(item: Item) {
  const isOfflineModeEnabled = userStore.settings.offlineMode
  userStore.settings.offlineMode = false

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
    isSaving.value = true
    await createItem(itemBlank)
    deleteItem(item.id).catch(() => toast.error(t('notifications.itemDeleteFailed')))
    userStore.settings.offlineMode = isOfflineModeEnabled
    toast.success(t('notifications.itemSaved'))
    router.replace('/items')
  }
  catch {
    toast.error(t('notifications.itemCreateFailed'))
  }
  finally {
    isSaving.value = false
  }
}
</script>

<style>
.item-page {
  width: 100%;
  max-width: 1280px;
  margin: auto;
  .item-data {
    display: grid;
    gap: 1rem;
    .item-data__photo {
      display: flex;
      justify-content: center;
      img {
        max-width: 100%;
      }
    }
    .item-data__title {
      display: -webkit-box;
      margin: 0;
      overflow: hidden;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      line-clamp: 5;
      font-size: 3rem;
      line-height: 3rem;
    }
    .item-data__tags-list,
    .item-data__materials-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .item-data__symbols-list {
      display: grid;
      gap: 1rem;
      @media (width >= 576px) {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }
    .item-data__footer {
      display: flex;
      justify-content: space-between;
    }
    .save-offline-item-button {
      width: 100%;
    }
  }
  .item-not-found-container {
    display: grid;
    gap: 0.5rem;
    justify-items: center;
    font-size: 2rem;
    font-weight: bold;
  }
}
</style>
