<template>
  <q-layout v-if="$q.platform.is.mobile" container>
    <q-header class="bg-light-green-5 text-white">
      <q-toolbar>
        <q-btn v-show="showBackButton" icon="arrow_back" flat no-wrap padding="0" @click="router.back()" />
        <q-toolbar-title class="flex items-center justify-between">
          <q-btn flat icon="sell" label="Laundry Labels" to="/" :ripple="false" padding="0" />
          <q-btn flat icon="person" to="/profile" :ripple="false" padding="0" />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- <q-footer v-if="user" bordered class="bg-light-green-5 text-white" elevated>
      <q-tabs v-model="tab" inline-label>
        <q-route-tab name="Laundry" icon="home" label="Home" to="/" />
        <q-route-tab name="Profile" icon="person" label="Profile" to="/profile" />
      </q-tabs>
    </q-footer> -->

    <main>
      <q-page-container class="full-height">
        <router-view />
      </q-page-container>
    </main>
  </q-layout>

  <q-layout v-if="$q.platform.is.desktop">
    <main>
      <q-page-container>
        <router-view />
      </q-page-container>
    </main>
  </q-layout>
</template>

<script lang="ts">
// import { getAuth } from '@firebase/auth'
import { useQuasar } from 'quasar'
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const laundryIcons: { [key: string]: string } = {
  'app:laundry-icon-bleaching': `img:/icons/laundry/wh-bleaching.svg`,
  'app:laundry-icon-iron': `img:/icons/laundry/wh-iron.svg`,
  'app:laundry-icon-washing-90deg': `img:/icons/laundry/wh-washing-90deg.svg`,
}

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()

    // const user = computed(() => getAuth().currentUser)

    const showBackButton = computed(() => ['/', '/welcome'].indexOf(route.path) === -1)

    $q.iconMapFn = (iconName) => {
      const icon = laundryIcons[iconName]
      if (icon !== void 0) return { icon }
    }

    return {
      router,
      // tab: ref('Home'),
      // user,
      showBackButton,
    }
  },
})
</script>

<style>
@import '~@/styles/main.scss';
</style>
