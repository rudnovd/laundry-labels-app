<template>
  <button v-wave class="item-material">
    {{ Number(percent) ?? 100 }}% {{ materialName }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ material: string }>()
const [materialName, percent] = props.material.split('-')
</script>

<style>
.item-material {
  position: relative;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  height: 2em;
  min-height: 2em;
  padding: 0.2em 0.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text);
  white-space: nowrap;
  outline: 0;
  background: var(--color-background);
  border: 1px dashed var(--color-text);
  border-radius: 4px;
}
</style>
