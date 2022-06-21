<template>
  <!-- TODO: v-ripple error (https://github.com/quasarframework/quasar/issues/13154)  -->
  <q-card class="laundry-card" flat bordered @click="router.push(`/item/${item._id}`)">
    <q-card-section horizontal class="full-height">
      <q-img v-if="item.images.length" class="col-5" :src="item.images[0]" />

      <q-card-section
        :class="item.images.length ? 'col-7' : 'col-12'"
        class="q-pa-sm column justify-between laundry-card-body"
      >
        <div class="icons row full-width" :class="!item.images.length && 'no-image'">
          <ul>
            <li v-for="icon in iconsValues.slice(0, item.images.length ? 6 : 8)" :key="icon._id">
              <q-icon tag="li" :name="icon.icon" class="laundry-card-icon" size="2.2em" />
            </li>
          </ul>
        </div>

        <div v-if="item.tags.length" class="row no-wrap overflow-auto full-width q-pb-sm">
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
  height: 150px;
}

.icons {
  ul {
    width: 100%;
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(32px, 1fr));
    gap: 0.5rem;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $grey-6;
    border-radius: 4px;
    height: 32px;
  }
}

.icons.no-image {
  ul {
    grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
  }
}
</style>
