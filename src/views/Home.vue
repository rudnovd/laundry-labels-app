<template>
  <section class="home-page q-pa-sm">
    <div class="flex justify-end q-mb-md">
      <q-btn color="primary" icon="add" to="/create" size="sm"> Add item </q-btn>
    </div>

    <section class="laundry-cards">
      <template v-if="isLoadingUserItems">
        <LaundryCardSkeleton v-for="skeleton in 4" :key="`skeleton-${skeleton}`" />
      </template>
      <template v-else>
        <LaundryCard v-for="userItem in userItems" :key="userItem.id" :user-item="userItem" />
      </template>
    </section>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
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

    const isLoadingUserItems = ref(false)
    const userItems = computed(() => store.state.items)

    onBeforeMount(() => {
      if (!userItems.value.length) {
        isLoadingUserItems.value = true
        store.dispatch('getItems').finally(() => (isLoadingUserItems.value = false))
      }
    })

    return {
      isLoadingUserItems,
      userItems,
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
</style>
