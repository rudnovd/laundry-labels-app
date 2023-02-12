<template>
  <q-page class="q-pa-sm">
    <section v-if="items.length" class="actions">
      <q-btn color="primary" icon="add" :to="{ name: 'Create item' }" :disable="items.length >= 20">Add</q-btn>

      <q-input
        v-model="search"
        rounded
        outlined
        label="Search tags"
        dense
        :maxlength="32"
        @keyup.enter="onAddSearchTag"
      >
        <template #append>
          <q-icon :class="{ invisible: !search }" name="check" @click="onAddSearchTag" />
        </template>
      </q-input>
    </section>

    <section v-if="searchTags.length" class="search-tags">
      <q-chip class="text-white" color="negative" clickable @click="searchTags = []">
        <q-icon class="q-mr-xs" name="delete" size="16px" />
        clear
      </q-chip>
      <q-chip v-for="tag in searchTags" :key="tag" removable @remove="onRemoveSearchTag(tag)">
        <span class="ellipsis">{{ tag }}</span>
      </q-chip>
    </section>

    <section class="laundry-cards">
      <template v-if="loading.isActive">
        <LaundryCardSkeleton v-for="skeleton in 4" :key="skeleton" />
      </template>

      <template v-else-if="items.length && !searchTags.length">
        <LaundryCard v-for="item in items" :key="item._id" :item="item" />
      </template>

      <div v-else-if="!items.length && !foundItems.length" class="flex column items-center">
        <span class="text-h6">No items added yet</span>
        <q-btn class="q-mt-sm" color="primary" :to="{ name: 'Create item' }">Add first item</q-btn>
      </div>

      <template v-else-if="foundItems.length">
        <LaundryCard v-for="item in foundItems" :key="item._id" :item="item" />
      </template>

      <div v-else-if="searchTags.length && !foundItems.length" class="flex column items-center">
        No items with selected tags
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import LaundryCard from '@/components/cards/LaundryCard.vue'
import LaundryCardSkeleton from '@/components/cards/LaundryCardSkeleton.vue'
import { useItemsStore } from '@/store/items'
import { useQuasar } from 'quasar'
import { computed, onBeforeMount, ref } from 'vue'

const { loading } = useQuasar()
const itemsStore = useItemsStore()

const search = ref('')
const searchTags = ref<Array<string>>([])

onBeforeMount(() => {
  loading.isActive = true
  itemsStore.getItems().finally(() => (loading.isActive = false))
})

const items = computed(() => itemsStore.items)
const foundItems = computed(() => {
  return items.value.filter((item) => {
    for (const searchTag of searchTags.value) {
      if (item.tags.includes(searchTag)) {
        return true
      }
    }
    return false
  })
})

const onAddSearchTag = () => {
  if (!search.value.trim()) {
    return
  }
  searchTags.value.push(search.value.trim())
  search.value = ''
}

const onRemoveSearchTag = (tag: string) => {
  searchTags.value = searchTags.value.filter((searchTag) => searchTag !== tag)
}
</script>

<style lang="scss" scoped>
.laundry-cards {
  display: grid;
  grid-template-columns: 100%;
  gap: 1rem;

  @include media-small {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  }
}

.actions {
  display: grid;
  grid-template-columns: auto 160px;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.search-tags {
  max-height: 215px;
  margin-bottom: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
