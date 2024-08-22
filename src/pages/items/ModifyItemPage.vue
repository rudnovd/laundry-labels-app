<template>
  <q-page class="modify-item-page">
    <span v-if="hasError"> Item not found </span>
    <template v-else>
      <div class="item-data-container">
        <upload-item-photo v-model="modifiedItem.photos" />
        <q-input v-model.trim="modifiedItem.name" :debounce="300" outlined :label="t('common.name')" />
        <input-item-tags v-model="modifiedItem.tags" />
        <select-item-materials v-model="modifiedItem.materials" />
      </div>

      <ul v-if="symbolsByGroups.size" ref="laundrySymbolsContainer" class="item-symbols-container">
        <li v-for="[group] in symbolsByGroups" :key="group">
          <laundry-symbols-button-group v-model="modifiedItem.symbols" :group="group" />
        </li>
      </ul>

      <q-btn
        v-if="route.params.id"
        :disable="!hasChanges"
        color="positive"
        class="item-create-button"
        :class="{ sticky: hasChanges }"
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
import { useEventListener } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useItems from '@/composables/useItems'
import { userSettingsStorage } from '@/utils/localStorage'
import type { ItemBlank } from '@/types/item'
import cloneDeep from 'lodash-es/cloneDeep'
import isEqual from 'lodash-es/isEqual'
import LaundrySymbolsButtonGroup from '@/components/item/symbols/LaundrySymbolsButtonGroup.vue'
import InputItemTags from '@/components/item/tags/InputItemTags.vue'
import UploadItemPhoto from '@/components/item/UploadItemPhoto.vue'
import SelectItemMaterials from '@/components/item/materials/SelectItemMaterials.vue'
import { isEqualSets } from '@/utils/set'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { loading, notify } = useQuasar()
const { items, createItem, symbolsByGroups, getItemById, editItem } = useItems()

const laundrySymbolsContainer = ref<HTMLElement | null>(null)
const modifiedItem = ref<Omit<ItemBlank, 'owner'>>({
  name: '',
  symbols: new Set(),
  photos: [],
  materials: [],
  tags: new Set(),
})
const initialItem = ref<Omit<ItemBlank, 'owner'>>(cloneDeep(modifiedItem.value))
const hasError = ref(false)
const hasChanges = computed(() => {
  const isEqualNames = initialItem.value.name === modifiedItem.value.name
  const isEqualSymbols = isEqualSets(initialItem.value.symbols, modifiedItem.value.symbols)
  const isEqualPhotos = isEqual(initialItem.value.photos, modifiedItem.value.photos)
  const isEqualMaterials = isEqual(initialItem.value.materials, modifiedItem.value.materials)
  const isEqualTags = isEqualSets(initialItem.value.tags, modifiedItem.value.tags)
  return !isEqualNames || !isEqualPhotos || !isEqualSymbols || !isEqualMaterials || !isEqualTags
})

onBeforeMount(async () => {
  if (!route.params.id) return

  const currentItem = items.value.find(({ id }) => id === route.params.id)
  if (currentItem) {
    modifiedItem.value = cloneDeep(currentItem)
    initialItem.value = cloneDeep(currentItem)
  } else {
    loading.show()
    try {
      const item = await getItemById(route.params.id.toString())
      if (item) {
        modifiedItem.value = cloneDeep(item)
        initialItem.value = cloneDeep(item)
      } else {
        hasError.value = true
      }
    } finally {
      loading.hide()
    }
  }
})

function isSymbolsValid(symbols: Set<string>) {
  const isSymbolsSelected = symbols.size
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
  loading.show()
  try {
    await createItem(modifiedItem.value)
    notify({
      type: 'positive',
      message: t('pages.modifyItem.itemAdded'),
    })
    initialItem.value = cloneDeep(modifiedItem.value)
    router.push({ name: 'Items' })
  } finally {
    loading.hide()
  }
}

async function edit() {
  if (!isSymbolsValid(modifiedItem.value.symbols)) return
  loading.show()
  try {
    await editItem({ ...modifiedItem.value, id: route.params.id.toString() })
    notify({
      type: 'positive',
      message: t('pages.modifyItem.itemUpdated'),
    })
    initialItem.value = cloneDeep(modifiedItem.value)
    router.push({ name: 'Items' })
  } finally {
    loading.hide()
  }
}

useEventListener(window, 'beforeunload', (event) => {
  if (hasChanges.value) {
    event.preventDefault()
    event.returnValue = ''
  }
})
onBeforeRouteLeave(() => {
  if (hasChanges.value) return window.confirm(t('alerts.unsavedChanges'))
})
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
    gap: 32px;
  }

  .item-create-button {
    grid-area: button;

    &.sticky {
      position: sticky;
      bottom: 8px;
    }
  }
}
</style>
