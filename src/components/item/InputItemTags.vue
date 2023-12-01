<template>
  <q-input
    v-model.trim="newTag"
    class="q-mb-sm"
    outlined
    :label="t('components.item.inputItemTags.tagsInput')"
    :maxlength="32"
    @keyup.enter="onAddTag(newTag)"
  >
    <template #append>
      <q-icon :class="{ invisible: !newTag }" name="check" @click="onAddTag(newTag)" />
    </template>
  </q-input>

  <section class="tags">
    <div v-for="group in tags" :key="group.group" class="group">
      <span>{{ group.group }}</span>
      <q-chip
        v-for="stdTag in group.items"
        :key="stdTag"
        clickable
        :disable="props.modelValue.length >= MAX_TAGS_COUNT && !props.modelValue.includes(stdTag)"
        :class="{ 'selected-tag': modelValue.includes(stdTag) }"
        @click="onClickTag(stdTag)"
      >
        <span class="ellipsis">{{ stdTag }}</span>
      </q-chip>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocale } from '@/i18n'
import { type UserSettings } from '@/interfaces/types'
import { useLocalStorage } from '@vueuse/core'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface CreatableItemTag {
  readonly group: string
  items: Array<string>
}

const MAX_TAGS_COUNT = 30

const props = withDefaults(
  defineProps<{
    modelValue: Array<string>
  }>(),
  {},
)
const emit = defineEmits<{
  (e: 'update:modelValue', tags: Array<string>): void
}>()

const { t } = useI18n()
const { locale } = useLocale()
const userSettings = useLocalStorage<Readonly<Partial<UserSettings>>>('user-settings', {})

const newTag = ref('')
const tags = ref<Array<CreatableItemTag>>([])
const standardTags = ref<Array<CreatableItemTag>>([])
const standardTagsItems = computed(() => {
  return standardTags.value.reduce<Array<string>>((acc, item) => {
    acc.push(...item.items)
    return acc
  }, [])
})

onBeforeMount(async () => {
  const standardTagsLocale = userSettings.value.items?.standardTagsLocale || locale.value
  standardTags.value = (await import(`../../constants/items/tags/${standardTagsLocale}.ts`)).default

  const customTags: CreatableItemTag = {
    group: t('components.item.inputItemTags.custom'),
    items: [],
  }

  props.modelValue.forEach((modelValueTag) => {
    if (!standardTagsItems.value.includes(modelValueTag)) {
      customTags.items.push(modelValueTag)
    }
  })

  if (customTags.items.length) {
    tags.value.unshift(customTags)
  }

  tags.value.push(...standardTags.value)
})

const onAddTag = (tag: string) => {
  if (!tag || props.modelValue.length >= MAX_TAGS_COUNT) {
    return
  }

  if (!standardTagsItems.value.includes(tag)) {
    if (tags.value[0].group === t('components.item.inputItemTags.custom') && !tags.value[0].items.includes(tag)) {
      tags.value[0].items.push(tag)
    } else if (tags.value[0].group !== t('components.item.inputItemTags.custom')) {
      tags.value.unshift({ group: t('components.item.inputItemTags.custom'), items: [tag] })
    }
  }

  if (newTag.value) {
    newTag.value = ''
  }

  emit('update:modelValue', [...props.modelValue, tag])
}

const onClickTag = (tag: string) => {
  if (props.modelValue.includes(tag)) {
    emit(
      'update:modelValue',
      props.modelValue.filter((itemTag) => itemTag !== tag),
    )
  } else if (props.modelValue.length < MAX_TAGS_COUNT) {
    emit('update:modelValue', [...props.modelValue, tag])
  }
}
</script>

<style lang="scss" scoped>
.tags {
  max-height: 170px;
  overflow-x: hidden;
  overflow-y: auto;

  @include media-medium {
    max-height: fit-content;
  }
}

.group {
  margin-bottom: 0.5rem;

  > span {
    display: block;
    padding-left: 0.5rem;
    font-size: 0.8rem;
    font-weight: bold;

    @include media-medium {
      font-size: 1rem;
    }
  }
}

.selected-tag {
  font-weight: 500;
  background-color: $brand;
  transition: background-color 0.25s;
}
</style>
