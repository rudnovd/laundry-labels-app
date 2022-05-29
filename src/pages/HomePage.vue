<template>
  <section class="home-page q-pa-sm">
    <div class="flex justify-between items-center q-mb-md">
      <q-btn color="primary" icon="add" to="/create">Add item</q-btn>
    </div>

    <section class="laundry-cards-section">
      <div v-if="isItemsLoading" class="laundry-cards">
        <LaundryCardSkeleton v-for="skeleton in 4" :key="`skeleton-${skeleton}`" />
      </div>

      <div v-if="!isItemsLoading && items.length" class="laundry-cards q-mb-md">
        <LaundryCard v-for="item in items" :key="item._id" :item="item" />
      </div>

      <div v-if="!isItemsLoading && offlineItems.length">
        <div>unsynced items:</div>
        <div class="laundry-cards q-mb-md">
          <LaundryCard v-for="(item, index) in offlineItems" :key="`item-blank-${index}`" :item="item" />
        </div>
      </div>

      <div v-if="!isItemsLoading && !items.length && !offlineItems.length" class="flex column items-center">
        No items added yet
        <q-btn color="primary" to="/create">Add first item</q-btn>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import LaundryCard from '@/components/cards/LaundryCard.vue'
import LaundryCardSkeleton from '@/components/cards/LaundryCardSkeleton.vue'
import { useItemsStore } from '@/store/items'
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue'

const itemsStore = useItemsStore()

const items = computed(() => itemsStore.items)
const offlineItems = computed(() => itemsStore.offlineItems)
const isItemsLoading = ref(false)

onBeforeMount(() => {
  isItemsLoading.value = true
  itemsStore.getItems().finally(() => (isItemsLoading.value = false))
})

onBeforeUnmount(() => {
  offlineItems.value.forEach((offlineItem) => {
    offlineItem.images.forEach((image) => URL.revokeObjectURL(image))
  })
})
</script>

<style lang="scss" scoped>
.laundry-cards {
  display: grid;
  grid-template-columns: 100%;
  gap: 1rem;

  @include media-small {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

.category-select {
  width: 150px;
}
</style>
