<template>
  <q-card class="laundry-card" flat bordered @click="router.push(`/item/${item._id}`)">
    <q-card-section horizontal class="full-height">
      <q-img v-if="item.images.length" class="col-4" :src="item.images[0]" />

      <q-card-section
        :class="item.images.length ? 'col-8' : 'col-12'"
        class="q-px-sm q-pt-sm q-pb-none column laundry-card-body"
      >
        <div class="item-name q-mb-sm">{{ item.name }}</div>

        <div class="icons row full-width q-mb-sm" :class="!item.images.length && 'no-image'">
          <ul>
            <li
              v-for="icon in iconsValues.slice(0, item.images.length ? 6 : 8)"
              :key="icon._id"
              @click="(e) => e.stopPropagation()"
            >
              <q-icon tag="svg" :name="icon._id" size="2.6em">
                <q-tooltip :anchor="'top middle'" :offset="[0, 36]">
                  {{ icon.description }}
                </q-tooltip>
              </q-icon>
            </li>
          </ul>
        </div>

        <div v-if="item.tags.length" class="row no-wrap overflow-auto overflow-hidden-y full-width q-pb-sm">
          <q-chip v-for="tag in item.tags" :key="tag">{{ tag }}</q-chip>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { laundryIcons } from '@/assets/laundryIcons'
import type { Item } from '@/interfaces/item'
import { useRouter } from 'vue-router'

const props = defineProps<{
  item: Item
}>()

const router = useRouter()

const iconsValues = laundryIcons.filter((icon) => props.item.icons.indexOf(icon._id) !== -1)
</script>

<style lang="scss" scoped>
.laundry-card {
  width: 100%;
  user-select: none;
  max-width: 500px;
  height: 180px;
  cursor: pointer;
}

.item-name {
  height: 1.2em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.laundry-card-body {
  flex-wrap: nowrap;
}

.icons {
  overflow: hidden;
  max-height: 80px;

  ul {
    width: 100%;
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template: repeat(2, 1fr) / repeat(3, minmax(36px, 1fr));
    gap: 0.5rem;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $grey-6;
    border-radius: 4px;
    height: 36px;
    cursor: help;
  }
}

.icons.no-image {
  ul {
    grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
  }
}

:deep(.q-icon > img) {
  pointer-events: none;
}
</style>
