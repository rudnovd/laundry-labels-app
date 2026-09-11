<template>
  <component :is="element" v-wave class="item-tag" :class="[{ selected, disabled }]">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  selected?: boolean
  disabled?: boolean
  element?: string
}
withDefaults(defineProps<Props>(), {
  selected: false,
  disabled: false,
  element: 'button',
})
</script>

<style>
.item-tag {
  position: relative;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  height: 2em;
  min-height: 2em;
  padding: 8px 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text);
  text-transform: lowercase;
  white-space: nowrap;
  cursor: pointer;
  outline: 0;
  background: var(--color-background);
  border: 1px solid var(--color-text);
  border-radius: 4px;
  &.selected {
    font-weight: 600;
    background-color: var(--color-primary);
    transition: background-color 0.25s;
  }
}
</style>
