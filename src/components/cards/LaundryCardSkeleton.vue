<template>
  <!-- TODO: v-ripple error (https://github.com/quasarframework/quasar/issues/13154)  -->
  <q-card class="laundry-card" flat bordered>
    <q-card-section horizontal class="full-height">
      <q-skeleton class="col-4" height="100%" square />

      <q-card-section class="col-8 column laundry-card-body">
        <q-skeleton type="rect" />

        <ul class="icons">
          <li v-for="i in 6" :key="`skeleton-icon-${i}`">
            <q-skeleton width="16px" height="16px" type="rect" />
          </li>
        </ul>

        <div class="laundry-card-body-footer">
          <q-skeleton type="QChip" />
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.laundry-card {
  width: 100%;
  max-width: 500px;
  height: 180px;
  cursor: pointer;
  user-select: none;
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
    height: 36px;
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
