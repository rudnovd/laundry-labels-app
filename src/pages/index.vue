<template>
  <section class="index-page">
    <header class="index-page-header">
      <LaundryIcon class="index-page-header__icon" />
      <nav v-if="!IS_OFFLINE_APP" class="index-page-header__links">
        <router-link class="button-link" to="/signin">
          {{ $t('common.signIn') }}
        </router-link>
        <router-link class="button-link" to="/signup">
          {{ $t('common.signUp') }}
        </router-link>
        <button class="icon-button" :title="$t('pages.home.share')" @click="share">
          <IconShare width="1.8em" height="1.8em" />
        </button>
      </nav>
    </header>
    <article class="index-page-content">
      <h1>Laundry<br>Labels<br>App</h1>
      <h2>{{ $t('pages.home.subtitle') }}</h2>
      <ul class="index-page-content__links">
        <li>
          <a class="button-link button-success" href="https://github.com/rudnovd/laundry-labels/releases/latest">
            {{ $t('pages.home.downloadAPK') }}
          </a>
        </li>
        <li>
          <router-link v-if="isOnboardingFinished" class="button-link button-success" :to="{ path: '/items' }">
            {{ $t('common.continue') }}
          </router-link>
          <router-link v-else class="button-link button-success" :to="{ path: '/items', query: { demo: 'true' } }">
            {{ $t('pages.home.tryInBrowser') }}
          </router-link>
        </li>
      </ul>
    </article>
  </section>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import IconShare from '~icons/mdi/share'
import { IS_OFFLINE_APP, IS_TAURI } from '@/constants'
import { IS_ONBOARDING_FINISHED_KEY } from '@/constants/onboarding'
import { useUserStore } from '@/stores/user'

definePage({
  meta: {
    isNavbarHidden: true,
  },
  async beforeEnter() {
    if (IS_OFFLINE_APP || IS_TAURI) {
      return '/items'
    }
    const userStore = useUserStore()
    const session = await userStore.getSession()
    const isSignedIn = !!userStore.user?.id || !!session
    return isSignedIn ? '/items' : true
  },
})

const LaundryIcon = defineAsyncComponent(() => import('@/assets/icons/logo.svg'))
const { t } = useI18n()
function share() {
  navigator.share({
    title: 'Laundry Labels',
    text: `Laundry Labels App - ${t('pages.home.subtitle')}`,
    url: '/',
  })
}
const isOnboardingFinished = localStorage.getItem(IS_ONBOARDING_FINISHED_KEY) === 'true'
</script>

<style>
.index-page {
  display: flex;
  flex-direction: column;
  color: oklch(94% 0.01 245deg);
  background: linear-gradient(
    135deg,
    oklch(50.34% 0.1439 147.6deg) 0%,
    oklch(34.25% 0.1736 301.49deg) 50%,
    oklch(50.34% 0.1439 147.6deg) 100%
  );
  .index-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .index-page-header__icon {
      width: 3em;
      height: 3em;
      padding: 0.25rem;
      background-color: var(--color-primary);
      border-radius: 4px;
    }
    .index-page-header__links {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      a {
        padding-inline: 8px;
        color: oklch(94% 0.01 245deg);
      }
    }
  }
  .index-page-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    h1 {
      margin: 0;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    .index-page-content__links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
}
</style>
