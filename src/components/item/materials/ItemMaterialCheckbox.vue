<template>
  <div class="select-item-material">
    <q-checkbox v-model="isSelected" :label="material" color="brand" @update:model-value="onCheck" />
    <q-slider
      v-if="isSelected"
      v-model="modelValue"
      :min="5"
      :max="100"
      :step="5"
      color="brand"
      track-size="8px"
      thumb-color="black"
      markers
      @update:model-value="isEditing = false"
    />
    <div v-if="isSelected" class="progress-values">
      5
      <div class="current-progress">
        <span v-if="!isEditing">{{ modelValue }}%</span>
        <input v-else :value="modelValue" :min="1" :max="100" type="number" @input="onInputPercent" />
        <q-btn
          size="sm"
          padding="0"
          flat
          color="primary"
          :icon="!isEditing ? 'edit' : 'check'"
          @click="isEditing = !isEditing"
        />
      </div>
      100
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ material: string }>()
const modelValue = defineModel<number>({ default: 0 })

const isSelected = ref(modelValue.value > 0)
const isEditing = ref(false)
function onInputPercent(event: Event) {
  if (!event.target) return
  const input = event.target as HTMLInputElement
  let number = Number(input.value)
  if (number < 1) number = 1
  else if (number > 100) number = 100
  modelValue.value = number
  input.value = number.toString()
}
function onCheck(isEnabled: boolean) {
  modelValue.value = isEnabled ? 50 : 0
  isEditing.value = false
}
</script>

<style>
.select-item-material {
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
