<template>
  <div class="laundry-card" @click="router.push({ name: 'Item', params: { id: item.id } })">
    <div class="laundry-card-data">
      <div v-if="item.name || item.id.includes('offline-')" class="title-container">
        <q-icon v-if="item.id.includes('offline-')" name="cloud_off" title="offline item" />
        <span class="title">{{ item.name }}</span>
      </div>

      <ul class="symbols">
        <li v-for="symbol in item.symbols" :key="symbol" @click.stop>
          <img
            :src="`/icons/laundry/${symbols[symbol].group}/${symbol}.svg`"
            height="48px"
            width="48px"
            :alt="`${symbol.split('-').join(' ')} icon`"
          />
          <q-tooltip anchor="top middle" :offset="[0, 48]">
            {{ symbols[symbol].description }}
          </q-tooltip>
        </li>
      </ul>

      <ul v-if="item.materials.size" class="materials">
        <li v-for="material in item.materials" :key="material">
          <item-material :value="material" />
        </li>
      </ul>

      <ul v-if="item.tags.size" class="tags">
        <li v-for="tag in item.tags" :key="tag">
          <item-tag>{{ tag }}</item-tag>
        </li>
      </ul>
    </div>
    <item-photo v-for="photo in item.photos" :key="photo" :path="photo" :alt="`${item.name} photo` ?? 'item photo'" />
  </div>
</template>

<script setup lang="ts">
import useItems from '@/composables/useItems'
import { type Item } from '@/types/item'
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
const ItemTag = defineAsyncComponent(() => import('@/components/item/tags/ItemTag.vue'))
const ItemPhoto = defineAsyncComponent(() => import('@/components/item/ItemPhoto.vue'))
const ItemMaterial = defineAsyncComponent(() => import('@/components/item/materials/ItemMaterial.vue'))

defineProps<{ item: Item }>()

const router = useRouter()
const { symbols } = useItems()
</script>

<style>
.laundry-card {
  display: grid;
  grid: 100% / 100%;
  gap: 8px;
  height: clamp(200px, 22vw, 250px);
  border: 1px solid rgb(158 158 158);
  border-radius: 8px;
}

.laundry-card > img {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-wrap: break-word;
  object-fit: cover;
  border-radius: 7px;
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
  .tags,
  .materials {
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

  .symbols {
    li {
      display: flex;
      justify-content: center;
      cursor: help;
      border: 1px solid rgb(158 158 158);
      border-radius: 12px;

      img {
        pointer-events: none;
      }
    }
  }
}

.laundry-card:has(> img) {
  grid-template-columns: 7fr 3fr;

  .laundry-card-data {
    padding: 8px 0 8px 8px;
  }
}

.laundry-card .laundry-card-data:has(> .title-container):has(> .symbols):has(> .tags) {
  grid-template-rows: repeat(3, max-content) 1fr;
}
</style>
