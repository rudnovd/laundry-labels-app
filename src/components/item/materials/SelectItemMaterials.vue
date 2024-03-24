<template>
  <ul class="item-materials-container">
    <li v-for="material in materials" :key="material">
      <item-material-checkbox v-model="materialsPercents[material]" :material="material" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { defineModel, ref } from 'vue'
import useItems from '@/composables/useItems'
import ItemMaterialCheckbox from '@/components/item/materials/ItemMaterialCheckbox.vue'
import { watch } from 'vue'

const modelValue = defineModel<Set<string>>({ default: new Set() })
const { materials } = useItems()
const materialsPercents = ref<Record<string, number>>(initMaterialsModels())

function initMaterialsModels() {
  const materialsRecord: Record<string, number> = {}
  for (const material of modelValue.value) {
    const [materialKey, percent] = material.split('-')
    materialsRecord[materialKey] = Number(percent)
  }
  for (const material of materials.value) {
    if (!materialsRecord[material]) materialsRecord[material] = 0
  }
  return materialsRecord
}

watch(
  materialsPercents,
  () => {
    modelValue.value.clear()
    for (const material in materialsPercents.value) {
      if (!materialsPercents.value[material]) continue
      modelValue.value.add(`${material}-${materialsPercents.value[material]}`)
    }
  },
  { deep: true },
)
</script>
