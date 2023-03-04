<template>
  <q-page class="item-page q-pb-md">
    <template v-if="currentItem">
      <q-img
        v-if="currentItem.images.length"
        class="item-image q-mb-md"
        :src="currentItem.images[0]"
        loading="lazy"
        fit="contain"
        decoding="async"
        height="100%"
      />

      <section class="q-px-sm" :class="{ 'q-pt-sm': !currentItem.images.length }">
        <h1 v-if="currentItem.name" class="text-h5">{{ currentItem.name }}</h1>

        <section class="item-icons q-mb-md">
          <div v-for="icon in currentItem.icons" :key="icon" class="icon-chip">
            <template v-if="!laundryIconsMap[icon]">
              <q-icon name="clear" size="5em" />
              <span>{{ t('noIconData') }}</span>
            </template>
            <template v-else>
              <q-icon :name="laundryIconsMap[icon]._id" size="5em" />
              <span>{{ t(laundryIconsMap[icon].description) }}</span>
            </template>
          </div>
        </section>

        <section v-if="currentItem.tags.length" class="item-tags q-mb-md">
          <q-chip v-for="tag in currentItem.tags" :key="tag">{{ tag }}</q-chip>
        </section>

        <section class="flex justify-between">
          <q-btn color="negative" outline :label="t('delete')" icon="delete" @click="callDeleteDialog" />
          <q-btn
            color="primary"
            outline
            :label="t('edit')"
            icon="edit"
            @click="router.push(`/items/edit/${currentItem?._id}`)"
          />
        </section>
      </section>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { laundryIconsMap } from '@/assets/laundryIcons'
import type { Item } from '@/interfaces/item'
import { useItemsStore } from '@/store/items'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { loading, dialog } = useQuasar()
const router = useRouter()
const { t } = useI18n()
const route = useRoute()
const itemsStore = useItemsStore()

const currentItem = ref<Item>()

const item = itemsStore.items.find((_item) => _item._id === route.params.id)
if (!item) {
  loading.show()
  itemsStore
    .getItemById({ _id: route.params.id as string })
    .then((item) => {
      currentItem.value = item
    })
    .finally(() => loading.hide())
} else {
  currentItem.value = item
}

const callDeleteDialog = () => {
  dialog({
    title: t('dialog.deleteItem'),
    message: currentItem.value?.name,
    cancel: t('dialog.cancel'),
  }).onOk(() => {
    loading.show()
    itemsStore
      .deleteItem({ _id: route.params.id as string })
      .then(() => router.push({ name: 'Items' }))
      .finally(() => loading.hide())
  })
}
</script>

<style lang="scss" scoped>
.item-page {
  max-width: 1280px;
  margin: auto;
}

.item-image {
  max-width: 600px;
  max-height: 300px;

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
  position: relative;
  display: grid;
  grid-template-columns: 64px auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.25rem;
  border: 1px solid $grey-4;
  border-radius: 8px;

  & img {
    font-size: 4rem;
  }

  & span:nth-child(2) {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
}
</style>
