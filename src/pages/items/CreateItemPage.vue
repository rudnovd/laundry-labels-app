<template>
  <q-page class="create-item-page q-pa-sm">
    <section class="info-container">
      <UploadItemImage
        :images="newItem.images"
        @uploaded="newItem.images.push($event)"
        @remove="newItem.images = newItem.images.filter((url) => url !== $event)"
      />

      <SelectItemTags v-model="newItem.tags" />

      <q-input v-model="newItem.name" filled label="Item name" />
    </section>

    <section class="washing-icons-container">
      <LaundryIconsGroup
        v-for="(icons, group) in laundryIconsByGroup"
        :key="group"
        :group="{ name: group.toString(), icons: icons }"
        @remove="newItem.icons = newItem.icons.filter((icon) => icon !== $event._id)"
        @change="newItem.icons.push($event._id)"
      />
    </section>

    <q-btn color="positive" class="submit-button" label="Create" @click="onSubmit" />
  </q-page>
</template>

<script setup lang="ts">
import { laundryIconsByGroup } from '@/assets/laundryIcons'
import LaundryIconsGroup from '@/components/LaundryIconsGroup.vue'
import SelectItemTags from '@/components/SelectItemTags.vue'
import UploadItemImage from '@/components/UploadItemImage.vue'
import type { ItemBlank } from '@/interfaces/item'
import { useItemsStore } from '@/store/items'
import { useQuasar } from 'quasar'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { loading } = useQuasar()
const { createItem } = useItemsStore()

const newItem = reactive<ItemBlank>({
  name: '',
  icons: [],
  images: [],
  tags: [],
})

const onSubmit = () => {
  loading.show()
  createItem({ item: newItem })
    .then(() => router.push({ name: 'Items' }))
    .finally(() => loading.hide())
}
</script>

<style lang="scss" scoped>
.create-item-page {
  max-width: 1920px;
  margin: auto;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto;
  grid-template-areas:
    'info'
    'icons'
    'submit';

  gap: 1.5rem;

  @include media-medium {
    grid-template-columns: 2fr 5fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      'info icons'
      '. submit';
  }
}

.info-container {
  grid-area: info;
}

.item-image {
  margin-bottom: 16px;
}

.no-image {
  background: $grey-4;
}

.washing-icons-container {
  display: grid;
  gap: 1rem;
  grid-area: icons;
  margin-bottom: 16px;
}

.submit-button {
  width: 100%;
  grid-area: submit;
}
</style>
