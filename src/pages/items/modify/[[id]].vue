<template>
  <section class="modify-item-page">
    <span v-if="isItemNotFound"> {{ $t('pages.modifyItem.itemNotFound') }} </span>
    <span v-if="hasFetchError"> {{ $t('pages.modifyItem.fetchError') }} </span>
    <span v-else-if="isFetchingItem">{{ $t('common.loading') }}...</span>
    <template v-else>
      <div class="modify-item-page__item-data-base">
        <UploadItemPhoto v-model="modifiedItem.photos" :disabled="isSaving" />
        <BaseInput
          v-model="modifiedItem.name"
          class="item-data-base__name"
          :label="$t('common.name')"
          :placeholder="$t('common.name')"
          :disabled="isSaving"
          data-onboarding-element="modify-item-name"
          maxlength="64"
        />
        <ModifyItemTags
          v-model="modifiedItem.tags"
          class="modify-item-page__item-data-tags"
          :disabled="isSaving"
          data-onboarding-element="modify-item-tags"
        />
        <ModifyItemMaterialsList v-model="modifiedItem.materials" :disabled="isSaving" />
      </div>
      <ul
        v-if="symbolsByGroups.size"
        ref="laundrySymbolsContainerElement"
        class="modify-item-page__item-data-symbols"
        data-onboarding-element="modify-item-symbols"
      >
        <li v-for="[group] in symbolsByGroups" :key="group">
          <ModifyItemSymbolsList v-model="modifiedItem.symbols" :disabled="isSaving" :group="group" />
        </li>
      </ul>
      <BaseTooltip v-if="route.params.id" :disabled="hasChanges" class="modify-item-page__modify-button">
        <template #activator>
          <button
            :disabled="!hasChanges"
            class="button-success"
            :class="{ sticky: hasChanges }"
            @click="edit"
          >
            {{ isLocalItem ? $t('pages.modifyItem.saveLocalItem') : $t('common.save') }}
          </button>
        </template>
        {{ $t('pages.modifyItem.noChangesToSave') }}
      </BaseTooltip>
      <button
        v-else
        class="button-success modify-item-page__modify-button"
        data-onboarding-element="save-item-button"
        @click="create"
      >
        {{ isLocalItem ? $t('pages.modifyItem.createLocalItem') : $t('common.create') }}
      </button>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { Item, ItemBlank } from '@/types/item'
