<template>
  <section class="laundry-icon-group">
    <span>{{ t(`iconsGroups.${group.name}`) }}</span>

    <div class="group-icons">
      <button
        v-for="icon in group.icons"
        :key="icon._id"
        v-ripple
        :class="{
          selected: icon._id === selectedIcon?._id,
          'icon-transparent': selectedIcon?._id && selectedIcon?._id !== icon._id,
        }"
        @click="onClickIcon(icon)"
      >
        <q-icon :name="`${icon._id}`" tag="svg" size="5em" />
        <span>{{ t(icon.description) }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { LaundryIcon } from '@/interfaces/laundryIcon'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    group: {
      name: string
      icons: Array<LaundryIcon>
    }
    value?: LaundryIcon | null
  }>(),
  {
    value: null,
  },
)
const emit = defineEmits<{
  (e: 'change', icon: LaundryIcon): void
  (e: 'remove', icon: LaundryIcon): void
}>()

const selectedIcon = ref<LaundryIcon | null>(props.value)

const onClickIcon = (icon: LaundryIcon) => {
  if (selectedIcon.value) {
    emit('remove', selectedIcon.value)

    if (selectedIcon.value._id === icon._id) {
      selectedIcon.value = null
      return
    }
  }

  selectedIcon.value = icon
  emit('change', selectedIcon.value)
}
</script>

<style lang="scss" scoped>
.laundry-icon-group {
  display: grid;
  gap: 0.25rem;

  & > span:first-child {
    font-size: 1.125rem;
    font-weight: 500;
    text-align: center;
    text-transform: capitalize;
  }
}

.group-icons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 5.625rem;
  gap: 0.5rem;

  @include media-small {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  & > button {
    position: relative;
    display: grid;
    grid-template-columns: 64px auto;
    gap: 0.5rem;
    align-items: center;
    padding: 0.25rem;
    cursor: pointer;
    background: white;
    border: 1px solid $grey-4;
    border-radius: 8px;

    & span:nth-child(2) {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      overflow-wrap: break-word;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }

    &.selected {
      font-weight: 500;
      background-color: rgba($grey-6, 0.3);
      border: 1px solid $grey-6;
      transition:
        border 0.25s linear,
        background-color 0.25s linear;
    }

    &.icon-transparent {
      & > span {
        opacity: 0.3;
        transition: opacity 0.25s linear;
      }
    }
  }
}
</style>
