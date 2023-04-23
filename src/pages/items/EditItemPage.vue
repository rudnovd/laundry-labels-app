<template>
  <q-page v-if="!loading.isActive" class="create-item-page q-pa-md">
    <section class="info-container">
      <UploadItemImage
        :images="editingItem.images"
        @uploaded="editingItem.images.push($event)"
        @remove="editingItem.images = editingItem.images.filter((url) => url !== $event)"
      />
      <q-input v-model="editingItem.name" class="q-mb-lg" filled :label="t('common.name')" />
      <InputItemTags v-model="editingItem.tags" />
    </section>

    <section class="washing-icons-container">
      <LaundryIconsGroup
        v-for="(icons, group) in laundryIconsByGroup"
        :key="group"
        :group="{ name: group.toString(), icons: icons }"
        :value="selectedLaundryIcons[group]"
        @remove="editingItem.icons = editingItem.icons.filter((icon) => icon !== $event._id)"
        @change="editingItem.icons.push($event._id)"
      />
    </section>

    <q-btn
      color="positive"
      class="submit-button"
      :label="t('common.save')"
      :disable="loading.isActive"
      @click="onSubmit"
    />
  </q-page>
</template>

<script setup lang="ts">
import { laundryIconsByGroup, laundryIconsMap } from '@/assets/laundryIcons'
import InputItemTags from '@/components/item/InputItemTags.vue'
import UploadItemImage from '@/components/item/UploadItemImage.vue'
import LaundryIconsGroup from '@/components/LaundryIconsGroup.vue'
import type { Item, ItemBlank } from '@/interfaces/item'
import type { LaundryIcon } from '@/interfaces/laundryIcon'
import { useItemsStore } from '@/store/items'
import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { loading } = useQuasar()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const itemsStore = useItemsStore()

const userItems = computed(() => itemsStore.items)

const editingItem = ref<ItemBlank>({
  name: '',
  icons: [],
  images: [],
  tags: [],
})

const currentItem = userItems.value.find((userItem: Item) => userItem._id === route.params.id)
if (!currentItem) {
  loading.show()
  itemsStore
    .getItemById({ _id: route.params.id as string })
    .then((item) => {
      const { name, icons, images, tags } = item
      editingItem.value = {
        ...editingItem.value,
        name,
        icons,
        images,
        tags,
      }
    })
    .finally(() => loading.hide())
} else {
  const { name, icons, images, tags } = currentItem
  editingItem.value = {
    ...editingItem.value,
    name,
    icons,
    images,
    tags,
  }
}

const selectedLaundryIcons = computed(() => {
  const groups: Record<string, LaundryIcon> = {}
  editingItem.value.icons.forEach((icon) => {
    groups[laundryIconsMap[icon].group] = laundryIconsMap[icon]
  })
  return groups
})

const onSubmit = () => {
  loading.show()
  itemsStore
    .editItem({ item: { ...editingItem.value, _id: route.params.id as string } })
    .then(() => router.push({ name: 'Items' }))
    .finally(() => loading.hide())
}
</script>

<style lang="scss" scoped>
.create-item-page {
  display: grid;
  grid-template-areas:
    'info'
    'icons'
    'submit';
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: auto;

  @include media-medium {
    grid-template-areas:
      'info icons'
      '. submit';
    grid-template-columns: 2fr 5fr;
  }
}

.info-container {
  grid-area: info;
}

.washing-icons-container {
  display: grid;
  grid-area: icons;
  gap: 1rem;
  margin-bottom: 16px;
}

.submit-button {
  grid-area: submit;
}
</style>
