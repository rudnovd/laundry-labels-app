<template>
  <section class="home-page q-pa-sm">
    <div class="flex justify-between items-center q-mb-md">
      <q-select
        v-model="currentCategory.value"
        class="category-select"
        :disable="isCategoriesLoading || isUserItemsLoading"
        :loading="isCategoriesLoading || isUserItemsLoading"
        :options="laundryLabelsTypes"
        option-value="code"
        option-label="value"
        dense
      />

      <q-btn color="primary" icon="add" to="/create"> Add item </q-btn>
    </div>

    <section class="laundry-cards">
      <template v-if="isUserItemsLoading">
        <LaundryCardSkeleton v-for="skeleton in 4" :key="`skeleton-${skeleton}`" />
      </template>
      <template v-else>
        <LaundryCard v-for="userItem in userItems" :key="userItem.id" :user-item="userItem" />
      </template>
    </section>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import LaundryCardSkeleton from '@/components/cards/LaundryCardSkeleton.vue'
import LaundryCard from '@/components/cards/LaundryCard.vue'

export default defineComponent({
  name: 'Home',
  components: {
    LaundryCardSkeleton,
    LaundryCard,
  },
  setup() {
    const store = useStore()

    const userItems = computed(() => store.state.items)
    const laundryLabelsTypes = computed(() => [
      { code: null, value: 'All categories' },
      ...store.state.laundryLabelsOptions.types,
    ])

    const isUserItemsLoading = ref(false)
    const isCategoriesLoading = ref(false)
    const currentCategory = reactive({
      code: null,
      value: 'All categories',
    })

    onBeforeMount(() => {
      if (laundryLabelsTypes.value.length === 1) {
        isCategoriesLoading.value = true
        store.dispatch('getItemsTypes').finally(() => (isCategoriesLoading.value = false))
      }

      if (!userItems.value.length) {
        isUserItemsLoading.value = true
        store.dispatch('getItems').finally(() => (isUserItemsLoading.value = false))
      }
    })

    return {
      userItems,
      laundryLabelsTypes,
      isCategoriesLoading,

      isUserItemsLoading,
      currentCategory,
    }
  },
})
</script>

<style lang="scss" scoped>
.laundry-cards {
  display: grid;
  grid-template-columns: 100%;
  gap: 1rem;
}

.category-select {
  width: 150px;
}
</style>
