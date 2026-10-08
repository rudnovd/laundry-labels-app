<template>
  <BaseDialog v-model="isActive" class="import-items-dialog" :title="$t('pages.profile.importItems')" size="large" @close="router.replace('/profile')">
    <button v-if="!isUploaded" class="button-primary" @click="importItems">
      {{ $t('pages.profile.dialogues.importItems.uploadFile') }}
    </button>
    <form v-else class="import-items-dialog-form" @submit.prevent>
      <ul class="import-all-items-list">
        <li>
          <button
            class="button-primary"
            :disabled="isSavingAll"
            @click="saveAll({ saveLocal: false })"
          >
            <IconCloudDownload />
            {{ $t('pages.profile.dialogues.importItems.saveAllInCloud') }}
          </button>
        </li>
        <li>
          <button
            class="button-primary"
            :disabled="isSavingAll"
            @click="saveAll({ saveLocal: true })"
          >
            <IconCellphoneSystemUpdate />
            {{ $t('pages.profile.dialogues.importItems.saveAllLocal') }}
          </button>
        </li>
      </ul>
      <ul class="items-list">
        <li v-for="item in uploadedItems" :key="item.id" class="items-list__element" :class="{ disabled: savedItemsIds.includes(item.id) }">
          <ItemCard :item="item" @click.stop.capture />
          <ul class="items-list__element-actions">
            <li v-if="!isItemSaved(item.id) || isItemSaving(item.id)">
              <button
                class="button-primary"
                :disabled="isItemSaving(item.id)"
                @click="saveItem(item, { saveLocal: false })"
              >
                <IconCloudDownload />
                {{ $t('common.saveInCloud') }}
              </button>
            </li>
            <li v-if="!isItemSaved(item.id) || isItemSaving(item.id)">
              <button
                class="button-primary"
                :disabled="isItemSaving(item.id)"
                @click="saveItem(item, { saveLocal: true })"
              >
                <IconCellphoneSystemUpdate />
                {{ $t('common.saveLocal') }}
              </button>
            </li>
            <li v-if="isItemSaved(item.id)" class="saved-item">
              <IconCheckBold class="color-success" />
              {{ $t('pages.profile.dialogues.importItems.itemSaved') }}
            </li>
          </ul>
        </li>
      </ul>
    </form>
  </BaseDialog>
</template>

<script setup lang="ts">
import type { Item, ItemBlank } from '@/types/item'
import { useFileSystemAccess } from '@vueuse/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import IconCellphoneSystemUpdate from '~icons/mdi/cellphone-system-update'
import IconCheckBold from '~icons/mdi/check-bold'
import IconCloudDownload from '~icons/mdi/cloud-download'
import BaseDialog from '@/components/base/BaseDialog.vue'
import ItemCard from '@/components/item/ItemCard.vue'
import { useItemsStore } from '@/stores/items'
import { useOfflineItemsStore } from '@/stores/offlineItems'

definePage({
  meta: {
    title: 'pages.profile.importItems',
  },
})

const router = useRouter()
const { t } = useI18n()
const itemsStore = useItemsStore()
const offlineItemsStore = useOfflineItemsStore()
const isActive = ref(true)

const uploadedItems = ref<Array<Item>>([])
const { data, open } = useFileSystemAccess()
const isUploaded = ref<boolean>(false)
async function importItems() {
  try {
    await open()
    if (!data.value || typeof data.value !== 'string') {
      return toast.error(t('notifications.wrongFileType'))
    }
    for (const item of JSON.parse(data.value)) {
      uploadedItems.value.push(item)
    }
    isUploaded.value = true
  }
  catch (error) {
    console.error(error)
  }
}

const isSavingAll = ref<boolean>(false)
const savingIds = ref<Array<string>>([])
const savedItemsIds = ref<Array<string>>([])
async function saveAll({ saveLocal }: { saveLocal: boolean }) {
  isSavingAll.value = true
  for (const item of uploadedItems.value) {
    if (savedItemsIds.value.includes(item.id)) {
      continue
    }
    await saveItem(item, { saveLocal })
  }
  isSavingAll.value = false
}
async function saveItem(item: Item, { saveLocal }: { saveLocal: boolean }) {
  savingIds.value.push(item.id)
  try {
    const { id, name, photos, symbols, materials, tags } = item
    const itemBlank: ItemBlank = { name, photos, symbols, materials, tags }
    saveLocal ? await offlineItemsStore.createItem(itemBlank) : await itemsStore.createItem(itemBlank)
    savedItemsIds.value.push(id)
  }
  finally {
    savingIds.value.splice(savingIds.value.indexOf(item.id), 1)
  }
}
function isItemSaved(id: string) {
  return savedItemsIds.value.includes(id)
}
function isItemSaving(id: string) {
  return savingIds.value.includes(id)
}
</script>

<style>
.import-items-dialog {
  .import-items-dialog-form {
    display: grid;
    gap: 1rem;
    height: 80dvh;
    overflow-y: auto;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    .import-all-items-list {
      display: grid;
      gap: 0.25rem;
      justify-content: center;
      button {
        width: 100%;
      }
    }
    .items-list {
      display: grid;
      grid: max-content / 100%;
      gap: 2rem;
      .items-list__element {
        display: flex;
        flex-wrap: wrap;
        gap: 1vw;
        .item-card {
          flex: 1 0 300px;
        }
        &.disabled .item-card {
          opacity: 0.3;
        }
        .items-list__element-actions {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 0.25rem;
          justify-content: center;
          button {
            width: 100%;
          }
          .saved-item {
            display: flex;
            gap: 0.25rem;
            align-items: center;
            justify-content: center;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
