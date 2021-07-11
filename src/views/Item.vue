<template>
  <section class="item-page">
    <template v-if="!currentItemIsLoading">
      <q-img
        :src="currentItem.images[0]"
        loading="lazy"
        decoding="async"
        height="100%"
        :alt="currentItem.name ? currentItem.name : currentItem.type"
      />

      <h4>{{ currentItem.name }}</h4>

      <div>
        <div v-for="icon in currentItem.laundryIcons" :key="icon" v-ripple class="icon-chip">
          <q-icon :name="icon" />
          <!-- <span>{{ icon.name }}</span> -->
        </div>
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import { userItem } from '@/interfaces/userItem'
import { computed, defineComponent, ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Item',
  setup() {
    const store = useStore()
    const route = useRoute()

    const items = computed(() => store.state.items)
    const currentItem = computed(() => items.value.find((item: userItem) => item.id === route.params.id))
    const currentItemIsLoading = ref(true)

    console.log(currentItem.value)

    if (!currentItem.value) {
      store.dispatch('getUserItemById', { id: route.params.id }).finally(() => (currentItemIsLoading.value = false))
    } else {
      currentItemIsLoading.value = false
    }

    return {
      currentItemIsLoading,
      currentItem,
    }
  },
})
</script>

<style lang="scss" scoped>
.icon-chip {
  display: grid;
  position: relative;
  padding: 0.25rem;
  grid-template-columns: 64px auto;
  gap: 0.5rem;
  align-items: center;
  border: 1px solid $grey-4;
  border-radius: 8px;

  & img {
    font-size: 4rem;
  }

  & span {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    overflow: hidden;
  }

  &.selected {
    background-color: rgba($grey-6, 0.3);
  }
}
</style>
