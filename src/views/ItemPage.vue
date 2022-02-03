<template>
  <section class="item-page q-pb-md">
    <template v-if="currentItem">
      <q-img
        class="item-image q-mb-md"
        :class="{ 'no-image': !currentItem.images.length }"
        :src="currentItem.images[0]"
        loading="lazy"
        decoding="async"
        height="100%"
      />

      <section class="q-px-sm">
        <section class="item-icons q-mb-md">
          <div v-for="icon in currentItem.icons" :key="icon" class="icon-chip">
            <q-icon :name="laundryIconsMap[icon].icon" size="5em" />
            <span>{{ laundryIconsMap[icon].description }}</span>
          </div>
        </section>

        <section v-if="currentItem.tags.length" class="item-tags q-mb-md">
          <div>Tags:</div>
          <q-chip v-for="tag in currentItem.tags" :key="tag">{{ tag }}</q-chip>
        </section>

        <section class="flex justify-between">
          <q-btn color="negative" label="Delete item" icon="delete" @click="callDeleteDialog" />
          <q-btn color="primary" label="Edit item" icon="edit" @click="router.push(`/edit/${currentItem?._id}`)" />
        </section>

        <section v-if="currentItem._id.indexOf('offline-') > -1" class="q-mt-sm">
          <q-btn class="full-width" color="primary" label="Sync item with server" icon="sync" @click="syncItem" />
        </section>
      </section>
    </template>
  </section>
</template>

<script lang="ts">
import { laundryIconsMap } from '@/assets/laundryIcons'
import { db } from '@/db'
import type { Item } from '@/interfaces/item'
import request from '@/services/request'
import { useItemsStore } from '@/store/items'
import { useUserStore } from '@/store/user'
import { useQuasar } from 'quasar'
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'ItemPage',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()
    const items = useItemsStore()
    const user = useUserStore()

    const offlineMode = computed({ get: () => user.offlineMode, set: (value) => (user.offlineMode = value) })
    const currentItem = ref<Item>()

    $q.loading.show()
    items
      .getItem({ _id: route.params.id as string })
      .then(({ item }) => (currentItem.value = item))
      .finally(() => $q.loading.hide())

    const callDeleteDialog = () => {
      $q.dialog({
        message: `Delete item?`,
        cancel: true,
      }).onOk(() => {
        $q.loading.show()
        items
          .deleteItem({ _id: route.params.id as string })
          .then(() => router.push('/'))
          .finally(() => $q.loading.hide())
      })
    }

    const syncItem = async () => {
      if (!currentItem.value) return

      $q.loading.show()
      offlineMode.value = false
      const { _id, tags, icons } = currentItem.value

      let formData = new FormData()
      const images = await db.itemsImages.where({ itemId: _id }).toArray()
      formData.append('images', images[0].image)

      const imagesUrls = await request
        .post('/api/upload/items', {
          body: formData,
        })
        .json<{ images: Array<string> }>()

      try {
        await items.postItem({
          item: {
            tags,
            icons,
            images: imagesUrls.images,
          },
        })
        items.deleteItem({ _id })
        router.push('/')
      } finally {
        $q.loading.hide()
      }
    }

    return {
      router,

      currentItem,
      laundryIconsMap,

      callDeleteDialog,
      syncItem,
    }
  },
})
</script>

<style lang="scss" scoped>
.item-page {
  margin: auto;
  max-width: 1280px;
}

.item-image {
  max-height: 300px;
  max-width: 600px;

  @include media-medium {
    max-width: 100%;
  }
}

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

  @include media-small {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
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

  & span:nth-child(2) {
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
