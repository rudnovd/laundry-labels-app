<template>
  <q-card class="laundry-card" flat bordered @click="router.push(`/items/${item._id}`)">
    <q-card-section horizontal class="full-height">
      <q-img v-if="item.images.length" class="col-4" fit="contain" :src="item.images[0]" />

      <q-card-section
        :class="item.images.length ? 'col-8' : 'col-12'"
        class="q-px-sm q-pt-sm q-pb-none column laundry-card-body"
      >
        <div class="q-mb-sm ellipsis text-h6">{{ item.name }}</div>

        <ul class="row full-width q-mb-sm icons">
          <li v-for="icon in iconsValues.slice(0, item.images.length ? 6 : 8)" :key="icon._id" @click.stop>
            <q-icon tag="svg" :name="icon._id" size="2.6em" />
            <q-tooltip :anchor="'top middle'" :offset="[0, 42]">
              {{ t(icon.description) }}
            </q-tooltip>
          </li>
        </ul>

        <div v-if="item.tags.length" class="row no-wrap overflow-auto overflow-hidden-y full-width q-pb-sm item-tags">
          <q-chip v-for="tag in item.tags" :key="tag">{{ tag }}</q-chip>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { laundryIcons } from '@/assets/laundryIcons'
import type { Item } from '@/interfaces/item'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const props = defineProps<{
  item: Item
}>()

const router = useRouter()
const { t } = useI18n()

const iconsValues = laundryIcons.filter((icon) => props.item.icons.indexOf(icon._id) !== -1)
</script>

<style lang="scss" scoped>
.laundry-card {
  width: 100%;
  max-width: 500px;
  height: 180px;
  cursor: pointer;
  user-select: none;
}

.laundry-card-body {
  display: grid;
}

.icons {
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(3, minmax(36px, 1fr));
  gap: 0.5rem;
  width: 100%;
  max-height: 80px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  list-style-type: none;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    cursor: help;
    border: 1px solid $grey-6;
    border-radius: 4px;
  }
}

.item-tags {
  align-items: flex-end;
}

:deep(.q-icon > img) {
  pointer-events: none;
}
</style>
