<template>
  <button v-wave class="laundry-symbol-button" :disabled :class="[styles]">
    <div class="laundry-symbol-button__icon">
      <component
        :is="symbolComponent"
        class="laundry-symbol-icon"
        width="64px"
        :alt="`${symbol.name.split('-').join(' ')} icon`"
      />
    </div>
    <span>{{ symbol.description }}</span>
  </button>
</template>

<script setup lang="ts">
import type { ItemSymbol } from '@/types/item'
import { defineAsyncComponent } from 'vue'
import useItems from '@/composables/useItems'

interface Props {
  symbol: ItemSymbol
  disabled?: boolean
  styles?: {
    selected?: boolean
    transparent?: boolean
  }
}
const props = defineProps<Props>()
const { symbols } = useItems()
const symbolComponent = defineAsyncComponent(() => {
  return import(`../../../assets/icons/laundry/${symbols.value[props.symbol.name].group}/${props.symbol.name}.svg`)
})
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
  border-radius: 4px;
  opacity: 1;
  transition:
    font-weight 0.25s linear,
    opacity 0.25s linear,
    border-color 0.25s linear,
    background-color 0.25s linear;
  &.selected {
    font-weight: 500;
    background-color: var(--color-primary);
    border-color: var(--color-primary-active);
  }
  &.transparent {
    opacity: 0.3;
  }
  laundry-symbol-button__icon {
    display: flex;
    align-items: center;
  }
  & > span {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    line-height: 1.3;
    text-wrap: pretty;
    overflow-wrap: break-word;
    -webkit-box-orient: vertical;
  }
}
</style>
