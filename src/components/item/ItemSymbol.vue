<template>
  <BaseTooltip v-if="tooltipText">
    <template #activator>
      <component :is="symbolComponent" class="item-symbol" width="48px" height="48px" @contextmenu.prevent @click.stop />
    </template>
    {{ tooltipText }}
  </BaseTooltip>
  <component :is="symbolComponent" v-else width="48px" height="48px" class="item-symbol" @contextmenu.prevent @click.stop />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import BaseTooltip from '@/components/base/BaseTooltip.vue'

interface Props {
  group: string
  symbol: string
  tooltipText?: string
}
const props = defineProps<Props>()
const symbolComponent = defineAsyncComponent(() => import(`../../assets/icons/laundry/${props.group}/${props.symbol}.svg`))
</script>

<style>
.item-symbol {
  user-select: none;
}
</style>
