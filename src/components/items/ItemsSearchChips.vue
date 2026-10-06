<template>
  <ul class="items-page__query-tags">
    <li>
      <BaseChip @click="resetFilters">
        <IconDelete size="1em" />
        {{ $t('common.clear') }}
      </BaseChip>
    </li>
    <ul v-for="(record, recordKey) in model" :key="recordKey">
      <li v-for="recordElement in record" :key="recordElement">
        <div class="base-chip">
          <button class="icon-button" @click="deleteQuery(recordKey, recordElement)">
            <IconClose size="1em" />
          </button>
          <span class="ellipsis">
            {{ searchElementTitle(recordKey) }}: {{ searchElementValue(recordKey, recordElement) }}
          </span>
        </div>
      </li>
    </ul>
  </ul>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import useItems from '@/composables/useItems'

const BaseChip = defineAsyncComponent(() => import('@/components/base/BaseChip.vue'))
const IconDelete = defineAsyncComponent(() => import('~icons/mdi/delete'))
const IconClose = defineAsyncComponent(() => import('~icons/mdi/close'))

const model = defineModel<Record<string, Array<string>>>({ required: true })

const { t } = useI18n()
function searchElementTitle(recordKey: string) {
  return t(`common.${recordKey}`).toLowerCase()
}
const { symbols } = useItems()
function searchElementValue(recordKey: string, recordElement: string) {
  let value: string = ''
  if (recordKey === 'symbols') {
    value = symbols.value[recordElement].short
  }
  else {
    value = recordElement
  }
  return value.toLowerCase()
}
function deleteQuery(key: string, value: string) {
  model.value[key] = model.value[key].filter(queryItem => queryItem !== value)
  if (!model.value[key].length) {
    delete model.value[key]
  }
}
function resetFilters() {
  for (const key in model.value) {
    delete model.value[key]
  }
}
</script>
