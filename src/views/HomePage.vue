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

<script lang="ts">
import LaundryCard from '@/components/cards/LaundryCard.vue'
import LaundryCardSkeleton from '@/components/cards/LaundryCardSkeleton.vue'
import { useStore } from '@/store'
import { computed, defineComponent, onBeforeMount, onBeforeUnmount, ref } from 'vue'

export default defineComponent({
  name: 'HomePage',
  components: {
    LaundryCardSkeleton,
    LaundryCard,
  },
  setup() {
    const store = useStore()

    const items = computed(() => store.items)
    const offlineItems = computed(() => store.offlineItems)
    const isItemsLoading = ref(false)

    onBeforeMount(() => {
      isItemsLoading.value = true
      store.getItems().finally(() => (isItemsLoading.value = false))
    })

    onBeforeUnmount(() => {
      offlineItems.value.forEach((offlineItem) => {
        offlineItem.images.forEach((image) => URL.revokeObjectURL(image))
      })
    })

    return {
      items,
      offlineItems,
      isItemsLoading,
    }
  },
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
