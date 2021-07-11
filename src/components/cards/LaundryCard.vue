<template>
  <div v-ripple class="laundry-card" @click="router.push(`/item/${userItem.id}`)">
    <q-img
      :src="userItem.images[0]"
      loading="lazy"
      decoding="async"
      height="100%"
      :alt="userItem.name ? userItem.name : userItem.type"
    />

    <section class="laundry-card-body">
      <span>{{ userItem.name }}</span>

      <ul>
        <li v-for="icon in userItem.laundryIcons.slice(0, 6)" :key="icon.code">
          <q-icon tag="li" :name="icon.icon" />
        </li>
      </ul>

      <div class="laundry-card-body-footer">
        <div>
          <span class="item-type">{{ userItem.type }}</span>
          <span v-if="userItem.color" class="item-color" :style="{ background: userItem.color.value }" />
        </div>

        <q-btn flat color="primary" label="Details" :to="`/item/${userItem.id}`" size="md" no-wrap padding="0" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { userItem } from '@/interfaces/userItem'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LaundryCard',
  props: {
    userItem: {
      type: Object as () => userItem,
      required: true,
    },
  },
  setup() {
    return {
      router: useRouter(),
    }
  },
})
</script>

<style lang="scss" scoped>
.laundry-card {
  background: rgb(255, 255, 255);
  border-radius: 4px;
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 4fr;
  grid-template-rows: 150px;
  user-select: none;
}

.laundry-card-body {
  padding: 8px;
  display: grid;
  grid-template-rows: 1rem auto;
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
  align-items: center;
  justify-content: space-between;

  div:first-child {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .item-type {
    max-width: 9ch;
  }

  .item-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }

  a {
    width: 64px;
  }
}
</style>
