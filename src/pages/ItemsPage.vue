<template>
  <q-page class="items-page">
    <header>
      <q-btn
        color="primary"
        :size="isMaxItems ? 'sm' : undefined"
        :icon="isMaxItems ? undefined : 'add'"
        :to="{ name: 'Create item' }"
        :disable="isMaxItems || loading.isActive"
      >
        {{ t(isMaxItems ? 'pages.items.itemsLimitReached' : 'common.add') }}
      </q-btn>

      <q-input
        v-model.trim="search"
        rounded
        outlined
        :label="t('pages.items.searchTags')"
        dense
        :disable="loading.isActive"
        :maxlength="32"
        @keyup.enter="searchTag"
      >
        <template #append>
          <q-icon :class="{ invisible: !search }" name="check" @click="searchTag" />
        </template>
      </q-input>
    </header>

    <div v-if="searchingTags.length" class="search-tags">
      <item-tag
        class="chip text-white text-lowercase bg-negative"
        color="negative"
        clickable
        @click="searchingTags = []"
      >
        <q-icon class="q-mr-xs" name="delete" size="16px" />
        {{ t('common.clear') }}
      </item-tag>
      <button v-for="tag in searchingTags" :key="tag" class="chip" removable @remove="removeSearchTag(tag)">
        <span class="ellipsis">{{ tag }}</span>
      </button>
    </div>

    <ul v-if="loading.isActive" class="items-cards">
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
import { useQuasar } from 'quasar'
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

const { loading } = useQuasar()
const { t } = useI18n()
const { items, getItems } = useItems()
const itemsStore = useItemsStore()

const isMaxItems = computed(() => itemsStore.items.length >= ITEMS_LIMIT)

onBeforeMount(async () => {
  loading.isActive = true
  const demo = useDemoMode()
  try {
    const items = await getItems()
    if (!items.length && localStorage.getItem('demo')) {
      demo.showTourNotification()
    }
  } finally {
    loading.isActive = false
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
    padding-bottom: 4px;
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
