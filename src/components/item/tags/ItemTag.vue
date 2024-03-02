<template>
  <button v-ripple :class="['item-tag', { selected, disabled }]">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    selected?: boolean
    disabled?: boolean
  }>(),
  {
    selected: false,
    disabled: false,
  },
)
</script>

<style>
.item-tag {
  position: relative;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  height: 2em;
  padding: 0.5em 0.9em;
  overflow: hidden;
  color: rgb(0 0 0 / 87%);
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  background: rgb(224 224 224);
  border: none;
  border-radius: 16px;
  outline: 0;

  &.selected {
    font-weight: 600;
    background-color: var(--color-brand);
    transition: background-color 0.25s;
  }
}
</style>
