<template>
  <q-page class="items-page">
    <header>
      <q-btn
        v-if="!isItemsLimitReached"
        class="add-new-item"
        padding="sm"
        color="primary"
        icon="add"
        :to="{ name: 'Create item' }"
        :disable="isLoading"
      >
        {{ t('common.add') }}
      </q-btn>
      <q-btn v-else color="negative" icon="not_interested" disable>
        {{ t('pages.items.itemsLimitReached') }}
      </q-btn>
      <q-btn
        :disable="!items.length"
        square
        dense
        color="primary"
        icon="filter_alt"
        @click="router.push({ name: 'Filter items', query: router.currentRoute.value.query })"
      />
      <q-input
        v-model.trim="search"
        class="search-input"
        rounded
        outlined
        :label="t('pages.items.search')"
        dense
        :disable="!items.length || isLoading"
        :maxlength="32"
        @keyup.enter="search ? searchAny() : void 0"
      >
        <template #append>
          <q-icon :class="{ invisible: !search }" name="check" @click="searchAny" />
        </template>
      </q-input>
    </header>

    <ul v-if="hasRouterQuery" class="search-tags">
      <li>
        <item-tag class="text-white text-lowercase bg-negative" color="negative" @click="resetFilters">
          <q-icon name="delete" size="1em" />
          {{ t('common.clear') }}
        </item-tag>
      </li>
      <ul v-for="(record, recordKey) in searchRecord" :key="recordKey">
        <li v-for="recordElement in record" :key="recordElement">
          <item-tag>
            <q-icon name="close" size="1em" @click="deleteQuery(recordKey, recordElement)" />
            <span class="ellipsis">
              {{ searchElementTitle(recordKey) }}: {{ searchElementValue(recordKey, recordElement) }}
            </span>
          </item-tag>
        </li>
      </ul>
    </ul>

    <ul v-if="isLoading" class="items-cards">
      <li v-for="skeleton in 4" :key="skeleton">
        <laundry-card-skeleton />
      </li>
    </ul>
    <ul v-else-if="foundItems.length" class="items-cards">
      <li v-for="item in foundItems" :key="item.id">
        <laundry-card :item="item" />
      </li>
    </ul>
    <div v-else-if="Object.keys(searchRecord).length" class="flex column items-center">
      {{ t('pages.items.noItemsWithSelectedTags') }}
    </div>
    <div v-else class="flex column items-center">
      <span class="text-h6">{{ t('pages.items.noItemsAdded') }}</span>
      <q-btn class="q-mt-sm" color="primary" :to="{ name: 'Create item' }">{{ t('pages.items.addFirstItem') }}</q-btn>
    </div>

    <router-view v-slot="{ Component, route }">
      <component :is="Component" v-if="route.name === 'Filter items'" />
    </router-view>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useItemsStore } from '@/store/items'
import LaundryCard from '@/components/item/cards/LaundryCard.vue'
import LaundryCardSkeleton from '@/components/item/cards/LaundryCardSkeleton.vue'
import useDemoMode from '@/composables/useDemoMode'
import useItems from '@/composables/useItems'
import { ITEMS_LIMIT } from '@/constants'
import { defineAsyncComponent } from 'vue'
import type { Item } from '@/types/item'
import { useRouter } from 'vue-router'
import { ALLOWED_ITEM_FILTERS } from '@/constants/items'
import { useUserStore } from '@/store/user'
import { userSettingsStorage } from '@/utils/localStorage'
const ItemTag = defineAsyncComponent(() => import('@/components/item/tags/ItemTag.vue'))

const { t } = useI18n()
const { items, symbols, getItems } = useItems()
const itemsStore = useItemsStore()
const router = useRouter()
const query = computed(() => router.currentRoute.value.query)
const hasRouterQuery = computed(() => {
  for (const key of ALLOWED_ITEM_FILTERS) {
    if (query.value[key]) return true
  }
  return false
})

const isLoading = ref(false)
const isItemsLimitReached = computed(() => itemsStore.items.length >= ITEMS_LIMIT)

const userStore = useUserStore()
onBeforeMount(async () => {
  if (userStore.isOnline && !userSettingsStorage.value.offlineMode) {
    isLoading.value = true
  }
  const demo = useDemoMode()
  try {
    const items = await getItems()
    if (!items.length && localStorage.getItem('demo')) demo.showTourNotification()
    else if (items.length && router.currentRoute.value.query.demo) {
      router.replace({
        name: 'Items',
        query: { ...router.currentRoute.value.query, demo: undefined },
      })
    }
  } finally {
    isLoading.value = false
  }

  if (hasRouterQuery.value) {
    for (const key of ALLOWED_ITEM_FILTERS) {
      if (!query.value[key]) continue
      const queryItem = query.value[key]
      const queryValues = Array.isArray(queryItem) ? queryItem : [queryItem]
      for (const value of queryValues) {
        if (!value) continue
        if (!searchRecord[key]) searchRecord[key] = []
        searchRecord[key].push(value)
      }
    }
  }
})