import { useEventListener } from '@vueuse/core'
import { cloneDeep, intersection, isEqual } from 'es-toolkit'
import { computed, onBeforeMount, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTooltip from '@/components/base/BaseTooltip.vue'
import ModifyItemMaterialsList from '@/components/item/modify/ModifyItemMaterialsList.vue'
import UploadItemPhoto from '@/components/item/modify/ModifyItemPhoto.vue'
import ModifyItemSymbolsList from '@/components/item/modify/ModifyItemSymbolsList.vue'
import ModifyItemTags from '@/components/item/modify/ModifyItemTags.vue'
import useItems from '@/composables/useItems'
import { IS_ONBOARDING_FINISHED_KEY } from '@/constants/onboarding'
import { useUserStore } from '@/stores/user'

definePage({
  meta: {
    title: 'pages.modifyItem.title',
  },
})

const router = useRouter()
const route = useRoute('/items/modify/[[id]]')
const userStore = useUserStore()

const isLocalItem = computed(() => {
  if (route.params.id) {
    return route.params.id.startsWith('offline-')
  }
  return userStore.settings.offlineMode || !userStore.isAuthenticated
})
const laundrySymbolsContainerRef = useTemplateRef('laundrySymbolsContainerElement')
const modifiedItem = ref<ItemBlank>({
  name: '',
  symbols: [],
  photos: [],
  materials: [],
  tags: [],
})
const initialItem = ref<ItemBlank>(cloneDeep(modifiedItem.value))
function isEqualArrays<T extends string>(first: Array<T>, second: Array<T>): boolean {
  const intersectedArray = intersection(first, second)
  return first.length === second.length && intersectedArray.length === first.length
}
const hasChanges = computed(() => {
  const isEqualNames = initialItem.value.name === modifiedItem.value.name
  const isEqualSymbols = isEqualArrays(initialItem.value.symbols, modifiedItem.value.symbols)
  const isEqualPhotos = isEqual(initialItem.value.photos, modifiedItem.value.photos)
  const isEqualMaterials = isEqualArrays(initialItem.value.materials, modifiedItem.value.materials)
  const isEqualTags = isEqualArrays(initialItem.value.tags, modifiedItem.value.tags)
  return !isEqualNames || !isEqualPhotos || !isEqualSymbols || !isEqualMaterials || !isEqualTags
})

const { items, createItem, symbolsByGroups, getItemById, editItem } = useItems()
const isFetchingItem = ref<boolean>(false)
const hasFetchError = ref(false)
const isItemNotFound = ref<boolean>(false)
onBeforeMount(async () => {
  const routeId = route.params.id
  if (!routeId) {
    return
  }
  const currentItem = items.value.find(({ id }) => id === routeId)
  if (currentItem) {
    modifiedItem.value = cloneDeep(currentItem)
    initialItem.value = cloneDeep(currentItem)
  }
  else {
    isFetchingItem.value = true
    try {
      const item = await getItemById(routeId)
      if (item) {
        modifiedItem.value = cloneDeep(item)
        initialItem.value = cloneDeep(item)
      }
      else {
        isItemNotFound.value = true
      }
    }
    catch {
      hasFetchError.value = true
    }
    finally {
      isFetchingItem.value = false
    }
  }
})

const { t } = useI18n()
function isSymbolsSelected(symbols: Item['symbols']) {
  if (!symbols.length) {
    laundrySymbolsContainerRef.value?.scrollIntoView({ behavior: 'smooth' })
    toast.error(t('pages.modifyItem.validation.symbolsRequired'))
    return false
  }
  return true
}

const isSaving = ref<boolean>(false)
async function create() {
  if (!isSymbolsSelected(modifiedItem.value.symbols)) {
    return
  }
  isSaving.value = true
  try {
    await createItem(modifiedItem.value)
    toast.success(t('pages.modifyItem.itemAdded'))
    initialItem.value = cloneDeep(modifiedItem.value)
    router.push('/items')
  }
  finally {
    isSaving.value = false
  }
}
async function edit() {
  const routeId = route.params.id
  if (!isSymbolsSelected(modifiedItem.value.symbols) || !routeId) {
    return
  }
  isSaving.value = true
  try {
    await editItem({ ...modifiedItem.value, id: routeId })
    toast.success(t('pages.modifyItem.itemUpdated'))
    initialItem.value = cloneDeep(modifiedItem.value)
    router.push('/items')
  }
  finally {
    isSaving.value = false
  }
}

const isOnboardingFinished = localStorage.getItem(IS_ONBOARDING_FINISHED_KEY) === 'true'
if (isOnboardingFinished) {
  useEventListener(window, 'beforeunload', (event) => {
    if (hasChanges.value) {
      event.preventDefault()
    }
  })
  onBeforeRouteLeave(() => {
    if (hasChanges.value) {
    // eslint-disable-next-line no-alert
      return window.confirm(t('alerts.unsavedChanges'))
    }
  })
}
</script>

<style>
.modify-item-page {
  display: grid;
  grid-template-areas:
    'data'
    'symbols'
    'button';
  grid-template-columns: 100%;
  grid-auto-rows: max-content;
  gap: 24px;
  padding-block: var(--content-padding-block) calc(var(--content-padding-block) * 2);
  margin: auto;
  @media (width >= 1024px) {
    grid-template-areas:
      'data symbols'
      '. button';
    grid-template-columns: 2fr 5fr;
  }
  .modify-item-page__item-data-tags label {
    font-size: 1.125rem;
    font-weight: 600;
  }
  .modify-item-page__item-data-base {
    display: grid;
    grid-area: data;
    grid-auto-rows: max-content;
    gap: 1rem;
    .base-input {
      display: grid;
      label {
        font-size: 1.125rem;
        font-weight: 600;
      }
      .item-data-base__name {
        height: 2rem;
      }
    }
  }
  .modify-item-page__item-data-symbols {
    display: grid;
    grid-area: symbols;
    gap: 2rem;
  }
  .modify-item-page__modify-button {
    grid-area: button;
    &.sticky {
      position: sticky;
      bottom: 5dvh;
    }
  }
}
</style>
