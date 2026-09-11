<template>
  <section class="items-page">
    <div class="items-page__actions">
      <div class="add-actions">
        <router-link
          v-if="!isItemsLimitReached"
          class="button-link button-primary add-item-button"
          data-onboarding-element="add-item-button"
          to="/items/modify"
          :disabled="isLoading"
        >
          <IconAdd />
          {{ t('common.add') }}
        </router-link>
        <BaseTooltip v-else>
          <template #activator>
            <button class="button-primary" disabled>
              <IconAdd />
              {{ t('common.add') }}
            </button>
            {{ t('pages.items.itemsLimitReached') }}
          </template>
        </BaseTooltip>
        <button
          :disabled="!items.length"
          class="button-primary"
          @click="router.push({ path: '/items/filter', query: router.currentRoute.value.query })"
        >
          <IconFilter />
        </button>
      </div>
      <BaseChipsInput
        v-model="search"
        :placeholder="$t('pages.items.search')"
        :disabled="!items.length || isLoading"
        :maxlength="32"
        @keyup.enter="searchAny"
        @confirm="searchAny"
      />
    </div>
    <ul v-if="hasRouterQuery" class="items-page__query-tags">
      <li>
        <ItemTag @click="resetFilters">
          <IconDelete size="1em" />
          {{ t('common.clear') }}
        </ItemTag>
      </li>
      <ul v-for="(record, recordKey) in searchRecord" :key="recordKey">
        <li v-for="recordElement in record" :key="recordElement">
          <ItemTag element="div">
            <button class="icon-button" @click="deleteQuery(recordKey, recordElement)">
              <IconClose size="1em" />
            </button>
            <span class="ellipsis">
              {{ searchElementTitle(recordKey) }}: {{ searchElementValue(recordKey, recordElement) }}
            </span>
          </ItemTag>
        </li>
      </ul>
    </ul>
    <div v-if="isLoading" class="items-page__loading">
      {{ $t('common.loading') }}...
    </div>
    <ul v-else-if="foundItems.length" class="items-page__items-list">
      <li v-for="item in foundItems" :key="item.id">
        <ItemCard :item="item" />
      </li>
    </ul>
    <div v-else-if="Object.keys(searchRecord).length" class="items-page__empty">
      {{ t('pages.items.noItemsWithSelectedTags') }}
    </div>
    <div v-else class="items-page__empty">
      <span>{{ t('pages.items.noItemsAdded') }}</span>
      <router-link class="button-link button-primary" to="/items/modify">
        {{ t('pages.items.addFirstItem') }}
      </router-link>
    </div>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" v-if="route.path === '/items/filter'" />
    </router-view>
  </section>
</template>

