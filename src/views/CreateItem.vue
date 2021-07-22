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

      <q-img v-if="route.params.id && userItemBlank.images" :src="userItemBlank.images[0]" />

      <q-uploader
        v-if="!route.params.id"
        class="upload-image"
        max-total-size="20971520"
        accept="image/*"
        :disable="isPostRequestLoading"
        :max-files="1"
        @added="onAddImage"
        @removeFile="userItemBlank.images = null"
      >
        <template #header="scope">
          <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
            <div class="col">
              <div class="q-uploader__title">Upload image</div>
            </div>
            <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" round dense flat>
              <q-uploader-add-trigger />
            </q-btn>
          </div>
        </template>
      </q-uploader>

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
            <button
              v-for="icon in group.icons"
              :key="icon.code"
              v-ripple
              type="button"
              class="icon-chip"
              :class="{ selected: isIconSelected(icon) }"
              @click="selectIcon(icon)"
            >
              <q-icon :name="icon.icon" />
              <span>{{ icon.text }}</span>
            </button>
          </div>
        </div>
      </section>

      <q-btn
        color="positive"
        class="full-width"
        :label="route.params.id ? 'Save' : 'Create'"
        type="submit"
        :disable="isPostRequestLoading"
        :loading="isPostRequestLoading"
      />
    </q-form>
  </section>
</template>

<script lang="ts">
import { laundryIcon } from '@/interfaces/laundryIcon'
import { userItem, userItemBlank } from '@/interfaces/userItem'
import { computed, defineComponent, reactive, ref, watch } from '@vue/runtime-core'
import Compressor from 'compressorjs'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'CreateItem',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const laundryLabelsOptions = computed(() => store.state.laundryLabelsOptions)
    const isLaudnryLabelsOptionsLoading = ref(false)
    const isPostRequestLoading = ref(false)
    const userItemBlank = reactive({
      name: null,
      type: null,
      laundryIcons: [],
      images: null,
    } as userItemBlank)

    if (!laundryLabelsOptions.value.types.length) {
      isLaudnryLabelsOptionsLoading.value = true
      store.dispatch('getItemsTypes').finally(() => (isLaudnryLabelsOptionsLoading.value = false))
    }

    if (!laundryLabelsOptions.value.icons.length) {
      store.dispatch('getLaundryLabelsIcons')
    }

    const userItems = computed(() => store.state.items)
    if (route.params.id) {
      if (!userItems.value.find((userItem: userItem) => userItem.id === route.params.id)) {
        isPostRequestLoading.value = true
        store.dispatch('getUserItemById', { id: route.params.id }).finally(() => (isPostRequestLoading.value = false))
      } else {
        const currentUserItem = userItems.value.find((userItem: userItem) => userItem.id === route.params.id)
        if (!currentUserItem) return

        // TODO: fix me!
        Object.assign(userItemBlank, { ...currentUserItem })
        userItemBlank.laundryIcons = [...currentUserItem.laundryIcons]
      }
    }

    watch(userItems, (newUserItemsValue) => {
      if (!route.params.id) return

      const currentUserItem = newUserItemsValue.find((userItem: userItem) => userItem.id === route.params.id)
      if (!currentUserItem) return

      // TODO: fix me!
      Object.assign(userItemBlank, { ...currentUserItem })
      userItemBlank.laundryIcons = [...currentUserItem.laundryIcons]
    })

    const selectIcon = (icon: laundryIcon) => {
      const iconIndex = userItemBlank.laundryIcons.findIndex((laundryIcon) => laundryIcon.code === icon.code)
      iconIndex !== -1 ? userItemBlank.laundryIcons.splice(iconIndex, 1) : userItemBlank.laundryIcons.push(icon)
    }

    const isIconSelected = (icon: laundryIcon) => {
      return userItemBlank.laundryIcons.find((laundryIcon) => laundryIcon.code === icon.code)
    }

    const onAddImage = (imgs: File[]) => {
      const compressorResult = new Promise((resolve: (value: Blob) => void, reject) => {
        new Compressor(imgs[0], {
          quality: 0.4,
          success: resolve,
          error: reject,
        })
      })

      compressorResult.then((file) => (userItemBlank.images = [file])).catch((err) => console.error(err))
    }

    const onSubmit = () => {
      isPostRequestLoading.value = true

      if (route.params.id) {
        const currentUserItem = userItems.value.find((userItem: userItem) => userItem.id === route.params.id)
        store.dispatch('editUserItem', { userItem: currentUserItem, userItemBlank }).then(() => router.push('/'))
      } else {
        store
          .dispatch('createUserItem', { userItemBlank })
          .then(() => router.push('/'))
          .finally(() => (isPostRequestLoading.value = false))
      }
    }

    return {
      route,

      userItemBlank,
      laundryLabelsOptions,
      isLaudnryLabelsOptionsLoading,
      isPostRequestLoading,

      selectIcon,
      isIconSelected,
      onSubmit,
      onAddImage,
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
  background: white;

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

.upload-image {
  width: 100%;
}
</style>
