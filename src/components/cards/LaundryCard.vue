<template>
  <div v-ripple class="laundry-card" @click="router.push(`/item/${item._id}`)">
    <q-img
      :class="{ 'no-image': !item.images.length }"
      :src="item.images && item.images[0]"
      loading="lazy"
      decoding="async"
      height="100%"
      :alt="item._id"
    />

    <section class="laundry-card-body">
      <ul>
        <li v-for="icon in iconsValues.slice(0, 6)" :key="icon._id">
          <q-icon tag="li" :name="`img:${icon.path}`" />
        </li>
      </ul>

      <div v-if="item.tags.length" class="laundry-card-body-footer">
        <q-chip v-for="tag in item.tags" :key="tag">{{ tag }}</q-chip>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { laundryIcons } from '@/assets/laundryIcons'
import type { Item } from '@/interfaces/item'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LaundryCard',
  props: {
    item: {
      type: Object as () => Item,
      required: true,
    },
  },
  setup(props) {
    const iconsValues = laundryIcons.filter((icon) => props.item.icons.indexOf(icon._id) !== -1)

    return {
      router: useRouter(),
      iconsValues,
    }
  },
})
</script>

<style lang="scss" scoped>
.laundry-card {
  background: rgb(255, 255, 255);
  border-radius: 4px;
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%),
    0 3px 1px -2px rgb(0 0 0 / 12%);
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 4fr;
  grid-template-rows: 150px;
  user-select: none;
  max-width: 500px;
}

.laundry-card-body {
  padding: 8px;
  display: grid;
  gap: 12px;

  span:first-child {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    overflow: hidden;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 32px 32px;
    grid-auto-rows: 0;
    overflow-y: hidden;
    max-height: calc(64px + 0.5rem);
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

  li img {
    font-size: 1.75rem;
  }
}

.laundry-card-body-footer {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  height: 48px;
}

.no-image {
  background: $grey-4;
}
</style>
