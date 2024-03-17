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

    <ul class="tags">
      <li v-for="[groupKey, group] in allTags" :key="groupKey" class="tag-group">
        <span>{{ groupKey }}</span>
        <ul>
          <li v-for="{ name: tag } in group" :key="tag">
            <item-tag
              :disabled="modelValue.size >= MAX_TAGS_COUNT && !modelValue.has(tag)"
              :selected="modelValue.has(tag)"
              @click="onClickTag(tag)"
            >
              {{ tag }}
            </item-tag>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, defineModel, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useItems from '@/composables/useItems'
import ItemTag from '@/components/item/tags/ItemTag.vue'
import type { ItemTag as ItemTagType } from '@/types/item'

const MAX_TAGS_COUNT = 30

const modelValue = defineModel<Set<string>>({ default: new Set() })
const { t } = useI18n()
const { tags, tagsByGroups } = useItems()
const newTag = ref('')
const allTags = computed(() => {
  const userTags: Array<ItemTagType> = []
  for (const tag of modelValue.value) {
    if (!tags.value[tag]) userTags.push({ name: tag, group: t('components.item.inputItemTags.custom') })
  }
  const tagsMap = new Map([...tagsByGroups.value])
  if (userTags.length) tagsMap.set(t('components.item.inputItemTags.custom'), userTags)
  return tagsMap
})

const onAddTag = (tag: string) => {
  onClickTag(tag)
  newTag.value = ''
}

const onClickTag = (tag: string) => {
  if (modelValue.value.has(tag)) {
    modelValue.value.delete(tag)
  } else if (modelValue.value.size < MAX_TAGS_COUNT) {
    modelValue.value.add(tag)
  }
}
</script>

<style>
.input-item-tags {
  display: grid;
  gap: 8px;

  .tags {
    display: grid;
    gap: 8px;
    max-height: 170px;
    overflow: hidden auto;

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
        padding-left: 0.5rem;
        font-weight: 600;
      }
    }
  }
}
</style>