<script setup lang="ts">
import type { Item } from '@/types/item'
import { intersection } from 'es-toolkit'
import { computed, defineAsyncComponent, onBeforeMount, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BaseChipsInput from '@/components/base/BaseChipsInput.vue'
import BaseTooltip from '@/components/base/BaseTooltip.vue'
import ItemCard from '@/components/item/ItemCard.vue'
import useItems from '@/composables/useItems'
import { useOnboarding } from '@/composables/useOnboarding'
import { ITEMS_LIMIT } from '@/constants'
import { ALLOWED_ITEM_FILTERS } from '@/constants/items'
import { useItemsStore } from '@/stores/items'
import { useUserStore } from '@/stores/user'

definePage({
  beforeEnter() {
    return '/profile'
  },
})

const ItemTag = defineAsyncComponent(() => import('@/components/item/ItemTag.vue'))
const IconAdd = defineAsyncComponent(() => import('~icons/mdi/add'))
const IconDelete = defineAsyncComponent(() => import('~icons/mdi/delete'))
const IconClose = defineAsyncComponent(() => import('~icons/mdi/close'))
const IconFilter = defineAsyncComponent(() => import('~icons/mdi/filter'))

const { t } = useI18n()
const { items, symbols, getItems } = useItems()
const itemsStore = useItemsStore()
const router = useRouter()
const query = computed(() => router.currentRoute.value.query)
const hasRouterQuery = computed(() => {
  for (const key of ALLOWED_ITEM_FILTERS) {
    if (query.value[key]) {
      return true
    }
  }
  return false
})

const isLoading = ref(false)
const isItemsLimitReached = computed(() => itemsStore.items.length >= ITEMS_LIMIT)

const userStore = useUserStore()
const search = ref('')
const searchRecord = reactive<Record<string, Array<string>>>({})
watch(searchRecord, newSearchRecord => router.replace({ query: newSearchRecord }))
onBeforeMount(async () => {
  if (router.currentRoute.value.query.demo) {
    const onboarding = useOnboarding()
    onboarding.start()
  }
  if (!userStore.settings.offlineMode) {
    isLoading.value = true
  }
  try {
    await getItems()
  }
  finally {
    isLoading.value = false
  }
  if (hasRouterQuery.value) {
    for (const key of ALLOWED_ITEM_FILTERS) {
      if (!query.value[key]) {
        continue
      }
      const queryItem = query.value[key]
      const queryValues = Array.isArray(queryItem) ? queryItem : [queryItem]
      for (const value of queryValues) {
        if (!value) {
          continue
        }
        if (!searchRecord[key]) {
          searchRecord[key] = []
        }
        searchRecord[key].push(value)
      }
    }
  }
})

watch(router.currentRoute, ({ query }, { name: previousPage }) => {
  if (previousPage !== '/items/filter') {
    return
  }
  for (const key of ALLOWED_ITEM_FILTERS) {
    if (searchRecord[key]) {
      delete searchRecord[key]
    }
    const value = query[key]
    const queryArray = Array.isArray(value) ? value : [value]
    for (const queryItem of queryArray) {
      if (!queryItem) {
        continue
      }
      if (!searchRecord[key]) {
        searchRecord[key] = []
      }
      searchRecord[key].push(queryItem)
    }
  }
})

const foundItems = computed<Item[]>(() => {
  if (!hasRouterQuery.value) {
    return items.value
  }
  const filteredIds = items.value.reduce<Set<Item['id']>>((ids, item) => {
    if (query.value.search) {
      const querySearch = Array.isArray(query.value.search) ? query.value.search : [query.value.search]
      for (const queryItem of querySearch) {
        if (!queryItem) {
          continue
        }
        if (filterByAny(item, queryItem)) {
          ids.add(item.id)
        }
      }
    }
    if (query.value.tags) {
      const queryTags = Array.isArray(query.value.tags) ? query.value.tags : [query.value.tags]
      const intersectedTags = intersection(queryTags, item.tags)
      if (intersectedTags.length) {
        ids.add(item.id)
      }
    }
    if (query.value.symbols) {
      const querySymbols = Array.isArray(query.value.symbols) ? query.value.symbols : [query.value.symbols]
      const intersectedSymbols = intersection(querySymbols, item.symbols)
      if (intersectedSymbols.length) {
        ids.add(item.id)
      }
    }
    if (query.value.materials) {
      const queryMaterials = Array.isArray(query.value.materials) ? query.value.materials : [query.value.materials]
      const itemMaterialNames = item.materials.map(material => material.split('-')[0])
      const intersectedMaterials = intersection(queryMaterials, itemMaterialNames)
      if (intersectedMaterials.length) {
        ids.add(item.id)
      }
    }
    return ids
  }, new Set<Item['id']>())
  return items.value.filter(item => filteredIds.has(item.id))
})

function searchAny() {
  if (!search.value) {
    return
  }
  if (!searchRecord.search)
    searchRecord.search = []
  const searchQuery = search.value.toLowerCase()
  if (searchRecord.search.includes(searchQuery)) {
    search.value = ''
    return
  }
  searchRecord.search = [...searchRecord.search, searchQuery]
  search.value = ''
}
function filterByAny(item: Item, query: string): Item | null {
  if (item.name?.toLowerCase().includes(query)) {
    return item
  }
  for (const tag of item.tags) {
    if (tag.includes(query)) {
      return item
    }
  }
  for (const symbol of item.symbols) {
    if (symbol.includes(query) || symbols.value[symbol].description.toLowerCase().includes(query)) {
      return item
    }
  }
  for (const material of item.materials) {
    if (material.split('-').at(0)?.includes(query)) {
      return item
    }
  }
  return null
}
function deleteQuery(key: string, value: string) {
  searchRecord[key] = searchRecord[key].filter(queryItem => queryItem !== value)
  if (!searchRecord[key].length) {
    delete searchRecord[key]
  }
}
function resetFilters() {
  for (const key in searchRecord) {
    delete searchRecord[key]
  }
}
function searchElementTitle(recordKey: string) {
  return t(`common.${recordKey}`).toLowerCase()
}
function searchElementValue(recordKey: string, recordElement: string) {
  let value: string = ''
  if (recordKey === 'symbols') {
    value = symbols.value[recordElement].short
  }
  else {
    value = recordElement
  }
  return value.toLowerCase()
}
</script>

<style>
.items-page {
  display: grid;
  grid-auto-rows: max-content;
  gap: 1rem;
  .items-page__actions {
    display: grid;
    row-gap: 0.5rem;
    .add-actions {
      display: flex;
      justify-content: space-between;
    }
  }
  .items-page__query-tags {
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
  .items-page__items-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(200px + 20dvmax), 1fr));
    gap: 1rem;
  }
  .items-page__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
