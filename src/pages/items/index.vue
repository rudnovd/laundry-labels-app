<template>
  <section class="items-page">
    <ItemsActions v-if="items.length" v-model="searchRecord" />
    <ItemsSearchChips v-if="hasRouterQuery && items.length" v-model="searchRecord" />
    <div v-if="isLoading" class="items-page__loading">
      {{ $t('common.loading') }}...
    </div>
    <ul v-else-if="foundItems.length" class="items-page__items-list">
      <li v-for="item in foundItems" :key="item.id">
        <ItemCard :item="item" />
      </li>
    </ul>
    <ItemsPlaceholder v-else :search-record />
    <router-view v-slot="{ Component, route }">
      <component :is="Component" v-if="route.path === '/items/filter'" />
    </router-view>
  </section>
</template>

<script setup lang="ts">
import type { Item } from '@/types/item'
import { intersection } from 'es-toolkit'
import { computed, defineAsyncComponent, onActivated, onBeforeMount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import useItems from '@/composables/useItems'
import { useOnboarding } from '@/composables/useOnboarding'
import { ALLOWED_ITEM_FILTERS } from '@/constants/items'
import { IS_ONBOARDING_FINISHED_KEY } from '@/constants/onboarding'
import { useUserStore } from '@/stores/user'

definePage({
  meta: {
    title: 'pages.items.title',
  },
})

const ItemCard = defineAsyncComponent(() => import('@/components/item/ItemCard.vue'))
const ItemsActions = defineAsyncComponent(() => import('@/components/items/ItemsActions.vue'))
const ItemsPlaceholder = defineAsyncComponent(() => import('@/components/items/ItemsPlaceholder.vue'))
const ItemsSearchChips = defineAsyncComponent(() => import('@/components/items/ItemsSearchChips.vue'))

const { items, symbols, getItems } = useItems()
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

const userStore = useUserStore()
const searchRecord = ref<Record<string, Array<string>>>({})
watch(searchRecord, newSearchRecord => router.replace({ query: newSearchRecord }), { deep: true })
onBeforeMount(async () => {
  if (router.currentRoute.value.query.onboarding === 'true') {
    useOnboarding().start()
    router.replace({ query: { ...router.currentRoute.value.query, onboarding: undefined } })
    return
  }
  if (userStore.isAuthenticated) {
    isLoading.value = true
  }
  try {
    await getItems()
  }
  finally {
    isLoading.value = false
  }
  if (items.value.length) {
    localStorage.setItem(IS_ONBOARDING_FINISHED_KEY, 'true')
  }
  const isOnboardingFinished = localStorage.getItem(IS_ONBOARDING_FINISHED_KEY) === 'true'
  if (!isOnboardingFinished) {
    const onboarding = useOnboarding()
    onboarding.start()
  }
})
onActivated(async () => {
  if (router.currentRoute.value.query.onboarding === 'true') {
    useOnboarding().start()
    router.replace({ query: { ...router.currentRoute.value.query, onboarding: undefined } })
    return
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
        if (!searchRecord.value[key]) {
          searchRecord.value[key] = []
        }
        searchRecord.value[key].push(value)
      }
    }
  }
})

watch(router.currentRoute, ({ query }, { name: previousPage }) => {
  if (previousPage !== '/items/filter') {
    return
  }
  for (const key of ALLOWED_ITEM_FILTERS) {
    if (searchRecord.value[key]) {
      delete searchRecord.value[key]
    }
    const value = query[key]
    const queryArray = Array.isArray(value) ? value : [value]
    for (const queryItem of queryArray) {
      if (!queryItem) {
        continue
      }
      if (!searchRecord.value[key]) {
        searchRecord.value[key] = []
      }
      searchRecord.value[key].push(queryItem)
    }
  }
})
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
</script>

<style>
.items-page {
  display: grid;
  grid-auto-rows: max-content;
  gap: 1rem;
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
    grid-template-columns: repeat(
      auto-fill,
      minmax(calc(var(--min-device-width) - var(--content-padding-inline) * 2), 1fr)
    );
    gap: 1rem;
  }
}
</style>
