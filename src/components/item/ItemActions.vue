<template>
  <div class="item-actions">
    <BaseTooltip :disabled="isDeletionAllowed">
      <template #activator>
        <button
          class="button-error"
          :disabled="!isDeletionAllowed"
          @click="isDeleteDialogActive = true"
        >
          <IconTrash />
          {{ $t('common.delete') }}
        </button>
      </template>
      {{ $t('pages.item.cannotDeleteTooltipText') }}
    </BaseTooltip>
    <BaseTooltip :disabled="isModifyingAllowed">
      <template #activator>
        <button
          class="button-primary"
          :disabled="!isModifyingAllowed"
          @click="router.push(`/items/modify/${item?.id}`)"
        >
          <IconPencil />
          {{ $t('common.edit') }}
        </button>
      </template>
      {{ $t('pages.item.cannotEditTooltipText') }}
    </BaseTooltip>
    <BaseTooltip v-if="isSavingInCloudAllowed" class="save-offline-item-tooltip" :disabled="userStore.isOnline">
      <template #activator>
        <button class="button-success save-offline-item-button" :disabled="!userStore.isOnline" @click="isSaveDialogActive = true">
          <IconSync />
          {{ $t('pages.item.saveInCloud') }}
        </button>
      </template>
      {{ $t('pages.item.cannotSaveInCloudTooltipText') }}
    </BaseTooltip>
  </div>
  <BaseDialog v-if="isDeleteDialogActive" v-model="isDeleteDialogActive" :title="$t('pages.item.deleteItem')" :loading="isDeleting">
    <div>{{ item?.name }}</div>
    <template #footer>
      <button :disabled="isDeleting" @click="isDeleteDialogActive = false">
        {{ $t('common.cancel') }}
      </button>
      <button class="color-error" :disabled="isDeleting" @click="confirmItemDeletion">
        {{ $t('common.delete') }}
      </button>
    </template>
  </BaseDialog>
  <BaseDialog v-if="isSaveDialogActive" v-model="isSaveDialogActive" :title="$t('pages.item.saveInCloud')" :loading="isSaving">
    <div>{{ item?.name }}</div>
    <template #footer>
      <button :disabled="isSaving" @click="isSaveDialogActive = false">
        {{ $t('common.cancel') }}
      </button>
      <button v-if="item" :disabled="isSaving" class="color-success" @click="confirmItemSaving(item)">
        {{ $t('common.save') }}
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import type { Item, ItemBlank } from '@/types/item'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import IconPencil from '~icons/mdi/pencil'
import IconTrash from '~icons/mdi/trash'
import BaseTooltip from '@/components/base/BaseTooltip.vue'
import useItems from '@/composables/useItems'
import { OFFLINE_ITEM_ID_KEY } from '@/constants'
import { db } from '@/db'
import { useUserStore } from '@/stores/user'

const props = defineProps<{ item: Item }>()

const BaseDialog = defineAsyncComponent(() => import('@/components/base/BaseDialog.vue'))
const IconSync = defineAsyncComponent(() => import('~icons/mdi/sync'))

const userStore = useUserStore()
const isModifyingAllowed = computed<boolean>(() => {
  if (props.item.id.startsWith(OFFLINE_ITEM_ID_KEY)) {
    return true
  }
  return userStore.isAuthenticated && userStore.isOnline
})
const isDeletionAllowed = computed<boolean>(() => {
  if (props.item.id.startsWith(OFFLINE_ITEM_ID_KEY)) {
    return true
  }
  return userStore.isAuthenticated && userStore.isOnline
})
const isSavingInCloudAllowed = computed<boolean>(() => {
  return props.item.id.startsWith(OFFLINE_ITEM_ID_KEY) && userStore.isAuthenticated && userStore.isOnline
})

const router = useRouter()
const isDeleteDialogActive = ref<boolean>(false)
const isDeleting = ref<boolean>(false)
const { deleteItem, createItem, uploadPhoto, deletePhoto } = useItems()
const { t } = useI18n()
async function confirmItemDeletion() {
  if (!props.item) {
    return
  }
  isDeleting.value = true
  try {
    await deleteItem(props.item.id)
    props.item.photos.forEach(deletePhoto)
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
.item-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: space-between;
  .save-offline-item-tooltip {
    width: 100%;
  }
}
</style>
