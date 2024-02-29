<template>
  <div class="laundry-symbols-group">
    <span class="group-name">{{ t(`symbolsGroup.${group}`) }}</span>
    <ul class="group-symbols-grid">
      <li v-for="symbol in symbolsByGroups.get(group)" :key="symbol.name">
        <laundry-symbol-button
          :symbol="symbol"
          :styles="{
            selected: selectedSymbol === symbol.name,
            transparent: !!modelValue.length && !!selectedSymbol && !modelValue.includes(symbol.name),
          }"
          @click="onClickSymbol(symbol.name)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useItems from '@/composables/useItems'
import type { ItemSymbol } from '@/types/item'
import LaundrySymbolButton from '@/components/item/symbols/LaundrySymbolButton.vue'

const { group } = defineProps<{ group: string }>()
const modelValue = defineModel<Array<string>>({ required: true })
const { t } = useI18n()
const { symbols, symbolsByGroups } = useItems()
const selectedSymbol = ref<ItemSymbol['name'] | null>(
  modelValue.value.find((symbol) => symbols.value[symbol]?.group === group) ?? null,
)

function onClickSymbol(symbol: string) {
  if (modelValue.value.includes(symbol)) {
    modelValue.value = modelValue.value.filter((name) => name !== symbol)
    selectedSymbol.value = null
  } else {
    if (selectedSymbol.value) {
      modelValue.value.splice(modelValue.value.indexOf(selectedSymbol.value), 1)
    }
    modelValue.value.push(symbol)
    selectedSymbol.value = symbol
  }
}
</script>

<style>
.laundry-symbols-group {
  display: grid;
  gap: 0.25rem;

  .group-name {
    font-size: 1.125rem;
    font-weight: 500;
    text-align: center;
    text-transform: capitalize;
  }

  .group-symbols-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;

    @media (width >= 576px) {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
  }
}
</style>
