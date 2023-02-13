<template>
  <q-page class="q-pa-sm">
    <section class="actions">
      <q-btn color="primary" icon="add" :to="{ name: 'Create item' }" :disable="items.length >= 20">Add item</q-btn>

      <q-input v-model="search" rounded outlined label="Search tags" dense>
        <template #append>
          <q-icon :class="{ invisible: !search }" name="check" @click="onAddSearchTag" />
        </template>
      </q-input>
    </section>

    <section v-if="searchTags.length" class="q-mb-sm">
      <q-chip
        v-for="tag in searchTags"
        :key="tag"
        removable
        @remove="searchTags = searchTags.filter((searchTag) => searchTag !== tag)"
      >
        {{ tag }}
      </q-chip>
    </section>

    <section class="laundry-cards">
      <template v-if="loading.isActive">
        <LaundryCardSkeleton v-for="skeleton in 4" :key="skeleton" />
      </template>

      <template v-else-if="!loading.isActive && items.length && !searchTags.length">
        <LaundryCard v-for="item in items" :key="item._id" :item="item" />
      </template>

      <div v-else-if="!loading.isActive && !items.length && !foundItems.length" class="flex column items-center">
        No items added yet
        <q-btn color="primary" :to="{ name: 'Create item' }">Add first item</q-btn>
      </div>

      <template v-else-if="!loading.isActive && foundItems.length">
        <LaundryCard v-for="item in foundItems" :key="item._id" :item="item" />
      </template>

      <div v-else-if="!loading.isActive && searchTags.length && !foundItems.length" class="flex column items-center">
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
  searchTags.value.push(search.value.trim())
  search.value = ''
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
</style>
