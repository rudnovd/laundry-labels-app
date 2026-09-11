<template>
  <button v-wave class="base-chip" :class="[{ selected, disabled }]">
    <slot />
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
.base-chip {
  position: relative;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  height: 2em;
  min-height: 2em;
  padding: 0.5em 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text);
  white-space: nowrap;
  cursor: pointer;
  outline: 0;
  background: var(--color-background);
  border: 1px solid var(--color-text);
  border-radius: 4px;
  transition: background-color 0.25s;
  &.selected {
    font-weight: 600;
    background-color: var(--color-primary);
  }
  &.disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
