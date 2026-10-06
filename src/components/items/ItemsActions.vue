<template>
  <div class="items-page__actions">
    <div class="add-actions">
      <router-link
        v-if="!userStore.isAuthenticated"
        class="button-link button-primary add-item-button"
        data-onboarding-element="add-item-button"
        to="/items/modify"
      >
        <IconAdd />
        {{ $t('pages.items.addLocalItem') }}
      </router-link>
      <router-link
        v-else-if="!isItemsLimitReached"
        class="button-link button-primary add-item-button"
        data-onboarding-element="add-item-button"
        to="/items/modify"
      >
        <IconAdd />
        {{ $t('common.add') }}
      </router-link>
      <BaseTooltip v-else>
        <template #activator>
          <button class="button-primary" disabled>
            <IconAdd />
            {{ $t('common.add') }}
          </button>
          {{ $t('pages.items.itemsLimitReached') }}
        </template>
      </BaseTooltip>
      <button
        :disabled="!items.length"
        class="button-primary"
        @click="$router.push({ path: '/items/filter', query: $router.currentRoute.value.query })"
      >
        <IconFilter />
      </button>
    </div>
    <BaseChipsInput
      v-model="search"
      :placeholder="$t('pages.items.search')"
      :disabled="!items.length"
      :maxlength="32"
      @keyup.enter="searchAny"
      @confirm="searchAny"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import useItems from '@/composables/useItems'
import { ITEMS_LIMIT } from '@/constants'
import { useItemsStore } from '@/stores/items'
import { useUserStore } from '@/stores/user'
import BaseChipsInput from '../base/BaseChipsInput.vue'
import BaseTooltip from '../base/BaseTooltip.vue'

const IconAdd = defineAsyncComponent(() => import('~icons/mdi/add'))
const IconFilter = defineAsyncComponent(() => import('~icons/mdi/filter'))

const model = defineModel<Record<string, Array<string>>>({ required: true })

const itemsStore = useItemsStore()
const isItemsLimitReached = computed(() => itemsStore.items.length >= ITEMS_LIMIT)

const { items } = useItems()

const userStore = useUserStore()

const search = ref<string>('')
function searchAny() {
  if (!search.value) {
    return
  }
  if (!model.value.search) {
    model.value.search = []
  }
  const searchQuery = search.value.toLowerCase()
  if (model.value.search.includes(searchQuery)) {
    search.value = ''
    return
  }
  model.value.search = [...model.value.search, searchQuery]
  search.value = ''
}
</script>

<style>
.items-page__actions {
  display: grid;
  row-gap: 0.5rem;
  .add-actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
