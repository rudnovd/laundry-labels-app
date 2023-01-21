<template>
  <q-select
    :model-value="modelValue"
    class="q-mb-md"
    outlined
    clearable
    label="Item tags"
    use-input
    multiple
    hide-dropdown-icon
    new-value-mode="add-unique"
    :placeholder="!modelValue.length ? 'Input or select tags from list' : ''"
    :max-values="10"
    :options="standardTags"
    use-chips
    autocomplete="off"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: Array<string>
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])

const standardTags = [
  'black',
  'white',
  'red',
  'yellow',
  'green',
  'jeans',
  't-shirt',
  'dress',
  'sweater',
  'shorts',
  'skirts',
]
</script>
