<template>
  <section class="q-pa-sm">
    <div class="flex justify-between items-center q-mb-md">
      <q-btn color="primary" icon="add" to="/item/create" :disable="items.length >= 20">Add item</q-btn>
    </div>

    <section>
      <div v-if="loading.isActive" class="laundry-cards">
        <LaundryCardSkeleton v-for="skeleton in 4" :key="`skeleton-${skeleton}`" />
      </div>

      <div v-if="!loading.isActive && items.length" class="laundry-cards q-mb-md">
        <LaundryCard v-for="item in items" :key="item._id" :item="item" />
      </div>

      <div v-if="!loading.isActive && !items.length" class="flex column items-center">
        No items added yet
        <q-btn color="primary" to="/item/create">Add first item</q-btn>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import LaundryCard from '@/components/cards/LaundryCard.vue'
import LaundryCardSkeleton from '@/components/cards/LaundryCardSkeleton.vue'
import { useItemsStore } from '@/store/items'
import { useQuasar } from 'quasar'
import { computed, onBeforeMount } from 'vue'

const { loading } = useQuasar()
const itemsStore = useItemsStore()

const items = computed(() => itemsStore.items)

onBeforeMount(() => {
  loading.isActive = true
  itemsStore.getItems().finally(() => (loading.isActive = false))
})
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

.category-select {
  width: 150px;
}
</style>
