<template>
  <q-dialog
    v-model="isActive"
    :persistent="!!filtersCount"
    full-width
    full-height
    @hide="router.replace({ name: 'Items', query: router.currentRoute.value.query })"
  >
    <q-card class="filter-items-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ t('pages.filterItemsDialog.filteringItems') }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>

      <q-card-section class="filter-items-card-body">
        <div>
          <q-input
            v-model.trim="search"
            class="search-input"
            rounded
            outlined
            :label="t('pages.items.search')"
            dense
            :maxlength="32"
            @keyup.enter="addSearchFilter"
          >
            <template #append>
              <q-icon :class="{ invisible: !search }" name="check" @click="addSearchFilter" />
            </template>
          </q-input>

          <ul v-if="filter.search.size" class="filter-list">
            <span class="filter-title">{{ t('common.search') }}:</span>
            <li>
              <ul class="filter-inner-list">
                <li v-for="searchTag in filter.search" :key="searchTag">
                  <l-chip selected @click="filter.search.delete(searchTag)">
                    {{ searchTag }}
                  </l-chip>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <ul v-if="filtering.tags.size" class="filter-list">
          <span class="filter-title">{{ t('common.tags') }}:</span>
          <li v-for="[tagsGroup, groupTags] in filtering.tags" :key="tagsGroup">
            <ul class="filter-inner-list">
              <li v-for="tag in groupTags" :key="tag" @click="toggleFilter('tags', tag)">
                <item-tag-component :selected="filter.tags.has(tag)">
                  {{ tag }}
                </item-tag-component>
              </li>
            </ul>
          </li>
        </ul>

        <ul v-if="filtering.materials.size" class="filter-list">
          <span class="filter-title">{{ t('common.materials') }}:</span>
          <li>
            <ul class="filter-inner-list">
              <li v-for="material in filtering.materials" :key="material" @click="toggleFilter('materials', material)">
                <l-chip :selected="filter.materials.has(material)">
                  {{ material }}
                </l-chip>
              </li>
            </ul>
          </li>
        </ul>

        <ul v-if="filtering.symbols.size" class="filter-list">
          <span class="filter-title">{{ t('common.symbols') }}:</span>
          <li v-for="[symbolGroup, filteringSymbols] in filtering.symbols" :key="symbolGroup" class="filter-inner-list">
            <ul class="symbols-list-group">
              <li v-for="symbol in filteringSymbols" :key="symbol">
                <l-chip :selected="filter.symbols.has(symbol)" @click="toggleFilter('symbols', symbol)">
                  <img
                    :src="`/icons/laundry/${symbolGroup}/${symbol}.svg`"
                    :alt="`${symbol.split('-').join(' ')} icon`"
                  />
                  {{ symbols[symbol].short }}
                </l-chip>
              </li>
            </ul>
          </li>
        </ul>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          :disable="!filtersCount"
          :label="applyFiltersText"
          color="primary"
          @click="applyFilter"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import useItems from '@/composables/useItems'
import { ALLOWED_ITEM_FILTERS, type ItemFilterKey } from '@/constants/items'
import type { ItemMaterialName, ItemSymbol, ItemTag } from '@/types/item'
import { onMounted, reactive } from 'vue'
import { defineAsyncComponent } from 'vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const ItemTagComponent = defineAsyncComponent(() => import('@/components/item/tags/ItemTag.vue'))
const LChip = defineAsyncComponent(() => import('@/components/item/LChip.vue'))

const { t } = useI18n()
const router = useRouter()
const query = computed(() => router.currentRoute.value.query)
const hasQuery = computed(() => {
  for (const key of ALLOWED_ITEM_FILTERS) {
    if (query.value[key]) return true
  }
  return false
})
const { items, symbols, materials, symbolsByGroups, tags, isCustomTag, customTagGroup, tagsRecord } = useItems()

const search = ref('')
const filter = reactive<Record<ItemFilterKey, Set<string>>>({
  search: new Set<string>(),
  tags: new Set<ItemTag['name']>(),
  materials: new Set<ItemMaterialName>(),
  symbols: new Set<ItemSymbol['name']>(),
})
onMounted(() => {
  if (!hasQuery.value) return
  for (const key of ALLOWED_ITEM_FILTERS) {
    if (!query.value[key]) continue
    const queryItem = query.value[key]
    const queryValues = Array.isArray(queryItem) ? queryItem : [queryItem]
    for (const value of queryValues) {
      if (!value) continue
      filter[key].add(value)
    }
  }
})
const filtersCount = computed(() => Object.values(filter).reduce((acc, val) => acc + val.size, 0))
const applyFiltersText = computed(() => {
  if (!filtersCount.value) return t('common.apply')
  return `${t('common.apply')} ${t('common.pluralization.filters', filtersCount.value)}`
})

type Count = number

