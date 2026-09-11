<template>
  <ul class="modify-item-materials-list">
    <li v-for="material in materials" :key="material">
      <ModifyItemMaterialsListItem v-model="materialsPercents[material]" :disabled :material="material" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Item, ItemMaterial } from '@/types/item'
import { ref, watch } from 'vue'

import useItems from '@/composables/useItems'
import ModifyItemMaterialsListItem from './ModifyItemMaterialsListItem.vue'

defineProps<{ disabled: boolean }>()
const modelValue = defineModel<Item['materials']>({ default: () => [] })
const { materials } = useItems()
const materialsPercents = ref<Record<string, number>>(initMaterialsModels())
function initMaterialsModels() {
  const materialsRecord: Record<string, number> = {}
  for (const material of modelValue.value) {
    const [materialKey, percent] = material.split('-')
    materialsRecord[materialKey] = Number(percent)
  }
  for (const material of materials.value) {
    if (!materialsRecord[material])
      materialsRecord[material] = 0
  }
  return materialsRecord
}
watch(
  materialsPercents,
  () => {
    const newModel: Array<ItemMaterial> = []
    for (const material in materialsPercents.value) {
      if (!materialsPercents.value[material])
        continue
      newModel.push(`${material}-${materialsPercents.value[material]}`)
    }
    modelValue.value = newModel
  },
  { deep: true },
)
</script>

<style>
.modify-item-materials-list {
  display: grid;
  gap: 0.5rem;
}
</style>
