<template>
  <button v-ripple class="l-chip" :class="[{ selected, disabled }]">
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
.l-chip {
  position: relative;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  height: 2em;
  padding: 0.5em 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(0 0 0 / 87%);
  white-space: nowrap;
  cursor: pointer;
  outline: 0;
  background: rgb(224 224 224);
  border: none;
  border-radius: 16px;

  &.selected {
    font-weight: 600;
    background-color: var(--color-brand);
    transition: background-color 0.25s;
  }

  &.disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
