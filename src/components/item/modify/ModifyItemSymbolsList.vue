<template>
  <div class="modify-item-symbols-list">
    <div class="modify-item-symbols-list-group">
      <span>{{ $t(`symbolsGroup.${group}`) }}</span>
      <button class="icon-button" :disabled @click="showHint(group)">
        <IconHelp />
      </button>
    </div>
    <ul class="modify-item-symbols-list-list">
      <li v-for="symbol in symbolsByGroups.get(group)" :key="symbol.name">
        <ModifyItemSymbolsListItem
          :symbol="symbol"
          :styles="{
            selected: selectedSymbol === symbol.name,
            transparent: !!modelValue.length && !!selectedSymbol && !modelValue.includes(symbol.name),
          }"
          :disabled
          @click="onClickSymbol(symbol.name)"
        />
      </li>
    </ul>
    <BaseDialog v-if="isHintActive" v-model="isHintActive" size="small" :title="hintContent.title">
      {{ hintContent.message }}
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import type { Item, ItemSymbol } from '@/types/item'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconHelp from '~icons/mdi/help'
import BaseDialog from '@/components/base/BaseDialog.vue'
import useItems from '@/composables/useItems'
import ModifyItemSymbolsListItem from './ModifyItemSymbolsListItem.vue'

const { group } = defineProps<{ group: string, disabled: boolean }>()
const modelValue = defineModel<Item['materials']>({ required: true })
const { t, tm, rt } = useI18n()
const { symbols, symbolsByGroups } = useItems()
const selectedSymbol = ref<ItemSymbol['name'] | null>(getSelectedTag())

function getSelectedTag(): ItemSymbol['name'] | null {
  for (const symbol of modelValue.value) {
    if (symbols.value[symbol]?.group === group)
      return symbol
  }
  return null
}
function onClickSymbol(symbol: string) {
  const index = modelValue.value.indexOf(symbol)
  if (index !== -1) {
    modelValue.value.splice(index, 1)
    selectedSymbol.value = null
  }
  else {
    if (selectedSymbol.value) {
      const index = modelValue.value.indexOf(selectedSymbol.value)
      if (index !== -1) {
        modelValue.value.splice(index, 1)
      }
    }
    modelValue.value.push(symbol)
    selectedSymbol.value = symbol
  }
}

const isHintActive = ref<boolean>(false)
const hintContent = reactive({
  title: '',
  message: '',
})
function showHint(group: string) {
  isHintActive.value = true
  const messages: Array<string> = tm(`hints.${group}`)
  hintContent.title = t(`symbolsGroup.${group}`)
  hintContent.message = messages.map(message => `${rt(message)}.`).join('\n\n')
}
</script>

<style>
.modify-item-symbols-list {
  display: grid;
  gap: 0.25rem;
  .modify-item-symbols-list-group {
    display: flex;
    align-items: center;
    font-size: 1.125rem;
    font-weight: 600;
    text-transform: capitalize;
  }
  .modify-item-symbols-list-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    @media (width >= 576px) {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
  }
}
</style>
