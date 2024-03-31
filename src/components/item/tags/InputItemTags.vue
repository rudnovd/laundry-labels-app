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
      <li v-if="userTags.size" :data-id="userCustomTagsGroup" class="tag-group">
        <span>{{ userCustomTagsGroup }}</span>
        <ul>
          <li v-for="tag in userTags" :key="tag" :data-tag="tag">
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
      <li v-for="[groupKey, group] in tagsByGroups" :key="groupKey" :data-id="groupKey" class="tag-group">
        <span>{{ groupKey }}</span>
        <ul>
          <li v-for="{ name: tag } in group" :key="tag" :data-tag="tag">
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
import { useQuasar } from 'quasar'
import { useWindowSize } from '@vueuse/core'

const modelValue = defineModel<Set<string>>({ default: new Set() })
const { notify } = useQuasar()
const { t } = useI18n()
const { width } = useWindowSize()
const { tags, tagsByGroups } = useItems()

const isScrollable = computed(() => width.value < 1024)
const userCustomTagsGroup = computed(() => t('components.item.inputItemTags.custom'))
const tagsRef = ref<HTMLElement | null>(null)
const newTag = ref('')
const userTags = computed<Set<string>>(() => {
  const userTags: Set<string> = new Set()
  for (const tag of modelValue.value) {
    if (!tags.value[tag]) userTags.add(tag)
  }
  return userTags
})

function onAddTag(tag: string) {
  const group = tags.value[tag]?.group ?? userCustomTagsGroup.value
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
    const group = tags.value[tag]?.group ?? userCustomTagsGroup.value
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
