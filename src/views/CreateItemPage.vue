<template>
  <section class="create-item-page q-py-md">
    <q-form class="create-item-form" @submit="onSubmit">
      <q-img
        v-if="route.params.id"
        :src="newItem.images.length && newItem.images[0]"
        :class="{ 'no-image': !newItem.length }"
      />

      <section class="q-px-sm">
        <q-uploader
          v-if="!route.params.id"
          class="upload-image"
          :max-total-size="393216"
          accept="image/jpg, image/jpeg, image/png"
          :max-files="1"
          @added="onAddImage"
          @rejected="onAddFileReject"
          @remove-file="newItem.images = []"
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

        <section class="washing-icons-container q-mb-md">
          <div v-for="(icons, group) in iconsByGroups" :key="group" class="icons-group">
            <span>{{ group }}</span>

            <div class="icons-chips">
              <button
                v-for="icon in icons"
                :key="icon.code"
                v-ripple
                type="button"
                class="icon-chip"
                :class="{ selected: isIconSelected(icon) }"
                @click="selectIcon(icon)"
              >
                <q-icon :name="`img:${icon.path}`" />
                <span>{{ icon.description }}</span>
              </button>
            </div>
          </div>
        </section>

        <q-select
          v-model="newItem.tags"
          class="q-mb-md"
          outlined
          clearable
          label="tags"
          use-input
          multiple
          hide-dropdown-icon
          new-value-mode="add-unique"
          :placeholder="!newItem.tags.length ? 'Input tag and press Enter' : ''"
          :max-values="10"
          :options="['black', 'white', 'jeans']"
          use-chips
          menu-self="center end"
          autocomplete="off"
        />

        <q-btn color="positive" class="full-width" type="submit" :label="route.params.id ? 'Save' : 'Create'" />
      </section>
    </q-form>
  </section>
</template>

<script lang="ts">
import type { Item, ItemBlank } from '@/interfaces/item'
import { computed, defineComponent, reactive, ref, watch } from '@vue/runtime-core'
import Compressor from 'compressorjs'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { laundryIcons } from '@/assets/laundryIcons'
import type { laundryIcon } from '@/interfaces/laundryIcon'
import { useQuasar } from 'quasar'
import request from '@/services/request'

export default defineComponent({
  name: 'CreateItemPage',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const userItems = computed(() => store.state.items)

    const isUserItemLoading = ref(false)
    const newItem = reactive({
      icons: [],
      images: [],
      tags: [],
    } as ItemBlank)

    const iconsByGroups = computed(() => {
      const map: {
        [key: string]: Array<laundryIcon>
      } = {}

      laundryIcons.forEach((icon) => {
        if (map[icon.group]) map[icon.group].push(icon)
        else map[icon.group] = [icon]
      })

      return map
    })

    if (route.params.id) {
      if (!userItems.value.find((userItem: Item) => userItem._id === route.params.id)) {
        isUserItemLoading.value = true
        store.dispatch('getItem', { _id: route.params.id }).finally(() => (isUserItemLoading.value = false))
      } else {
        const currentUserItem = userItems.value.find((userItem: Item) => userItem._id === route.params.id)
        if (!currentUserItem) return

        // TODO: fix me!
        Object.assign(newItem, { ...currentUserItem })
        newItem.icons = [...currentUserItem.icons]
      }
    }

    watch(userItems, (newUserItemsValue) => {
      if (!route.params.id) return

      const currentUserItem = newUserItemsValue.find((userItem: Item) => userItem._id === route.params.id)
      if (!currentUserItem) return

      // TODO: fix me!
      Object.assign(newItem, { ...currentUserItem })
      newItem.icons = [...currentUserItem.icons]
    })

    const selectIcon = (selectedIcon: laundryIcon) => {
      const iconIndex = newItem.icons.findIndex((icon) => icon === selectedIcon._id)
      iconIndex !== -1 ? newItem.icons.splice(iconIndex, 1) : newItem.icons.push(selectedIcon._id)
    }

    const isIconSelected = (selectedIcon: laundryIcon) => {
      return newItem.icons.find((icon) => icon === selectedIcon._id)
    }

    const onAddImage = async (imgs: File[]) => {
      const compressorResult = new Promise((resolve: (value: Blob) => void, reject) => {
        new Compressor(imgs[0], {
          quality: 0.4,
          success: resolve,
          error: reject,
        })
      })

      try {
        const image = await compressorResult

        let formData = new FormData()
        formData.append('images', image)

        const imagesUrls = await request.post('/api/upload/items', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        newItem.images = imagesUrls.data.images
      } catch (error) {
        console.error(error)
      }
    }

    const onAddFileReject = (errors: Array<{ failedPropValidation: string; file: File }>) => {
      if (errors.find((error) => error.failedPropValidation === 'max-total-size')) {
        $q.notify({ type: 'negative', message: 'Max file size is 3 mb' })
      } else if (errors.find((error) => error.failedPropValidation === 'accept')) {
        $q.notify({ type: 'negative', message: 'Wrong file type' })
      }
    }

    const onSubmit = () => {
      $q.loading.show()

      if (route.params.id) {
        store
          .dispatch('editItem', { item: { ...newItem, _id: route.params.id } })
          .then(() => router.push('/'))
          .finally(() => $q.loading.hide())
      } else {
        store
          .dispatch('postItem', { item: newItem })
          .then(() => router.push('/'))
          .finally(() => $q.loading.hide())
      }
    }

    return {
      route,

      iconsByGroups,
      newItem,

      selectIcon,
      isIconSelected,
      onSubmit,
      onAddImage,
      onAddFileReject,
    }
  },
})
</script>

<style lang="scss" scoped>
.create-item-page {
  max-width: 1280px;
  margin: auto;
}

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

  @include media-small {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
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
  cursor: pointer;

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

.no-image {
  background: $grey-4;
}
</style>
