<template>
  <section class="item-page">
    <div v-if="isLoading">
      {{ $t('common.loading') }}...
    </div>
    <div v-else-if="!isLoading && currentItem" class="item-data">
      <div v-if="currentItem.photos.length" class="item-data__photo">
        <ItemPhoto v-for="photo of currentItem.photos" :key="photo" :path="photo" />
      </div>
      <h2 v-if="currentItem.name" class="item-data__title">
        {{ currentItem.name }}
      </h2>
      <ul class="item-data__symbols-list">
        <li v-for="symbol in currentItem.symbols" :key="symbol">
          <ModifyItemSymbolsListItem :symbol="{ ...symbols[symbol], name: symbol }" />
        </li>
      </ul>
      <ul class="item-data__materials-list">
        <li v-for="material of currentItem.materials" :key="material">
          <ItemMaterial :material />
        </li>
      </ul>
      <ul v-if="currentItem.tags.length" class="item-data__tags-list">
        <li v-for="tag in currentItem.tags" :key="tag">
          <ItemTag>{{ tag }}</ItemTag>
        </li>
      </ul>
      <ItemActions :item="currentItem" />
    </div>
    <div v-else class="item-not-found-container">
      <div>{{ $t('pages.item.itemNotFound') }}</div>
      <router-link class="button-link button-primary" to="/items">
        {{ $t('pages.item.backToItems') }}
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Item } from '@/types/item'
import { defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import ItemActions from '@/components/item/ItemActions.vue'
import ModifyItemSymbolsListItem from '@/components/item/modify/ModifyItemSymbolsListItem.vue'
import useItems from '@/composables/useItems'

const ItemPhoto = defineAsyncComponent(() => import('@/components/item/ItemPhoto.vue'))
const ItemTag = defineAsyncComponent(() => import('@/components/item/ItemTag.vue'))
const ItemMaterial = defineAsyncComponent(() => import('@/components/item/ItemMaterial.vue'))

const route = useRoute('/items/[id]')
const { items, getItemById, symbols } = useItems()
const isLoading = ref(false)
const currentItem = ref<Item | null>(null)
onBeforeMount(async () => {
  const item = items.value.find(({ id }) => id === route.params.id)
  if (item) {
    currentItem.value = item
    return
  }
  isLoading.value = true
  try {
    currentItem.value = await getItemById(route.params.id)
  }
  finally {
    isLoading.value = false
  }
})
</script>

<style>
.item-page {
  width: 100%;
  max-width: 1280px;
  margin: auto;
  .item-data {
    display: grid;
    gap: 1rem;
    .item-data__photo {
      display: flex;
      justify-content: center;
      img {
        max-width: 100%;
      }
    }
    .item-data__title {
      display: -webkit-box;
      margin: 0;
      overflow: hidden;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      line-clamp: 5;
      font-size: 3rem;
      line-height: 3rem;
    }
    .item-data__tags-list,
    .item-data__materials-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .item-data__symbols-list {
      display: grid;
      gap: 1rem;
      @media (width >= 576px) {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }
  }
  .item-not-found-container {
    display: grid;
    gap: 0.5rem;
    justify-items: center;
    font-size: 2rem;
    font-weight: bold;
  }
}
</style>
