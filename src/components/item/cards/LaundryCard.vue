<template>
  <div class="laundry-card" @click="router.push({ name: 'Item', params: { id: item.id } })">
    <div class="laundry-card-data">
      <div v-if="item.name || item.id.includes('offline-')" class="title-container">
        <q-icon v-if="item.id.includes('offline-')" name="cloud_off" title="offline item" />
        <span class="title">{{ item.name }}</span>
      </div>

      <ul class="symbols">
        <li v-for="{ name, group, description } in selectedSymbols" :key="name" @click.stop>
          <img
            :src="`/icons/laundry/${group}/${name}.svg`"
            height="48px"
            width="48px"
            :alt="`${name.split('-').join(' ')} icon`"
          />
          <q-tooltip anchor="top middle" :offset="[0, 42]">
            {{ description }}
          </q-tooltip>
        </li>
      </ul>

      <ul class="tags">
        <li v-for="tag in item.tags" :key="tag">
          <item-tag>{{ tag }}</item-tag>
        </li>
      </ul>
    </div>
    <item-photo v-if="item.photos.length" :path="item.photos[0]" :alt="`${item.name} photo` ?? 'item photo'" />
  </div>
</template>

<script setup lang="ts">
import useItems from '@/composables/useItems'
import { type ItemSymbol, type Item } from '@/types/item'
import { defineAsyncComponent } from 'vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const ItemTag = defineAsyncComponent(() => import('@/components/item/tags/ItemTag.vue'))
const ItemPhoto = defineAsyncComponent(() => import('@/components/item/ItemPhoto.vue'))

const props = defineProps<{ item: Item }>()

const router = useRouter()
const { symbols } = useItems()

const selectedSymbols = computed(() => {
  return props.item.symbols.reduce<Array<ItemSymbol>>((selected, symbolKey) => {
    selected.push({ name: symbolKey, ...symbols.value[symbolKey] })
    return selected
  }, [])
})
</script>

<style>
.laundry-card {
  display: grid;
  grid: 100% / 100%;
  gap: 8px;
  height: clamp(180px, 20vw, 250px);
  border: 1px solid rgb(158 158 158);
  border-radius: 8px;
}

.laundry-card .laundry-card-data {
  display: grid;
  grid: max-content 1fr / 100%;
  gap: 4px;
  padding: 8px;

  .title-container {
    display: flex;
    flex-wrap: nowrap;
    gap: 4px;
    align-items: center;
    overflow: hidden;

    .title {
      overflow: hidden;
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 2rem;
      text-overflow: ellipsis;
      letter-spacing: 0.0125em;
      white-space: nowrap;
    }
  }

  .symbols,
  .tags {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    padding-bottom: 6px;
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .tags {
    align-items: end;
  }

  .symbols li {
    display: flex;
    justify-content: center;
    cursor: help;
    border: 1px solid rgb(158 158 158);
    border-radius: 12px;
  }
}

.laundry-card > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 7px;
}

.laundry-card:has(> img) {
  grid-template-columns: 7fr 3fr;

  .laundry-card-data {
    padding: 8px 0 8px 8px;
  }
}

.laundry-card .laundry-card-data:has(> .title-container) {
  grid-template-rows: max-content max-content 1fr;
}
</style>