const isActive = ref(true)
const filtering = computed(() => {
  // Create initial counters of all tags, materials and symbols
  const allTagsInitialCounter: Record<ItemTag['group'], Record<ItemTag['name'], Count>> = {}
  for (const { group, items } of tags.value) {
    allTagsInitialCounter[group] = {}
    for (const tag of items) allTagsInitialCounter[group][tag] = 0
  }

  const allMaterialsInitialCounter: Record<ItemMaterialName, Count> = {}
  for (const material of materials.value) {
    allMaterialsInitialCounter[material] = 0
  }

  const allSymbolsInitialCounterMap = new Map<ItemSymbol['group'], Record<ItemSymbol['name'], Count>>()
  for (const [group, symbols] of symbolsByGroups.value) {
    const symbolsOfGroupCounter = symbols.reduce<Record<ItemSymbol['name'], Count>>((acc, symbol) => {
      acc[symbol.name] = 0
      return acc
    }, {})
    allSymbolsInitialCounterMap.set(group, symbolsOfGroupCounter)
  }

  // Count tags, materials and symbols from user items
  for (const item of items.value) {
    for (const tag of item.tags) {
      if (isCustomTag(tag)) {
        if (!allTagsInitialCounter[customTagGroup.value.group][tag]) {
          allTagsInitialCounter[customTagGroup.value.group][tag] = 0
        }
        allTagsInitialCounter[customTagGroup.value.group][tag]++
      } else {
        const tagGroup = tagsRecord.value[tag].group
        allTagsInitialCounter[tagGroup][tag]++
      }
    }
    for (const material of item.materials) {
      const [materialName] = material.split('-')
      allMaterialsInitialCounter[materialName]++
    }
    for (const symbol of item.symbols) {
      const symbolGroup = symbols.value[symbol].group
      if (symbolGroup) allSymbolsInitialCounterMap.get(symbolGroup)![symbol]++
      else allSymbolsInitialCounterMap.get(customTagGroup.value.group)![symbol]++
    }
  }

  // fill user tags, materials and symbols
  const userTagsMap = new Map<ItemTag['group'], Set<ItemTag['name']>>()
  for (const groupKey in allTagsInitialCounter) {
    const nonEmptyTags = Object.entries(allTagsInitialCounter[groupKey])
      .filter(([, count]) => count > 0)
      .map(([tag]) => tag)
    if (nonEmptyTags.length) userTagsMap.set(groupKey, new Set(nonEmptyTags))
  }

  const userMaterialsFilterResult = new Set<ItemMaterialName>()
  for (const [materialName, count] of Object.entries(allMaterialsInitialCounter)) {
    if (count !== 0) userMaterialsFilterResult.add(materialName)
  }

  const userSymbolsResultMap = new Map<ItemSymbol['group'], Set<ItemSymbol['name']>>()
  for (const [groupKey, groupSymbols] of allSymbolsInitialCounterMap) {
    const nonEmptySymbols = Object.entries(groupSymbols)
      .filter(([, count]) => count > 0)
      .map(([symbol]) => symbol)
    if (nonEmptySymbols.length) userSymbolsResultMap.set(groupKey, new Set(nonEmptySymbols))
  }

  return {
    tags: userTagsMap,
    materials: userMaterialsFilterResult,
    symbols: userSymbolsResultMap,
  }
})

function toggleFilter(key: ItemFilterKey, value: string) {
  filter[key].has(value) ? filter[key].delete(value) : filter[key].add(value)
}

function addSearchFilter() {
  const searchQuery = search.value.toLowerCase()
  search.value = ''
  for (const tags of filtering.value.tags.values()) {
    if (tags.has(searchQuery)) {
      filter.tags.add(searchQuery)
      return
    }
  }
  for (const materials of filtering.value.materials) {
    if (materials.includes(searchQuery)) {
      filter.materials.add(searchQuery)
      return
    }
  }
  for (const filteringSymbols of filtering.value.symbols.values()) {
    for (const symbolName of filteringSymbols) {
      if (symbols.value[symbolName].short.toLowerCase().includes(searchQuery)) {
        filter.symbols.add(symbolName)
        return
      }
    }
  }
  filter.search.add(searchQuery)
}

function applyFilter() {
  const searchQuery: Partial<Record<ItemFilterKey, Array<string>>> = {}
  for (const filterKey of ALLOWED_ITEM_FILTERS) {
    if (filter[filterKey].size) searchQuery[filterKey] = [...filter[filterKey]]
  }
  router.push({ name: 'Items', query: searchQuery })
}
</script>

<style>
.filter-items-card {
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  align-items: start;
  overflow-y: hidden;

  .filter-items-card-body {
    display: grid;
    grid-template-columns: 100%;
    grid-auto-rows: max-content;
    gap: 16px;
    height: 100%;
    overflow-x: hidden;
    scrollbar-width: thin;

    .search-input {
      max-width: 500px;
    }

    .filter-list {
      display: grid;
      grid-template-columns: 100%;
      gap: 4px;
    }

    .filter-title {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .filter-inner-list {
      display: flex;
      gap: 8px;
      padding-bottom: 6px;
      overflow-x: auto;
      scrollbar-width: thin;
    }

    .symbols-list-group {
      display: flex;
      gap: 4px;

      li > .l-chip {
        height: 3em;

        img {
          height: 100%;
        }
      }
    }
  }
}
</style>
