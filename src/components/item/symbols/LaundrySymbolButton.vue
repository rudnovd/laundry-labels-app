<template>
  <button v-ripple :class="['laundry-symbol-button', styles]">
    <img
      :src="`/icons/laundry/${symbol.group}/${symbol.name}.svg`"
      height="64px"
      width="64px"
      :alt="`${symbol.name.split('-').join(' ')} icon`"
    />
    <span>{{ symbol.description }}</span>
  </button>
</template>

<script setup lang="ts">
import type { ItemSymbol } from '@/types/item'

defineProps<{
  symbol: ItemSymbol
  styles?: {
    selected?: boolean
    transparent?: boolean
  }
}>()
</script>

<style>
.laundry-symbol-button {
  position: relative;
  display: grid;
  grid: calc(4em * 1.3) / 64px 1fr;
  gap: 0.25rem;
  align-items: center;
  width: 100%;
  padding: 0.25rem;
  font-weight: 400;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 1px solid rgb(224 224 224);
  border-radius: 8px;
  opacity: 1;
  transition:
    font-weight 0.25s linear,
    opacity 0.25s linear,
    border-color 0.25s linear,
    background-color 0.25s linear;

  &.selected {
    font-weight: 500;
    background-color: rgba(224 224 224);
    border-color: rgb(97 97 97);
  }

  &.transparent {
    opacity: 0.3;
  }

  & > span {
    display: -webkit-box;
    overflow: hidden;
    line-height: 1.3;
    text-overflow: ellipsis;
    text-wrap: balance;
    overflow-wrap: break-word;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
}
</style>
