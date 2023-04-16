<template>
  <q-input
    v-model="tag"
    class="q-mb-sm"
    outlined
    :label="t('components.item.inputItemTags.tagsInput')"
    :maxlength="32"
    @keyup.enter="onAddTag"
  >
    <template #append>
      <q-icon :class="{ invisible: !tag }" name="check" @click="onAddTag" />
    </template>
  </q-input>

  <section class="tags">
    <q-chip
      v-for="stdTag in standardTags"
      :key="stdTag"
      clickable
      :class="{ 'selected-tag': modelValue.includes(stdTag) }"
      @click="onClickTag(stdTag)"
    >
      <span class="ellipsis">{{ stdTag }}</span>
    </q-chip>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    modelValue: Array<string>
  }>(),
  {}
)
const emit = defineEmits<{
  (e: 'update:modelValue', tags: Array<string>): void
}>()

const { t } = useI18n()

const tag = ref('')
const standardTags = ref([
  ...new Set([
    ...props.modelValue,
    'black',
    'blue',
    'brown',
    'green',
    'grey',
    'orange',
    'pink',
    'purple',
    'red',
    'white',
    'yellow',
    'boots',
    'cap',
    'coat',
    'dress',
    'frock',
    'fur coat',
    'gloves',
    'jacket',
    'jeans',
    'jumper',
    'leggings',
    'overalls',
    'pyjamas',
    'pants',
    'scarf',
    'shirt',
    'shoes',
    'skirt',
    'socks',
    'suit',
    'sweater',
    't-shirt',
    'underwear',
  ]),
])

const onAddTag = () => {
  const newTag = tag.value.trim()
  tag.value = ''
  if (!newTag) {
    return
  }
  if (!standardTags.value.includes(newTag)) {
    standardTags.value.unshift(newTag)
  }
  emit('update:modelValue', [...props.modelValue, newTag])
}

const onClickTag = (tag: string) => {
  if (props.modelValue.includes(tag)) {
    emit(
      'update:modelValue',
      props.modelValue.filter((itemTag) => itemTag !== tag)
    )
  } else {
    emit('update:modelValue', [...props.modelValue, tag])
  }
}
</script>

<style lang="scss" scoped>
.tags {
  max-height: 120px;
  overflow-x: hidden;
  overflow-y: auto;

  @include media-medium {
    max-height: 300px;
  }
}

.selected-tag {
  font-weight: 500;
  background-color: $brand;
  transition: background-color 0.25s;
}
</style>
