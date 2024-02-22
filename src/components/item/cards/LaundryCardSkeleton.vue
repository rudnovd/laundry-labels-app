<template>
  <div class="laundry-card-skeleton">
    <div class="laundry-card-data">
      <q-skeleton type="rect" class="title-container" />

      <ul class="symbols">
        <li v-for="symbol in 7" :key="symbol">
          <q-skeleton width="48px" height="48px" type="rect" />
        </li>
      </ul>

      <ul class="tags">
        <li v-for="tag in 6" :key="tag">
          <q-skeleton type="QChip" />
        </li>
      </ul>
    </div>
    <q-skeleton class="col-4" height="100%" square />
  </div>
</template>

<style>
.laundry-card-skeleton {
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 7fr 3fr;
  gap: 8px;
  height: clamp(180px, 20vw, 250px);
  border: 1px solid rgb(224 224 224);
  border-radius: 8px;
}

.laundry-card-skeleton .laundry-card-data {
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  gap: 4px;
  padding: 8px 0 8px 8px;

  .title-container {
    display: flex;
    flex-wrap: nowrap;
    gap: 4px;
    align-items: center;
    overflow: hidden;

    .title {
      overflow: hidden;
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 2rem;
      text-overflow: ellipsis;
      letter-spacing: 0.0125em;
      white-space: nowrap;
    }
  }

  .symbols,
  .tags {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    padding: 0;
    padding-bottom: 6px;
    margin: 0;
    overflow-x: auto;
    list-style-type: none;
    scrollbar-width: none;
  }

  .tags {
    align-items: end;
  }

  .symbols li {
    display: flex;
    justify-content: center;
    cursor: help;
    border: 1px solid rgb(224 224 224);
    border-radius: 12px;
  }
}
</style>
