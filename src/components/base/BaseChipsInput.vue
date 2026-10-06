<template>
  <div
    class="base-chips-input"
    :class="{ 'base-chips-input--disabled': disabled }"
    @click="focusInput"
  >
    <input
      :id
      ref="inputElement"
      v-model.trim="model"
      :placeholder
      :type
      name="search-item"
      class="base-chips-input__input"
      :disabled
      :maxlength
      @keyup.enter="$emit('confirm', model)"
    >
    <button
      class="base-chips-input__button"
      :class="{ hidden: !model }"
      :disabled
      @click.stop="$emit('confirm', model)"
    >
      <IconCheck />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import IconCheck from '~icons/mdi/check'

interface Props {
  type?: string
  placeholder?: string
  disabled?: boolean
  maxlength?: number
  id?: string
}
withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  maxlength: 64,
})
defineEmits<{ confirm: [string] }>()
const model = defineModel<string>({ default: '' })

const inputRef = useTemplateRef('inputElement')
function focusInput() {
  inputRef.value?.focus()
}
</script>

<style>
.base-chips-input {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 0.5rem;
  align-items: center;
  height: 2rem;
  background-color: field;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  &:hover,
  &:focus,
  &:focus-within {
    border-color: var(--color-primary);
  }
  .base-chips-input__input {
    height: calc(2rem - 8px);
    margin: 0;
    outline: none;
    outline-color: transparent;
    background-color: transparent;
    border: none;
  }
  .base-chips-input__button {
    min-height: 2rem;
    padding-block: 0;
    padding-inline: 0.5rem;
  }
  &.base-chips-input--disabled {
    background-color: color-mix(in srgb, Field 60%, transparent 40%);
    &:hover,
    &:focus,
    &:focus-within {
      cursor: not-allowed;
      border-color: var(--color-border);
      .base-chips-input__input,
      .base-chips-input__button {
        cursor: not-allowed;
      }
    }
  }
}
</style>
