<template>
  <dialog
    v-bind="$attrs"
    ref="dialogElement"
    class="base-dialog"
    :class="[`size--${size}`, { fullscreen }]"
    @close="close"
    @cancel="cancel"
  >
    <header v-if="title && closable" class="base-dialog__header">
      <slot name="header">
        <h2 v-if="title">
          {{ title }}
        </h2>
      </slot>
      <button
        v-if="title && closable"
        type="button"
        class="base-dialog__close-button"
        @click="close"
      >
        <IconClose />
      </button>
    </header>
    <div class="base-dialog__content">
      <button
        v-if="closable && !title"
        type="button"
        class="base-dialog__close-button"
        @click="close"
      >
        <IconClose />
      </button>
      <slot />
    </div>
    <footer v-if="$slots.footer" class="base-dialog__footer">
      <slot name="footer" />
    </footer>
  </dialog>
</template>

<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'
import IconClose from '~icons/mdi/close'

interface Props {
  title?: string
  closable?: boolean
  size?: 'small' | 'medium' | 'large'
  fullscreen?: boolean
  loading?: boolean
}
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<Props>(), { title: '', closable: true, fullscreen: false, size: 'medium', loading: false })
const emit = defineEmits<{ close: [] }>()
const model = defineModel<boolean>({ required: true })

const dialogRef = useTemplateRef('dialogElement')

function close() {
  if (!props.loading) {
    model.value = false
  }
  emit('close')
}
function cancel() {
  if (!props.loading) {
    model.value = false
  }
}
watch(model, async (open) => {
  await nextTick()
  if (!dialogRef.value) {
    return
  }
  if (open && !dialogRef.value.open) {
    dialogRef.value.showModal()
  }
  if (!open && dialogRef.value.open) {
    dialogRef.value.close()
  }
}, { immediate: true })
</script>

<style>
.base-dialog {
  display: grid;
  grid-template-rows: auto 1fr auto;
  width: 100%;
  min-width: 300px;
  max-height: calc(100% - 2rem - var(--navigation-header-padding-top) - var(--bottom-padding));
  padding: 0;
  overflow: hidden;
  outline: none;
  background: var(--color-surface-background);
  border-color: var(--color-border);
  border-radius: 8px;
  &.size--small {
    max-width: calc(60% - 2em - 6px);
  }
  &.size--medium {
    max-width: calc(80% - 2em - 6px);
  }
  &.size--large {
    max-width: calc(100% - 2em - 6px);
  }
  &.fullscreen {
    max-width: 100%;
    max-height: calc(100% - var(--navigation-header-padding-top) - var(--bottom-padding));
    margin: 0;
  }
  &::backdrop {
    background-color: oklch(from black l c h / 60%);
  }
  .base-dialog__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--content-padding-inline);
    border-bottom: 1px solid var(--color-text);
    h2 {
      margin: 0;
      font-size: 1.3em;
      font-weight: 500;
      line-height: 1.3em;
    }
  }
  .base-dialog__close-button {
    padding: 0;
    margin-left: auto;
    font-size: 1.2rem;
  }
  .base-dialog__content {
    padding-block: calc(var(--content-padding-inline) * 1.5);
    padding-inline: var(--content-padding-inline);
    overflow-y: auto;
  }
  .base-dialog__footer {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding: var(--content-padding-inline);
    border-top: 1px solid var(--color-text);
  }
}
</style>
