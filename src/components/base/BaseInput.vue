<template>
  <div class="base-input">
    <label v-if="label" :for="id">{{ label }}</label>
    <input v-bind="$attrs" :id v-model.trim="model" :disabled class="base-input__input" :type :maxlength :minlength>
    <span v-if="errors?.length" class="color-error">{{ errors[0] }}</span>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  label?: string
  type?: string
  minlength?: string
  maxlength?: string
  disabled?: boolean
  errors?: string[]
}
defineOptions({ inheritAttrs: false })
withDefaults(defineProps<Props>(), {
  type: 'text',
})
const model = defineModel<string | null>({ default: '' })
const id = useId()
</script>

<style>
.base-input {
  .base-input__input {
    outline-color: var(--color-primary);
    border-color: var(--color-border);
    border-style: solid;
    border-radius: 4px;
    transition: border-color 0.15s;
    &:hover,
    &:focus,
    &:focus-within {
      border-color: var(--color-primary);
    }
    &.error {
      border-color: var(--color-error);
    }
    &.valid {
      border-color: var(--color-success);
    }
  }
}
</style>
