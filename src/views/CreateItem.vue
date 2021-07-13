<template>
  <section class="create-item-page q-pa-sm">
    <q-form class="create-item-form" @submit="onSubmit">
      <q-select
        v-model="userItemBlank.type"
        filled
        :disable="isLaudnryLabelsOptionsLoading || isPostRequestLoading"
        :loading="isLaudnryLabelsOptionsLoading"
        :options="laundryLabelsOptions.types"
        option-value="code"
        option-label="value"
        label="Type *"
        lazy-rules
        reactive-rules
        :rules="[(val) => val !== null || 'Please select something']"
      />

      <q-input v-model="userItemBlank.name" filled label="Name" :disable="isPostRequestLoading" />

      <!-- <section class="color-picker-container">
          <q-color
            v-model="item.color"
            no-header
            no-footer
            format-model="rgb"
            default-view="palette"
            :palette="standartColors"
            @change="(value) => (item.color = value)"
          />

          <div class="selected-color" :style="{ backgroundColor: item.color }" />
        </section> -->

      <section class="washing-icons-container">
        <div v-for="group in laundryLabelsOptions.icons" :key="group" class="icons-group">
          <!-- <span>{{ group.name }}</span> -->

          <div class="icons-chips">
            <div
              v-for="icon in group.icons"
              :key="icon.code"
              v-ripple
              class="icon-chip"
              :class="{ selected: isIconSelected(icon) }"
              @click="selectIcon(icon)"
            >
              <q-icon :name="icon.icon" />
              <span>{{ icon.text }}</span>
            </div>
          </div>
        </div>
      </section>

      <q-btn
        color="positive"
        class="full-width"
        label="Create"
        type="submit"
        :disable="isPostRequestLoading"
        :loading="isPostRequestLoading"
      />
    </q-form>
  </section>
</template>

<script lang="ts">
import { laundryIcon } from '@/interfaces/laundryIcon'
import { userItemBlank } from '@/interfaces/userItem'
import { computed, defineComponent, reactive, ref } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'CreateItem',
  setup() {
    const router = useRouter()
    const store = useStore()

    const laundryLabelsOptions = computed(() => store.state.laundryLabelsOptions)
    const isLaudnryLabelsOptionsLoading = ref(true)
    const isPostRequestLoading = ref(false)
    const userItemBlank = reactive({
      name: null,
      type: null,
      laundryIcons: [],
      images: null,
      created: null,
    } as userItemBlank)

    Promise.all([store.dispatch('getLaundryLabelsIcons'), store.dispatch('getItemsTypes')]).finally(
      () => (isLaudnryLabelsOptionsLoading.value = false)
    )

    const selectIcon = (icon: laundryIcon) => {
      userItemBlank.laundryIcons.indexOf(icon) !== -1
        ? userItemBlank.laundryIcons.splice(userItemBlank.laundryIcons.indexOf(icon), 1)
        : userItemBlank.laundryIcons.push(icon)
    }
    const isIconSelected = (icon: laundryIcon) => userItemBlank.laundryIcons.indexOf(icon) !== -1

    const onSubmit = () => {
      isPostRequestLoading.value = true
      store
        .dispatch('createUserItem', { userItemBlank })
        .then(() => router.push('/'))
        .finally(() => (isPostRequestLoading.value = false))
    }

    return {
      userItemBlank,
      laundryLabelsOptions,
      isLaudnryLabelsOptionsLoading,
      isPostRequestLoading,

      selectIcon,
      isIconSelected,
      onSubmit,
    }
  },
})
</script>

<style lang="scss" scoped>
.create-item-form {
  display: grid;
  gap: 1.5rem;
}

.color-picker-container {
  display: grid;
  gap: 4px;

  .selected-color {
    height: 24px;
    border-radius: 4px;
  }
}

.washing-icons-container {
  display: grid;
  gap: 1rem;
}

.icons-group {
  display: grid;
  gap: 0.25rem;

  span:first-child {
    font-size: 1.125rem;
    font-weight: 500;
    text-align: center;
  }
}

.icons-chips {
  display: grid;
  // grid-template-columns: repeat(auto-fill, minmax(50%, 1fr));
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 5.625rem;
  gap: 1rem;
  // grid-template-rows: repeat(auto, 64px);
  // grid-auto-flow: row;
}

.icon-chip {
  display: grid;
  position: relative;
  padding: 0.25rem;
  grid-template-columns: 64px auto;
  gap: 0.5rem;
  align-items: center;
  border: 1px solid $grey-4;
  border-radius: 8px;

  & img {
    font-size: 4rem;
  }

  & span {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    overflow: hidden;
  }

  &.selected {
    background-color: rgba($grey-6, 0.3);
  }
}

.icon-chip-text {
  font-size: 0.5rem;
}
</style>
