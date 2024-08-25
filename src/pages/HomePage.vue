<template>
  <q-page class="home-page">
    <header>
      <l-icon icon="logo" width="clamp(50px, 3vw, 80px)" height="clamp(50px, 3vw, 80px)" />
      <nav v-if="!IS_OFFLINE_APP">
        <q-btn :to="{ name: 'Sign in' }" :label="t('common.signIn')" flat />
        <q-btn :to="{ name: 'Sign up' }" :label="t('common.signUp')" flat />
        <q-btn icon="share" :title="t('pages.home.share')" flat @click="share" />
      </nav>
    </header>

    <div class="main-data">
      <article>
        <h1>Laundry Labels App</h1>
        <h2>{{ t('pages.home.subtitle') }}</h2>
        <ul class="app-buttons">
          <li>
            <q-btn
              :to="{ name: 'Items', query: { demo: 'true' } }"
              color="positive"
              :label="isBrowser ? t('pages.home.tryInBrowser') : t('common.continue')"
            />
          </li>
          <li>
            <a disabled>
              <l-icon icon="get-on-google-play" width="100%" height="100%" />
            </a>
          </li>
        </ul>
      </article>

      <div class="demo-image">
        <img src="pages/home/landing-phone.webp" alt="App" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { IS_OFFLINE_APP } from '@/constants'
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
const LIcon = defineAsyncComponent(() => import('@/components/LIcon.vue'))

const { t } = useI18n()

const isBrowser = window.matchMedia('(display-mode: browser)').matches

function share() {
  navigator.share({
    title: 'Laundry Labels App',
    text: `Laundry Labels App - ${t('pages.home.subtitle')}`,
    url: '/',
  })
}
</script>

<style>
.home-page {
  display: grid;
  grid-template-rows: auto 1fr;
  padding-top: 40px;
  color: rgb(255 255 255);
  background: linear-gradient(135deg, rgb(9 121 46) 0%, rgb(75 8 129) 50%, rgb(9 121 46) 100%);

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2vw;

    & > svg {
      padding: 8px;
      background-color: var(--color-brand);
      border-radius: 8px;
    }
  }

  .main-data {
    display: grid;

    @media (width >= 1024px) {
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

    a,
    svg {
      width: 180px;
      height: 53.3px;
    }
  }

  .demo-image {
    display: none;

    @media (width >= 1024px) {
      display: flex;
      align-items: end;
    }

    & > img {
      width: 100%;
    }
  }
}
</style>
