<template>
  <q-page v-if="!loading.isActive" class="create-item-page q-pa-md">
    <section class="info-container">
      <q-img v-if="editingItem.images.length" class="q-mb-sm" height="200px" :src="editingItem.images[0]" />

      <SelectItemTags v-model="editingItem.tags" />

      <q-input v-model="editingItem.name" filled label="Name" />
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

    <q-btn color="positive" class="submit-button" label="Save" @click="onSubmit" />
  </q-page>
</template>

<script setup lang="ts">
import { laundryIconsByGroup, laundryIconsMap } from '@/assets/laundryIcons'
import LaundryIconsGroup from '@/components/LaundryIconsGroup.vue'
import SelectItemTags from '@/components/SelectItemTags.vue'
import type { Item, ItemBlank } from '@/interfaces/item'
import type { LaundryIcon } from '@/interfaces/laundryIcon'
import { useItemsStore } from '@/store/items'
import { useQuasar } from 'quasar'
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { loading } = useQuasar()
const router = useRouter()
const route = useRoute()
const itemsStore = useItemsStore()

const userItems = computed(() => itemsStore.items)

const editingItem = reactive<ItemBlank>({
  name: '',
  icons: [],
  images: [],
  tags: [],
})

// Get item data if this doesn't exist in store
if (!userItems.value.find((userItem: Item) => userItem._id === route.params.id)) {
  loading.show()
  itemsStore
    .getItemById({ _id: route.params.id as string })
    .then((item) => {
      editingItem.name = item.name
      editingItem.icons = item.icons
      editingItem.images = item.images
      editingItem.tags = item.tags
    })
    .finally(() => loading.hide())
} else {
  const currentUserItem = userItems.value.find((userItem: Item) => userItem._id === route.params.id)
  if (currentUserItem) {
    editingItem.name = currentUserItem.name
    editingItem.icons = currentUserItem.icons
    editingItem.images = currentUserItem.images
    editingItem.tags = currentUserItem.tags
  }
}

const selectedLaundryIcons = computed(() => {
  const groups: Record<string, LaundryIcon> = {}
  editingItem.icons.forEach((icon) => {
    groups[laundryIconsMap[icon].group] = laundryIconsMap[icon]
  })
  return groups
})

const onSubmit = () => {
  loading.show()
  itemsStore
    .editItem({ item: { ...editingItem, _id: route.params.id as string } })
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
  grid-template-rows: auto;
  grid-template-columns: 100%;

  gap: 1.5rem;
  max-width: 1920px;
  margin: auto;

  @include media-medium {
    grid-template-areas:
      'info icons'
      '. submit';
    grid-template-rows: auto auto;
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
  width: 100%;
}
</style>
