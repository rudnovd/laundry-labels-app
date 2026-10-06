<template>
  <div
    ref="tooltipTargetElement"
    aria-describedby="tooltip"
    class="base-tooltip-activator"
    v-bind="$attrs"
    @pointerenter="showTooltip"
    @pointerleave="hideTooltip"
    @focus="showTooltip"
    @blur="hideTooltip"
    @contextmenu.prevent
  >
    <slot name="activator" />
  </div>
  <Teleport :to="teleport" defer>
    <div v-show="!disabled && isTooltipVisible" ref="tooltipElement" class="base-tooltip-tooltip" role="tooltip">
      <slot />
      <div ref="arrowElement" class="base-tooltip-tooltip__arrow" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ComputePositionConfig } from '@floating-ui/vue'
import { arrow, computePosition, flip, offset, shift } from '@floating-ui/vue'
import { unrefElement } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

interface Props {
  placement?: ComputePositionConfig['placement']
  disabled?: boolean
  teleport?: string
}
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<Props>(), { placement: 'top', disabled: false, teleport: 'body' })

const tooltipTargetRef = useTemplateRef<HTMLElement>('tooltipTargetElement')
const tooltipRef = useTemplateRef('tooltipElement')
const arrowRef = useTemplateRef('arrowElement')
async function updateTooltip() {
  if (!tooltipTargetRef.value || !tooltipRef.value) {
    return
  }
  const tooltipElement = unrefElement(tooltipTargetRef.value)
  if (!tooltipElement) {
    return
  }
  const { x, y, placement, middlewareData } = await computePosition(tooltipElement, tooltipRef.value, {
    placement: props.placement,
    middleware: [
      offset(6),
      flip(),
      shift({ padding: 5 }),
      arrow({ element: arrowRef.value }),
    ],
  })
  Object.assign(tooltipRef.value.style, {
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
const isTooltipVisible = ref<boolean>(false)
function showTooltip() {
  if (props.disabled) {
    return
  }
  isTooltipVisible.value = true
  updateTooltip()
}
function hideTooltip() {
  isTooltipVisible.value = false
}
</script>

<style>
.base-tooltip-activator {
  display: inline-grid;
  user-select: none;
}
.base-tooltip-tooltip {
  position: absolute;
  top: 0;
  left: 0;
  width: max-content;
  max-width: calc(100vw - 16px);
  padding: 8px;
  font-weight: 600;
  color: oklch(94% 0.01 245deg);
  user-select: none;
  background: oklch(17.73% 0.0089 264.32deg);
  border: 1px solid oklch(31% 0.022 250deg);
  border-radius: 4px;
  .base-tooltip-tooltip-arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: oklch(17.73% 0.0089 264.32deg);
    transform: rotate(45deg);
  }
}
</style>
