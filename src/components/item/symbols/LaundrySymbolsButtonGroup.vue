<template>
  <div class="laundry-symbols-group">
    <div class="group-name">
      <span>{{ t(`symbolsGroup.${group}`) }}</span>
      <q-btn icon="help" flat round dense size="12px" @click="showHint(group)" />
    </div>
    <ul class="group-symbols-grid">
      <li v-for="symbol in symbolsByGroups.get(group)" :key="symbol.name">
        <laundry-symbol-button
          :symbol="symbol"
          :styles="{
            selected: selectedSymbol === symbol.name,
            transparent: !!modelValue.size && !!selectedSymbol && !modelValue.has(symbol.name),
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
import { useQuasar } from 'quasar'

const { group } = defineProps<{ group: string }>()
const modelValue = defineModel<Set<string>>({ required: true })
const { dialog } = useQuasar()
const { t, tm, rt } = useI18n()
const { symbols, symbolsByGroups } = useItems()
const selectedSymbol = ref<ItemSymbol['name'] | null>(getSelectedTag())

function getSelectedTag(): ItemSymbol['name'] | null {
  for (const symbol of modelValue.value) {
    if (symbols.value[symbol]?.group === group) return symbol
  }
  return null
}

function onClickSymbol(symbol: string) {
  if (modelValue.value.has(symbol)) {
    modelValue.value.delete(symbol)
    selectedSymbol.value = null
  } else {
    if (selectedSymbol.value) {
      modelValue.value.delete(selectedSymbol.value)
    }
    modelValue.value.add(symbol)
    selectedSymbol.value = symbol
  }
}

function showHint(group: string) {
  const messages: Array<string> = tm(`hints.${group}`)
  dialog({
    title: t(`symbolsGroup.${group}`),
    message: messages.map((message) => `${rt(message)}.`).join('\n\n'),
    ok: false,
    style: {
      whiteSpace: 'pre-line',
    },
  })
}
</script>

<style>
.laundry-symbols-group {
  display: grid;
  gap: 0.25rem;

  .group-name {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
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
