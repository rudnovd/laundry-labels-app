<template>
  <q-page class="items-page">
    <header>
      <q-btn
        color="primary"
        :size="isMaxItems ? 'sm' : undefined"
        :icon="isMaxItems ? undefined : 'add'"
        :to="{ name: 'Create item' }"
        :disable="isMaxItems || isLoading"
      >
        {{ t(isMaxItems ? 'pages.items.itemsLimitReached' : 'common.add') }}
      </q-btn>

      <q-input
        v-model.trim="search"
        rounded
        outlined
        :label="t('pages.items.searchTags')"
        dense
        :disable="isLoading"
        :maxlength="32"
        @keyup.enter="searchTag"
      >
        <template #append>
          <q-icon :class="{ invisible: !search }" name="check" @click="searchTag" />
        </template>
      </q-input>
    </header>

    <ul v-if="searchingTags.length" class="search-tags">
      <li>
        <item-tag class="text-white text-lowercase bg-negative" color="negative" @click="searchingTags = []">
          <q-icon name="delete" size="1em" />
          {{ t('common.clear') }}
        </item-tag>
      </li>
      <li v-for="tag in searchingTags" :key="tag">
        <item-tag>
          <q-icon name="close" size="1em" @click="removeSearchTag(tag)" />
          <span class="ellipsis">{{ tag }}</span>
        </item-tag>
      </li>
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
    <div v-else-if="searchingTags.length && !foundItems.length" class="flex column items-center">
      {{ t('pages.items.noItemsWithSelectedTags') }}
    </div>
    <div v-else class="flex column items-center">
      <span class="text-h6">{{ t('pages.items.noItemsAdded') }}</span>
      <q-btn class="q-mt-sm" color="primary" :to="{ name: 'Create item' }">{{ t('pages.items.addFirstItem') }}</q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useItemsStore } from '@/store/items'
import LaundryCard from '@/components/item/cards/LaundryCard.vue'
import LaundryCardSkeleton from '@/components/item/cards/LaundryCardSkeleton.vue'
import useDemoMode from '@/composables/useDemoMode'
import useItems from '@/composables/useItems'
import { ITEMS_LIMIT } from '@/constants'
import { defineAsyncComponent } from 'vue'
const ItemTag = defineAsyncComponent(() => import('@/components/item/tags/ItemTag.vue'))

const { t } = useI18n()
const { items, getItems } = useItems()
const itemsStore = useItemsStore()

const isLoading = ref(false)
const isMaxItems = computed(() => itemsStore.items.length >= ITEMS_LIMIT)

onBeforeMount(async () => {
  isLoading.value = true
  const demo = useDemoMode()
  try {
    const items = await getItems()
    if (!items.length && localStorage.getItem('demo')) {
      demo.showTourNotification()
    }
  } finally {
    isLoading.value = false
  }
})

const search = ref('')
const searchingTags = ref<Array<string>>([])
const foundItems = computed(() => {
  if (!searchingTags.value.length) return items.value
  return items.value.filter((item) => {
    for (const searchTag of searchingTags.value) {
      return item.tags.includes(searchTag)
    }
  })
})

function searchTag() {
  if (!search.value) return
  searchingTags.value.push(search.value)
  search.value = ''
}

function removeSearchTag(tag: string) {
  searchingTags.value = searchingTags.value.filter((searchTag) => searchTag !== tag)
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
    grid-template-columns: auto 160px;
    justify-content: space-between;
  }

  .search-tags {
    display: flex;
    gap: 8px;
    padding-bottom: 6px;
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .items-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(200px + 20dvmax), 1fr));
    gap: 16px;
  }
}
</style>
