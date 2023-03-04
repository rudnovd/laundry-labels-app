<template>
  <q-page class="home-page">
    <header>
      <l-icon icon="logo" width="clamp(50px, 3vw, 80px)" height="clamp(50px, 3vw, 80px)" />
      <nav>
        <q-btn :to="{ name: 'Sign in' }" :label="t('landing.signIn')" flat />
        <q-btn :to="{ name: 'Sign up' }" :label="t('landing.signUp')" flat />
        <q-btn icon="share" :title="t('landing.share')" flat @click="share" />
      </nav>
    </header>

    <section class="main-data">
      <article>
        <h1>{{ t('landing.appName') }}</h1>
        <h2>{{ t('landing.subtitle') }}</h2>
        <section class="app-buttons">
          <q-btn
            :to="{ name: 'Sign up' }"
            color="positive"
            :label="isBrowser ? t('landing.tryInBrowser') : t('landing.continue')"
          />
          <a disabled>
            <l-icon icon="get-on-google-play" width="100%" height="100%" />
          </a>
        </section>
      </article>

      <section class="demo-image">
        <img src="pages/home/landing-phone.webp" alt="App" />
      </section>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import LIcon from '@/components/LIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isBrowser = window.matchMedia('(display-mode: browser)').matches

const share = () => {
  navigator.share({
    title: 'Laundry Labels App',
    text: 'Save data on how to take care of your clothes',
    url: '/',
  })
}
</script>

<style lang="scss" scoped>
.home-page {
  display: grid;
  grid-template-rows: auto 1fr;
  padding-top: 40px;
  color: rgb(255, 255, 255);
  background: linear-gradient(135deg, rgba(9, 121, 46, 1) 0%, rgba(75, 8, 129, 1) 50%, rgba(9, 121, 46, 1) 100%);
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2vw;

  & > svg {
    padding: 8px;
    background-color: $brand;
    border-radius: 8px;
  }
}

.main-data {
  display: grid;
  grid-template-columns: 1fr;

  @include media-medium {
    grid-template-columns: 1fr 40vw;
  }

  & > article {
    padding-bottom: 40px;
    padding-left: 2vw;
  }
}

.app-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;

  & > a,
  svg {
    width: 180px;
    height: 53.3px;
  }
}

.demo-image {
  display: none;

  @include media-medium {
    display: flex;
    align-items: flex-end;
  }

  & > img {
    width: 100%;
  }
}
</style>
