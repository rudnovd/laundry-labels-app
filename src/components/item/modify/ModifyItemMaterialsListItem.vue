<template>
  <div class="modify-item-materials-list-item">
    <div class="modify-item-materials-list-item__input">
      <input
        :id="`material-${material}`"
        v-model="isSelected"
        :name="`material-${material}`"
        :disabled
        type="checkbox"
        @update:model-value="onCheck"
      >
      <label :for="`material-${material}`">{{ material }}</label>
    </div>
    <input
      v-if="isSelected"
      v-model.number="modelValue"
      :disabled
      type="range"
      :min="5"
      :max="100"
      :step="5"
      @update:model-value="isEditing = false"
    >
    <div v-if="isSelected" class="progress-values">
      5
      <div class="current-progress">
        <span v-if="!isEditing">{{ modelValue }}%</span>
        <input
          v-else
          ref="inputRef"
          :disabled
          :value="modelValue"
          :min="1"
          :max="100"
          type="number"
          @input="onInputPercent"
          @keyup.enter="isEditing = false"
        >
        <button class="icon-button" :disabled @click="isEditing = !isEditing">
          <IconCheck v-if="isEditing" />
          <IconPencil v-else />
        </button>
      </div>
      100
    </div>
  </div>
</template>

<script setup lang="ts">
import { whenever } from '@vueuse/core'
import { nextTick, ref } from 'vue'
import IconCheck from '~icons/mdi/check'
import IconPencil from '~icons/mdi/pencil'

defineProps<{ material: string, disabled: boolean }>()
const modelValue = defineModel<number>({ default: 0 })

const isSelected = ref(modelValue.value > 0)
const inputRef = ref<HTMLInputElement | null>(null)
const isEditing = ref(false)
whenever(isEditing, () => nextTick(() => inputRef.value?.focus()))
function onInputPercent(event: Event) {
  if (!event.target)
    return
  const input = event.target as HTMLInputElement
  let number = Number(input.value)
  if (number < 1) {
    number = 0
  }
  else if (number > 100) {
    number = 100
  }
  modelValue.value = number
  input.value = number ? number.toString() : ''
}
function onCheck(isEnabled: boolean) {
  modelValue.value = isEnabled ? 50 : 0
  isEditing.value = false
}
</script>

<style>
.modify-item-materials-list-item {
  display: grid;
  .modify-item-materials-list-item__input {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    input {
      width: 1rem;
      height: 1rem;
    }
  }
  .progress-values {
    display: flex;
    justify-content: space-between;
    .current-progress {
      display: flex;
      gap: 2px;
      align-items: center;
      input {
        height: 1em;
      }
    }
  }
}
</style>
