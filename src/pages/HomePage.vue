<template>
  <q-page class="welcome-page q-pa-sm">
    <q-btn color="primary" label="Sign in" icon="login" :to="{ name: 'Sign in' }" />
    <q-btn color="primary" label="Sign up" icon="person" :to="{ name: 'Sign up' }" />
  </q-page>
</template>

<style lang="scss" scoped>
.buttons-section {
  display: grid;
  justify-content: center;
  gap: 1rem;

  button,
  a {
    max-width: 300px;
  }
}
</style>
