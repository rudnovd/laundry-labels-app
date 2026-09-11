<template>
  <label class="base-toggle" :class="{ 'base-toggle--disabled': disabled }">
    <input
      v-model="model"
      type="checkbox"
      :checked="model"
      :disabled="disabled"
      class="base-toggle__input"
    >
    <div class="base-toggle__track">
      <span class="base-toggle__thumb" />
    </div>
    <span v-if="label" class="base-toggle__label-text">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
  label?: string
}
withDefaults(defineProps<Props>(), {
  disabled: false,
  label: '',
})
const model = defineModel<boolean>({ default: false })
</script>

<style>
.base-toggle {
  display: inline-flex;
  -webkit-tap-highlight-color: transparent;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  user-select: none;
  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .base-toggle__input {
    position: absolute;
    display: none;
    appearance: none;
  }
  .base-toggle__track {
    position: relative;
    width: 44px;
    height: 24px;
    background: field;
    border: 1px solid var(--color-text);
    border-radius: 999px;
    transition: background 0.2s ease;
  }
  .base-toggle__thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: var(--color-text);
    border-radius: 50%;
    box-shadow: 0 1px 3px rgb(0 0 0 / 25%);
    transition: transform 0.2s ease;
  }
  .base-toggle__input:checked + .base-toggle__track {
    background: var(--color-primary);
  }
  .base-toggle__input:checked + .base-toggle__track .base-toggle__thumb {
    transform: translateX(20px);
  }
  .base-toggle__input:focus-visible + .base-toggle__track {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  .base-toggle__label-text {
    font-size: 14px;
  }
}
</style>
