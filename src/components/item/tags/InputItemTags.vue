<template>
  <div class="input-item-tags">
    <q-input
      v-model.trim="newTag"
      outlined
      :label="t('components.item.inputItemTags.tagsInput')"
      :maxlength="32"
      :disable="modelValue.length >= MAX_TAGS_COUNT"
      @keyup.enter="onAddTag(newTag)"
    >
      <template #append>
        <q-icon :class="{ invisible: !newTag }" name="check" @click="onAddTag(newTag)" />
      </template>
    </q-input>

    <ul class="tags">
      <li v-for="[groupKey, group] in allTags" :key="groupKey" class="tag-group">
        <span>{{ groupKey }}</span>
        <ul>
          <li v-for="{ name: tag } in group" :key="tag">
            <item-tag
              :disabled="modelValue.length >= MAX_TAGS_COUNT && !modelValue.includes(tag)"
              :selected="modelValue.includes(tag)"
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
import { defineModel, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useItems from '@/composables/useItems'
import ItemTag from '@/components/item/tags/ItemTag.vue'

const MAX_TAGS_COUNT = 30

const modelValue = defineModel<Array<string>>({ default: [] })
const { t } = useI18n()
const { tags, tagsByGroups } = useItems()
const newTag = ref('')
const allTags = computed(() => {
  const usersTags = modelValue.value.filter((tag) => !tags.value[tag])
  if (!usersTags.length) return tagsByGroups.value

  return new Map([...tagsByGroups.value]).set(
    t('components.item.inputItemTags.custom'),
    usersTags.map((tag) => ({ name: tag, group: t('components.item.inputItemTags.custom') })),
  )
})

const onAddTag = (tag: string) => {
  if (!tag.length) return
  onClickTag(tag)
  if (newTag.value) newTag.value = ''
}

const onClickTag = (tag: string) => {
  const isTagSelected = modelValue.value.includes(tag)
  if (isTagSelected) {
    modelValue.value = modelValue.value.filter((itemTag) => itemTag !== tag)
  } else if (modelValue.value.length < MAX_TAGS_COUNT) {
    modelValue.value.push(tag)
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
