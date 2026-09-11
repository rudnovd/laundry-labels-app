<template>
  <div class="base-popup" aria-describedby="popup">
    <div ref="popupTargetElement">
      <slot name="activator" />
    </div>
    <div v-if="isActive" ref="popupElement" class="base-popup__popup" role="popup">
      <slot />
      <div ref="arrowElement" class="base-popup__popup-arrow" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComputePositionConfig } from '@floating-ui/vue'
import { arrow, computePosition, flip, offset, shift } from '@floating-ui/vue'
import { unrefElement, whenever } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const props = withDefaults(defineProps<{ placement?: ComputePositionConfig['placement'] }>(), { placement: 'top' })
const isActive = defineModel<boolean>({ default: false })

const popupTargetRef = useTemplateRef<HTMLElement>('popupTargetElement')
const popupRef = useTemplateRef('popupElement')
const arrowRef = useTemplateRef('arrowElement')
async function updatePopup() {
  if (!popupTargetRef.value || !popupRef.value) {
    return
  }
  const popupElement = unrefElement(popupTargetRef.value)
  if (!popupElement) {
    return
  }
  const { x, y, placement, middlewareData } = await computePosition(popupElement, popupRef.value, {
    placement: props.placement,
    middleware: [
      offset(6),
      flip(),
      shift({ padding: 5 }),
      arrow({ element: arrowRef.value }),
    ],
  })
  Object.assign(popupRef.value.style, {
    left: `${x}px`,
    top: `${y}px`,
  })
  if (!arrowRef.value || !middlewareData.arrow) {
    return
  }
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  } as const
  const [side] = placement.split('-') as Array<keyof typeof staticSide>
  Object.assign(arrowRef.value.style, {
    left: `${middlewareData.arrow.x}px`,
    top: `${middlewareData.arrow.y}px`,
    right: '',
    bottom: '',
    [staticSide[side]]: '-4px',
  })
}
whenever(isActive, updatePopup)
</script>

<style>
.base-popup {
  .base-popup__popup {
    position: absolute;
    top: 0;
    left: 0;
    width: max-content;
    padding: 5px;
    font-size: 90%;
    font-weight: bold;
    color: white;
    background: #222;
    border-radius: 4px;
    .base-popup__popup-arrow {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #222;
      transform: rotate(45deg);
    }
  }
}
</style>
