<template>
  <q-page class="home-page bg-positive text-weight-bold">
    <section>
      <h1 class="text-h4">Laundry Labels App</h1>
      <q-btn color="primary" label="Sign in" icon="login" :to="{ name: 'Sign in' }" />
      <q-btn color="primary" label="Sign up" icon="person" :to="{ name: 'Sign up' }" />
    </section>
  </q-page>
</template>

<style lang="scss" scoped>
.home-page {
  display: flex;
  align-items: center;
  justify-content: center;

  & > section:first-child {
    display: grid;
    gap: 1rem;
    justify-content: center;

    a {
      max-width: 300px;
    }
  }
}
</style>
