<template>
  <q-select
    ref="select"
    :model-value="modelValue"
    class="q-mb-md"
    outlined
    label="Item tags"
    use-input
    multiple
    new-value-mode="add-unique"
    placeholder="Input or select tag from list"
    :max-values="10"
    :options="standardTags"
    use-chips
    autocomplete="off"
    @update:model-value="onUpdateModelValue"
    @input-value="onInputValue"
  >
    <template #append>
      <q-btn v-show="showAddValueButton" round color="positive" size="xs" icon="check" @click="onAddTag" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    modelValue: Array<string>
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])

const select = ref()
const showAddValueButton = ref(false)
const inputValue = ref('')

const onUpdateModelValue = (value: Array<string>) => {
  if (!value[value.length - 1].trim()) {
    if (showAddValueButton.value) {
      showAddValueButton.value = false
    }
    return
  }

  if (showAddValueButton.value) {
    showAddValueButton.value = false
    select.value.updateInputValue('')
    inputValue.value = ''
  }

  value[value.length - 1] = value[value.length - 1].trim()
  emit('update:modelValue', value)
}

const onInputValue = (value: string) => {
  inputValue.value = value
  if (!showAddValueButton.value) {
    showAddValueButton.value = true
  }
}

const onAddTag = () => {
  if (!inputValue.value) {
    return
  }

  select.value.add(inputValue.value.trim(), true)
  select.value.updateInputValue('')
  inputValue.value = ''
  showAddValueButton.value = false
}

const standardTags = [
  'black',
  'blue',
  'brown',
  'green',
  'grey',
  'orange',
  'pink',
  'purple',
  'red',
  'white',
  'yellow',
  'boots',
  'cap',
  'coat',
  'dress',
  'frock',
  'fur coat',
  'gloves',
  'jacket',
  'jeans',
  'jumper',
  'leggings',
  'overalls',
  'pyjamas',
  'pants',
  'scarf',
  'shirt',
  'shoes',
  'skirt',
  'socks',
  'suit',
  'sweater',
  't-shirt',
  'underwear',
]
</script>
