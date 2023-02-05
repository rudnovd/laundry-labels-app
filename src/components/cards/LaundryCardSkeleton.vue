<template>
  <!-- TODO: v-ripple error (https://github.com/quasarframework/quasar/issues/13154)  -->
  <div class="laundry-card">
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

<style lang="scss" scoped>
.laundry-card {
  position: relative;
  display: grid;
  grid-template-rows: 150px;
  grid-template-columns: 3fr 4fr;
  width: 100%;
  max-width: 500px;
  user-select: none;
  background: rgb(255, 255, 255);
  border-radius: 4px;
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
}

.laundry-card-body {
  display: grid;
  grid-template-rows: 1rem auto;
  gap: 12px;
  padding: 8px;

  span:first-child {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  ul {
    display: grid;
    grid-template-rows: 32px 32px;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    border: 1px solid $grey-6;
    border-radius: 4px;
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
    gap: 4px;
    align-items: center;
  }

  .item-type {
    max-width: 9ch;
  }

  a {
    width: 64px;
  }
}
</style>
