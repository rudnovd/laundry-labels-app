<template>
  <div class="modify-item-tags">
    <label :for="`modify-item-tags-chips-input-${id}`">{{ $t('common.tags') }}</label>
    <BaseChipsInput
      :id="`modify-item-tags-chips-input-${id}`"
      v-model="newTag"
      class="modify-item-tags__input"
      :placeholder="$t('components.item.inputItemTags.tagsInput')"
      :maxlength="32"
      :disabled="disabled || model.length >= MAX_TAGS_COUNT"
      @confirm="onAddTag"
    />
    <ul ref="tagsRef" class="modify-item-tags__tags-list">
      <li v-for="{ group, items } in notEmptyTagsGroups" :key="group" :data-id="group" class="modify-item-tags__tags-list-element">
        <span class="modify-item-tags__tags-list-element-title">{{ group }}</span>
        <ul class="modify-item-tags__inner-list">
          <li v-for="tag in items" :key="tag" :data-tag="tag">
            <ItemTagComponent
              :disabled="disabled || model.length >= MAX_TAGS_COUNT && !model.includes(tag)"
              :selected="model.includes(tag)"
              @click="onClickTag(tag)"
            >
              {{ tag }}
            </ItemTagComponent>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { ItemTag } from '@/types/item'
import { useWindowSize } from '@vueuse/core'
import { computed, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import BaseChipsInput from '@/components/base/BaseChipsInput.vue'
import ItemTagComponent from '@/components/item/ItemTag.vue'
import useItems from '@/composables/useItems'

defineProps<{ disabled: boolean }>()
const model = defineModel<Array<ItemTag['name']>>({ default: () => [] })
const { t } = useI18n()
const { tags, tagsRecord, customTagGroup } = useItems()
const notEmptyTagsGroups = computed(() => tags.value.filter(({ items }) => items.size))
const id = useId()

const { width } = useWindowSize()
const isScrollable = computed(() => width.value < 1024)
const tagsRef = ref<HTMLUListElement | null>(null)
const newTag = ref<ItemTag['name']>('')

function onAddTag(tag: string) {
  tag = tag.trim().toLowerCase()
  const group = tagsRecord.value[tag]?.group ?? customTagGroup.value
  const isNewCustomTag = !tagsRecord.value[tag]?.group
  if (isNewCustomTag) {
    customTagGroup.value.items.add(tag)
  }
  if (isScrollable.value) {
    scrollToGroup(group)
  }
  if (model.value.includes(tag)) {
    shakeTagElement(tag)
    toast.error(t('components.item.inputItemTags.tagAlreadyAdded'))
  }
  else {
    onClickTag(tag)
  }
  newTag.value = ''
}

const MAX_TAGS_COUNT = 30
function onClickTag(tag: string) {
  const index = model.value.indexOf(tag)
  if (index !== -1) {
    model.value.splice(index, 1)
  }
  else if (model.value.length < MAX_TAGS_COUNT) {
    model.value.push(tag)
  }
}
function scrollToGroup(group: string) {
  for (const groupLiNode of tagsRef.value!.children) {
    if (groupLiNode instanceof HTMLElement && groupLiNode.dataset.id === group) {
      return groupLiNode.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}
const shakeAnimation = [0, 10, 0, -10, 0].map(deg => ({ transform: `rotate(${deg}deg)` }))
const shakeAnimationOptions = computed<Parameters<HTMLElement['animate']>[1]>(() => {
  return { duration: 300, delay: isScrollable.value ? 500 : 0 }
})
function shakeTagElement(tag: string) {
  for (const groupLiNode of tagsRef.value!.children) {
    const group = tagsRecord.value[tag]?.group ?? customTagGroup.value
    if (groupLiNode instanceof HTMLElement && groupLiNode.dataset.id !== group)
      continue
    const tagsUlNode = groupLiNode.children[1]
    for (const tagLiNode of tagsUlNode.children) {
      if (tagLiNode instanceof HTMLElement && tagLiNode.dataset.tag === tag) {
        return tagLiNode.animate(shakeAnimation, shakeAnimationOptions.value)
      }
    }
  }
}
</script>

<style>
.modify-item-tags {
  display: grid;
  gap: 0.5rem;
  .modify-item-tags__tags-list {
    display: grid;
    gap: 1rem;
    max-height: 170px;
    padding-bottom: 4px;
    overflow: hidden auto;
    border-bottom: 1px solid rgb(0 0 0 / 30%);
    @media (width >= 1024px) {
      max-height: fit-content;
    }
    .modify-item-tags__tags-list-element {
      display: grid;
      .modify-item-tags__tags-list-element-title {
        font-size: 1.125rem;
        font-weight: 600;
      }
      .modify-item-tags__inner-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem 0.5rem;
      }
    }
  }
}
</style>
