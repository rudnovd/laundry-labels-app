<template>
  <div class="item-material">{{ parsedMaterial.percent }}% {{ parsedMaterial.material }}</div>
</template>

<script setup lang="ts">
import type { ItemMaterial } from '@/types/item'
import { computed } from 'vue'

const props = defineProps<{
  value: ItemMaterial
}>()
const parsedMaterial = computed(() => {
  const [material, percent] = props.value.split('-')
  return { material, percent: Number(percent) ?? 100 }
})
</script>

<style>
.item-material {
  position: relative;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  height: 2em;
  padding: 0.2em 0.5em;
  overflow: hidden;
  color: rgb(0 0 0 / 87%);
  text-overflow: ellipsis;
  white-space: nowrap;
  background: rgb(224 224 224);
  border: none;
  outline: 0;
}
</style>
