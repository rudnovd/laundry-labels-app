<template>
  <q-page class="modify-item-page">
    <q-circular-progress v-if="loading.isActive" indeterminate size="50px" color="brand" />
    <span v-else-if="hasError"> Item not found </span>
    <template v-else>
      <div class="item-data-container">
        <upload-item-photo v-model="modifiedItem.photos" />
        <q-input v-model="modifiedItem.name" outlined :label="t('common.name')" />
        <input-item-tags v-model="modifiedItem.tags" />
      </div>

      <ul v-if="symbolsByGroups.size" ref="laundrySymbolsContainer" class="item-symbols-container">
        <li v-for="[group] in symbolsByGroups" :key="group">
          <laundry-symbols-button-group v-model="modifiedItem.symbols" :group="group" />
        </li>
      </ul>

      <q-btn
        v-if="route.params.id"
        color="positive"
        class="item-create-button"
        :label="userSettingsStorage.offlineMode ? t('pages.modifyItem.saveLocalItem') : t('common.save')"
        @click="edit"
      />
      <q-btn
        v-else
        color="positive"
        class="item-create-button"
        :label="userSettingsStorage.offlineMode ? t('pages.modifyItem.createLocalItem') : t('common.create')"
        @click="create"
      />
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useItems from '@/composables/useItems'
import { userSettingsStorage } from '@/utils/localStorage'
import type { ItemBlank } from '@/types/item'
import LaundrySymbolsButtonGroup from '@/components/item/symbols/LaundrySymbolsButtonGroup.vue'
import InputItemTags from '@/components/item/tags/InputItemTags.vue'
import UploadItemPhoto from '@/components/item/UploadItemPhoto.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { loading, notify } = useQuasar()
const { items, createItem, symbolsByGroups, getItemById, editItem } = useItems()

const laundrySymbolsContainer = ref<HTMLElement | null>(null)
const modifiedItem = ref<Required<Omit<ItemBlank, 'owner'>>>({
  name: '',
  symbols: [],
  photos: [],
  materials: [],
  tags: [],
})
const hasError = ref(false)

onBeforeMount(async () => {
  if (!route.params.id) return

  const currentItem = items.value.find(({ id }) => id === route.params.id)
  if (currentItem) {
    const { name, symbols, photos, tags, materials } = currentItem
    modifiedItem.value = { name, symbols, photos, materials, tags }
  } else {
    loading.isActive = true
    try {
      const item = await getItemById(route.params.id.toString())
      if (item) {
        const { name, symbols, photos, tags, materials } = item
        modifiedItem.value = { name, symbols, photos, materials, tags }
      } else {
        hasError.value = true
      }
    } finally {
      loading.isActive = false
    }
  }
})

function isSymbolsValid(symbols: Array<string>) {
  const isSymbolsSelected = symbols.length
  if (!isSymbolsSelected) {
    laundrySymbolsContainer?.value?.scrollIntoView({ behavior: 'smooth' })
    notify({
      type: 'negative',
      message: t('pages.modifyItem.validation.symbolsRequired'),
    })
    return false
  }
  return true
}

async function create() {
  if (!isSymbolsValid(modifiedItem.value.symbols)) return
  modifiedItem.value.symbols = modifiedItem.value.symbols.filter((symbol) => symbol)
  loading.show()
  try {
    await createItem(modifiedItem.value)
    notify({
      type: 'positive',
      message: t('pages.modifyItem.itemAdded'),
    })
    router.push({ name: 'Items' })
  } finally {
    loading.hide()
  }
}

async function edit() {
  if (!isSymbolsValid(modifiedItem.value.symbols)) return
  modifiedItem.value.symbols = modifiedItem.value.symbols.filter((symbol) => symbol)
  loading.show()
  try {
    await editItem({ ...modifiedItem.value, id: route.params.id.toString() })
    router.push({ name: 'Items' })
  } finally {
    loading.hide()
  }
}
</script>

<style>
.modify-item-page {
  display: grid;
  grid-template-areas:
    'data'
    'symbols'
    'button';
  grid-template-columns: 100%;
  grid-auto-rows: max-content;
  gap: 24px;
  padding: 8px;
  margin: auto;

  @media (width >= 1024px) {
    grid-template-areas:
      'data symbols'
      '. button';
    grid-template-columns: 2fr 5fr;
  }

  .item-data-container {
    display: grid;
    grid-area: data;
    grid-auto-rows: max-content;
    gap: 16px;
  }

  .item-symbols-container {
    display: grid;
    grid-area: symbols;
    gap: 16px;
  }

  .item-create-button {
    grid-area: button;
  }
}
</style>
