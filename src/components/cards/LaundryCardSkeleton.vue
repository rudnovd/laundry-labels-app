<template>
  <div v-ripple class="laundry-card">
    <q-skeleton height="100%" square />

    <section class="laundry-card-body">
      <q-skeleton type="text" />

      <ul>
        <li v-for="i in 6" :key="`skeleton-icon-${i}`">
          <q-skeleton width="16px" height="16px" type="rect" />
        </li>
      </ul>

      <div class="laundry-card-body-footer">
        <q-skeleton type="QBtn" height="16px" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LaundryCardSkeleton',
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
  max-width: 500px;
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

  a {
    width: 64px;
  }
}
</style>
