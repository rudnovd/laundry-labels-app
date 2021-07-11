<template>
  <section class="home-page">
    <q-btn color="primary" icon="add" to="/create"> Add item </q-btn>
    <section class="cards-demo">
      <template v-if="isLoadingUserItems">
        <q-circular-progress indeterminate size="50px" color="lime" class="q-ma-md" />
      </template>
      <template v-else>
        <LaundryCard v-for="userItem in userItems" :key="userItem.id" :user-item="userItem" />
      </template>
    </section>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import LaundryCard from '@/components/cards/LaundryCard.vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Home',
  components: {
    LaundryCard,
  },
  setup() {
    const store = useStore()

    const isLoadingUserItems = ref(true)

    const userItems = computed(() => store.state.items)

    onBeforeMount(() => {
      store.dispatch('getItems').finally(() => (isLoadingUserItems.value = false))
    })

    return {
      isLoadingUserItems,

      userItems,
    }
  },
})
</script>

<style lang="scss" scoped>
.home-page {
  padding: 0 8px;
}

.cards-demo {
  display: grid;
  grid-template-columns: 100%;
  gap: 1rem;
}
</style>
