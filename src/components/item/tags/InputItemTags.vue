<template>
  <div class="input-item-tags">
    <q-input
      v-model.trim="newTag"
      outlined
      :label="t('components.item.inputItemTags.tagsInput')"
      :maxlength="32"
      :disable="modelValue.size >= MAX_TAGS_COUNT"
      @keyup.enter="newTag.length ? onAddTag(newTag) : void 0"
    >
      <template #append>
        <q-icon :class="{ invisible: !newTag }" name="check" :disable="!newTag.length" @click="onAddTag(newTag)" />
      </template>
    </q-input>

    <ul ref="tagsRef" class="tags">
      <li v-for="{ group, items } in notEmptyTagsGroups" :key="group" :data-id="group" class="tag-group">
        <span>{{ group }}</span>
        <ul>
          <li v-for="tag in items" :key="tag" :data-tag="tag">
            <item-tag-component
              :disabled="modelValue.size >= MAX_TAGS_COUNT && !modelValue.has(tag)"
              :selected="modelValue.has(tag)"
              @click="onClickTag(tag)"
            >
              {{ tag }}
            </item-tag-component>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useItems from '@/composables/useItems'
import ItemTagComponent from '@/components/item/tags/ItemTag.vue'
import { useQuasar } from 'quasar'
import { useWindowSize } from '@vueuse/core'
import type { ItemTag } from '@/types/item'

const modelValue = defineModel<Set<ItemTag['name']>>({ default: new Set<ItemTag['name']>() })
const { notify } = useQuasar()
const { t } = useI18n()
const { tags, tagsRecord, customTagGroup } = useItems()
const notEmptyTagsGroups = computed(() => tags.value.filter(({ items }) => items.size))

const { width } = useWindowSize()
const isScrollable = computed(() => width.value < 1024)
const tagsRef = ref<HTMLUListElement | null>(null)
const newTag = ref<ItemTag['name']>('')

function onAddTag(tag: string) {
  const group = tagsRecord.value[tag]?.group ?? customTagGroup.value
  const isNewCustomTag = !tagsRecord.value[tag]?.group
  if (isNewCustomTag) customTagGroup.value.items.add(tag)
  if (isScrollable.value) scrollToGroup(group)
  if (modelValue.value.has(tag)) {
    shakeTagElement(tag)
    notify({ type: 'negative', message: t('components.item.inputItemTags.tagAlreadyAdded') })
  } else {
    onClickTag(tag)
  }
  newTag.value = ''
}

const MAX_TAGS_COUNT = 30
function onClickTag(tag: string) {
  if (modelValue.value.has(tag)) {
    modelValue.value.delete(tag)
  } else if (modelValue.value.size < MAX_TAGS_COUNT) {
    modelValue.value.add(tag)
  }
}

function scrollToGroup(group: string) {
  for (const groupLiNode of tagsRef.value!.children) {
    if (groupLiNode instanceof HTMLElement && groupLiNode.dataset.id === group) {
      return groupLiNode.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}
const shakeAnimation = [0, 10, 0, -10, 0].map((deg) => ({ transform: `rotate(${deg}deg)` }))
const shakeAnimationOptions = computed<Parameters<HTMLElement['animate']>[1]>(() => {
  return { duration: 300, delay: isScrollable.value ? 500 : 0 }
})
function shakeTagElement(tag: string) {
  for (const groupLiNode of tagsRef.value!.children) {
    const group = tagsRecord.value[tag]?.group ?? customTagGroup.value
    if (groupLiNode instanceof HTMLElement && groupLiNode.dataset.id !== group) continue
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
.input-item-tags {
  display: grid;
  gap: 8px;

  .tags {
    display: grid;
    gap: 16px;
    max-height: 170px;
    padding-bottom: 4px;
    overflow: hidden auto;
    border-bottom: 1px solid rgb(0 0 0 / 30%);

    @media (width >= 1024px) {
      max-height: fit-content;
    }

    .tag-group {
      display: flex;
      flex-wrap: wrap;

      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }

      span {
        display: inline-block;
        flex: 100%;
        padding-left: 0.25rem;
        font-size: 1.125rem;
        font-weight: 600;
      }
    }
  }
}
</style>
