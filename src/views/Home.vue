<template>
  <section class="home-page q-pa-sm">
    <div class="flex justify-between items-center q-mb-md">
      <q-select
        v-model="currentCategory"
        class="category-select"
        :disable="isCategoriesLoading || isUserItemsLoading"
        :loading="isCategoriesLoading || isUserItemsLoading"
        :options="laundryLabelsTypes"
        option-value="code"
        option-label="value"
        dense
        @update:model-value="onChangeCategory"
      />

      <q-btn color="primary" icon="add" to="/create"> Add item </q-btn>
    </div>

    <section>
      <div v-if="isUserItemsLoading" class="laundry-cards">
        <LaundryCardSkeleton v-for="skeleton in 4" :key="`skeleton-${skeleton}`" />
      </div>
      <q-infinite-scroll @load="onLoadMoreItems">
        <div class="laundry-cards q-mb-md">
          <LaundryCard v-for="userItem in userItems" :key="userItem.id" :user-item="userItem" />
        </div>
        <template #loading>
          <div class="laundry-cards">
            <LaundryCardSkeleton v-for="skeleton in 4" :key="`skeleton-${skeleton}`" />
          </div>
        </template>
      </q-infinite-scroll>
    </section>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
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
    const laundryLabelsOptions = computed(() => store.state.laundryLabelsOptions)

    const laundryLabelsTypes = computed(() => [
      { code: null, value: 'All categories' },
      ...laundryLabelsOptions.value.types,
    ])

    const isUserItemsLoading = ref(false)
    const isCategoriesLoading = ref(false)
    const currentCategory = reactive({
      code: null,
      value: 'All categories',
    })

    onMounted(() => {
      if (laundryLabelsTypes.value.length === 1) {
        isCategoriesLoading.value = true
        store.dispatch('getItemsTypes').finally(() => (isCategoriesLoading.value = false))
      }
    })

    const onChangeCategory = (value: { code: string; value: string }) => {
      isUserItemsLoading.value = true
      store.dispatch('getItems', { page: 1, type: value.code }).finally(() => (isUserItemsLoading.value = false))
    }

    const onLoadMoreItems = (page: number, done: () => void) => {
      store.dispatch('getItems', { page, type: currentCategory.code ? currentCategory.code : null }).then(() => done())
    }

    return {
      userItems,
      laundryLabelsTypes,
      isCategoriesLoading,

      isUserItemsLoading,
      currentCategory,

      onChangeCategory,
      onLoadMoreItems,
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
