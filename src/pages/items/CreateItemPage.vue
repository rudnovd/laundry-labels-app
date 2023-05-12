<template>
  <q-page class="create-item-page q-pa-sm">
    <section class="info-container">
      <UploadItemImage
        :images="newItem.images"
        @uploaded="newItem.images.push($event)"
        @remove="newItem.images = newItem.images.filter((url) => url !== $event)"
      />
      <q-input v-model="newItem.name" class="q-mb-lg" outlined :label="t('common.name')" />
      <InputItemTags v-model="newItem.tags" />
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

    <q-btn
      color="positive"
      class="submit-button"
      :label="t('common.create')"
      :disable="loading.isActive || !isOnline"
      @click="onSubmit"
    />
  </q-page>
</template>

<script setup lang="ts">
import { laundryIconsByGroup } from '@/assets/laundryIcons'
import InputItemTags from '@/components/item/InputItemTags.vue'
import UploadItemImage from '@/components/item/UploadItemImage.vue'
import LaundryIconsGroup from '@/components/LaundryIconsGroup.vue'
import useItems from '@/composables/useItems'
import type { ItemBlank } from '@/interfaces/item'
import { useUserStore } from '@/store/user'
import { useQuasar } from 'quasar'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
const { loading } = useQuasar()
const { createItem } = useItems()
const { isOnline } = useUserStore()

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