const search = ref('')
const searchRecord = reactive<Record<string, Array<string>>>({})
watch(searchRecord, (newSearchRecord) => {
  router.replace({ query: newSearchRecord })
})
watch(router.currentRoute, ({ query }, { name: previousPage }) => {
  if (previousPage !== 'Filter items') return
  for (const key of ALLOWED_ITEM_FILTERS) {
    if (searchRecord[key]) delete searchRecord[key]
    const value = query[key]
    const queryArray = Array.isArray(value) ? value : [value]
    for (const queryItem of queryArray) {
      if (!queryItem) continue
      if (!searchRecord[key]) searchRecord[key] = []
      searchRecord[key].push(queryItem)
    }
  }
})

const foundItems = computed(() => {
  if (!hasRouterQuery.value) return items.value
  return items.value.reduce<Array<Item>>((filteredItems, item) => {
    if (query.value.search) {
      const querySearch = Array.isArray(query.value.search) ? query.value.search : [query.value.search]
      for (const queryItem of querySearch) {
        if (!queryItem) continue
        if (filterByAny(item, queryItem)) filteredItems.push(item)
      }
    }
    if (query.value.tags) {
      const queryTags = Array.isArray(query.value.tags) ? query.value.tags : [query.value.tags]
      const queryTagsSet = new Set<string>(queryTags.map((tag) => tag?.toString() ?? ''))
      if (queryTagsSet.intersection(item.tags).size) filteredItems.push(item)
    }
    if (query.value.symbols) {
      const querySymbols = Array.isArray(query.value.symbols) ? query.value.symbols : [query.value.symbols]
      const querySymbolsSet = new Set<string>(querySymbols.map((symbol) => symbol?.toString() ?? ''))
      if (querySymbolsSet.intersection(item.symbols).size) filteredItems.push(item)
    }
    if (query.value.materials) {
      const queryMaterials = Array.isArray(query.value.materials) ? query.value.materials : [query.value.materials]
      for (const queryMaterial of queryMaterials) {
        if (!queryMaterial) continue
        if (item.materials.some((material) => material.includes(queryMaterial))) filteredItems.push(item)
      }
    }
    return filteredItems
  }, [])
})

function searchAny() {
  if (!searchRecord.search) searchRecord.search = []
  const searchQuery = search.value.toLowerCase()
  if (searchRecord.search.includes(searchQuery)) {
    search.value = ''
    return
  }
  searchRecord.search = [...searchRecord.search, searchQuery]
  search.value = ''
}
function filterByAny(item: Item, query: string): Item | null {
  if (item.name?.toLowerCase().includes(query)) return item
  for (const tag of item.tags) {
    if (tag.includes(query)) return item
  }
  for (const symbol of item.symbols) {
    if (symbols.value[symbol].description.toLowerCase().includes(query)) return item
  }
  for (const material of item.materials) {
    if (material.includes(query)) return item
  }
  return null
}
function deleteQuery(key: string, value: string) {
  searchRecord[key] = searchRecord[key].filter((queryItem) => queryItem !== value)
  if (!searchRecord[key].length) delete searchRecord[key]
}
function resetFilters() {
  for (const key in searchRecord) delete searchRecord[key]
}
function searchElementTitle(recordKey: string) {
  return t(`common.${recordKey}`).toLowerCase()
}
function searchElementValue(recordKey: string, recordElement: string) {
  let value: string = ''
  if (recordKey === 'symbols') value = symbols.value[recordElement].short
  else value = recordElement
  return value.toLowerCase()
}
</script>

<style>
.items-page {
  display: grid;
  grid-auto-rows: max-content;
  gap: 16px;
  padding: 8px;
  overflow-x: hidden;

  header {
    display: grid;
    grid-template-rows: max-content max-content;
    grid-template-columns: max-content max-content;
    gap: 8px 0;
    justify-content: space-between;

    .search-input {
      grid-column: 1 / -1;
    }

    @media (width >= 576px) {
      display: grid;
      grid-template-rows: max-content;
      grid-template-columns: 1fr max-content 250px;
      gap: 8px;

      .add-new-item {
        gap: 8px;
        max-width: 150px;
      }

      .search-input {
        grid-column: unset;
      }
    }
  }

  .search-tags {
    display: flex;
    gap: 8px;
    padding-bottom: 6px;
    overflow: auto hidden;
    scrollbar-width: thin;

    ul {
      display: inherit;
      gap: inherit;
    }
  }

  .items-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(200px + 20dvmax), 1fr));
    gap: 16px;
  }
}
</style>
