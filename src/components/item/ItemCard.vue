<template>
  <div class="item-card" @click="router.push(`/items/${item.id}`)">
    <div class="item-card__data">
      <div v-if="item.name || item.id.includes('offline-')" class="title-container">
        <IconCloudOffOutline v-if="item.id.includes('offline-')" title="offline item" />
        <span class="title">{{ item.name }}</span>
      </div>
      <ul class="symbols-list">
        <li v-for="symbol in item.symbols" :key="symbol" class="symbols-list__item">
          <ItemSymbol
            v-if="symbols[symbol]?.group"
            :group="symbols[symbol].group"
            :symbol
            :tooltip-text="symbols[symbol].description"
          />
        </li>
      </ul>
      <ul v-if="item.materials.length" class="materials-list">
        <li v-for="material in item.materials" :key="material" class="materials-list__item">
          <ItemMaterial :material />
        </li>
      </ul>
      <ul v-if="item.tags.length" class="tags-list">
        <li v-for="tag in item.tags" :key="tag" class="tags-list__item">
          <ItemTag>{{ tag }}</ItemTag>
        </li>
      </ul>
    </div>
    <ItemPhoto
      v-for="photo in item.photos"
      :key="photo"
      class="item-card__img"
      :path="photo"
      :alt="`${item.name} photo`"
    />
  </div>
</template>

<script setup lang="ts">
import type { Item } from '@/types/item'
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import ItemMaterial from '@/components/item/ItemMaterial.vue'
import ItemPhoto from '@/components/item/ItemPhoto.vue'
import ItemSymbol from '@/components/item/ItemSymbol.vue'
import ItemTag from '@/components/item/ItemTag.vue'
import useItems from '@/composables/useItems'

defineProps<{ item: Item }>()
const IconCloudOffOutline = defineAsyncComponent(() => import('~icons/mdi/cloud-off-outline'))

const router = useRouter()
const { symbols } = useItems()
</script>

<style>
.item-card {
  display: grid;
  grid: 100% / 100%;
  gap: 8px;
  height: clamp(200px, 22vw, 250px);
  border: 1px solid rgb(158 158 158);
  border-radius: 4px;
  .item-card__data {
    display: grid;
    grid: repeat(3, max-content) 1fr / 100%;
    grid-template-areas:
      'title'
      'symbols'
      'materials'
      'tags';
    gap: 4px;
    padding: 8px;
    .title-container {
      display: flex;
      flex-wrap: nowrap;
      gap: 4px;
      align-items: center;
      overflow: hidden;
      .title {
        grid-area: title;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1.25rem;
        font-weight: 500;
        line-height: 2rem;
        letter-spacing: 0.0125em;
        white-space: nowrap;
      }
    }
    .symbols-list,
    .tags-list,
    .materials-list {
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
      padding-bottom: 6px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .symbols-list {
      grid-area: symbols;
      .symbols-list__item {
        display: flex;
        justify-content: center;
        cursor: help;
        background: var(--color-surface-background);
        border: 1px solid rgb(158 158 158);
        border-radius: 4px;
        .symbols-list__item-img {
          pointer-events: none;
        }
      }
    }
    .materials {
      grid-area: materials;
    }
    .tags {
      grid-area: tags;
      align-items: end;
    }
  }
  .item-card__img {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-wrap: break-word;
    object-fit: cover;
    border-radius: 4px;
  }
}
.item-card:has(> img) {
  grid-template-columns: 7fr 3fr;
  .item-card-data {
    padding: 8px 0 8px 8px;
  }
}
</style>
