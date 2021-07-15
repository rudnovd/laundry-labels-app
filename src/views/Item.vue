<template>
  <section class="item-page q-pb-md">
    <template v-if="currentItemIsLoading">
      <q-circular-progress indeterminate size="50px" color="lime" class="q-ma-md" />
    </template>

    <template v-if="!currentItemIsLoading && currentItem">
      <q-img
        :class="{ 'no-image': !currentItem.images.length }"
        :src="currentItem.images[0]"
        loading="lazy"
        decoding="async"
        height="100%"
        :alt="currentItem.name ? currentItem.name : currentItem.type.value"
      />

      <section class="q-px-sm">
        <section class="item-info">
          <div>
            {{ currentItem.name }}
          </div>

          <div class="flex justify-between">
            <span>{{ currentItem.type.value }}</span>
            <span v-if="currentItem.color" class="item-color" :style="{ background: currentItem.color.value }" />
          </div>
        </section>

        <section class="item-icons q-mb-xl">
          <div v-for="icon in currentItem.laundryIcons" :key="icon.code" class="icon-chip">
            <q-icon :name="icon.icon" />
            <span>{{ icon.text }}</span>
          </div>
        </section>

        <section class="flex justify-between">
          <q-btn color="primary" label="Edit item" icon="edit" @click="router.push(`/edit/${currentItem.id}`)" />
          <q-btn color="negative" label="Delete item" icon="delete" @click="showDeleteDialog = true" />
        </section>
      </section>

      <q-dialog v-model="showDeleteDialog">
        <q-card>
          <q-card-section>
            <span>Delete {{ currentItem.name || 'item' }} ?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat label="Cancel" color="primary" />
            <q-btn v-close-popup flat label="Delete" color="negative" @click="deleteItem" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </template>
  </section>
</template>

<script lang="ts">
import { userItem } from '@/interfaces/userItem'
import { computed, defineComponent, ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Item',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const items = computed(() => store.state.items)
    const currentItem = computed(() => items.value.find((item: userItem) => item.id === route.params.id))
    const currentItemIsLoading = ref(false)
    const userDeleteIsLoading = ref(false)

    const deleteItem = () => {
      userDeleteIsLoading.value = true
      store
        .dispatch('deleteUserItem', { id: route.params.id })
        .then(() => router.push('/'))
        .finally(() => (userDeleteIsLoading.value = false))
    }

    if (!currentItem.value) {
      currentItemIsLoading.value = true
      store
        .dispatch('getUserItemById', { id: route.params.id })
        .then((items_: userItem[]) => {
          if (!items_.find((item) => item.id === route.params.id)) router.push('/')
        })
        .finally(() => (currentItemIsLoading.value = false))
    }

    return {
      router,
      showDeleteDialog: ref(false),
      currentItemIsLoading,
      currentItem,

      deleteItem,
    }
  },
})
</script>

<style lang="scss" scoped>
.item-info {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;

  div:first-child {
    font-size: 1.25rem;
    font-weight: 500;
  }
}

.item-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.item-icons {
  display: grid;
  gap: 1rem;
}

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
}

.no-image {
  background: $grey-4;
}
</style>
