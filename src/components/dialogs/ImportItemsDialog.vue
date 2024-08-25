<template>
  <q-dialog v-model="isActive" class="import-items-dialog" persistent>
    <q-card class="dialog-card">
      <q-card-section class="header">
        <div class="text-h6">{{ t('pages.profile.importItems') }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>

      <q-card-section class="content">
        <ul>
          <li v-for="item in items" :key="item.id" :class="{ disabled: savedItemsIds.includes(item.id) }">
            <laundry-card :item="item" @click.stop.capture />
            <div class="items-actions">
              <q-btn
                size="sm"
                color="primary"
                icon="cloud_download"
                :loading="isItemSaving(item.id)"
                :disable="isItemSaved(item.id)"
                :label="t('common.saveInCloud')"
                @click="saveItem(item, false)"
              />
              <q-btn
                size="sm"
                color="primary"
                icon="system_update"
                :label="t('common.saveLocal')"
                :loading="isItemSaving(item.id)"
                :disable="isItemSaved(item.id)"
                @click="saveItem(item, true)"
              />
            </div>
          </li>
        </ul>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { Item, ItemBlank } from '@/types/item'
import { useI18n } from 'vue-i18n'
import LaundryCard from '@/components/item/cards/LaundryCard.vue'
import { ref } from 'vue'
import { useItemsStore } from '@/store/items'
import { useOfflineItemsStore } from '@/store/offlineItems'
import { useQuasar } from 'quasar'

defineProps<{
  items: Array<Item>
}>()

const { notify } = useQuasar()
const { t } = useI18n()
const itemsStore = useItemsStore()
const offlineItemsStore = useOfflineItemsStore()
const isActive = ref(true)
const savingIds = ref<Array<string>>([])
const savedItemsIds = ref<Array<string>>([])

async function saveItem(item: Item, isOffline: boolean) {
  savingIds.value.push(item.id)
  try {
    const { id, name, photos, symbols, materials, tags } = item
    const itemBlank: Omit<ItemBlank, 'owner'> = { name, photos, symbols, materials, tags }
    isOffline ? await offlineItemsStore.createItem(itemBlank) : await itemsStore.createItem(itemBlank)
    savedItemsIds.value.push(id)
    notify({ type: 'positive', message: t('notifications.itemSaved') })
  } finally {
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
  .dialog-card {
    min-width: 80dvw;

    .header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: 16px 16px 0;
    }

    .content {
      height: 80dvh;
      overflow-y: auto;
      scrollbar-gutter: stable;
      scrollbar-width: thin;
    }

    ul {
      display: grid;
      grid: max-content / 100%;
      gap: 32px;

      li {
        display: flex;
        flex-wrap: wrap;
        gap: 1vw;

        .laundry-card {
          flex: 1 0 300px;
        }

        &.disabled .laundry-card {
          opacity: 0.3;
        }

        .items-actions {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 4px;
          justify-content: center;
        }
      }
    }
  }
}
</style>
