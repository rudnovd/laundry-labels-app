<template>
  <button v-ripple class="item-material">{{ Number(percent) ?? 100 }}% {{ materialName }}</button>
</template>

<script setup lang="ts">
import type { ItemMaterial } from '@/types/item'

const props = defineProps<{
  material: ItemMaterial
}>()
const [materialName, percent] = props.material.split('-')
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
  border-radius: 16px;
  outline: 0;
}
</style>
