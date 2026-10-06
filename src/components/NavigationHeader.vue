<template>
  <header class="navigation-header">
    <nav class="navigation-header__navigation">
      <router-link
        :class="{ hidden: route.path === '/items' }"
        class="button-link navigation-header__navigation-button-back"
        :to="previousPageLink"
      >
        <IconArrowLeft />
      </router-link>
      <div class="navigation-links">
        <router-link to="/items" class="navigation-links__home">
          <AppLogo width="2em" height="2em" />
          <span class="navigation-links__home-text">Laundry Labels</span>
        </router-link>
        <div class="navigation-links__right-side">
          <BaseTooltip v-if="userStore.settings.offlineMode">
            <template #activator>
              <div class="offline-mode">
                <template v-if="width > 400">
                  <IconCloudOff />
                  {{ $t('components.navigationHeader.offlineModeIsActive') }}
                </template>
                <template v-else>
                  {{ $t('components.navigationHeader.offlineMode') }}
                </template>
              </div>
            </template>
            {{ $t('components.navigationHeader.offlineTooltip') }}
          </BaseTooltip>
          <router-link class="button-link icon-button navigation-links__profile" to="/profile">
            <IconAccount />
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconAccount from '~icons/mdi/account'
import IconArrowLeft from '~icons/mdi/arrow-left'
import IconCloudOff from '~icons/mdi/cloud-off'
import { useUserStore } from '@/stores/user'
import BaseTooltip from './base/BaseTooltip.vue'

const AppLogo = defineAsyncComponent(() => import('../assets/icons/logo.svg'))

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { width } = useWindowSize()
const previousPageLink = computed<string>(() => {
  if (window.history.state.back === router.currentRoute.value.path) {
    return '/items'
  }
  else {
    return window.history.state.back || '/items'
  }
})
</script>

<style>
.navigation-header {
  display: flex;
  align-items: center;
  height: var(--header-height);
  padding-top: var(--navigation-header-padding-top);
  color: oklch(24.3% 0.024 249deg);
  background-color: var(--color-primary);
  .navigation-header__navigation {
    display: flex;
    align-items: center;
    width: 100%;
    height: inherit;
    .navigation-header__navigation-button-back {
      padding-inline: 4px;
      color: inherit;
    }
    .navigation-links {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      > div {
        display: flex;
        align-items: center;
      }
      svg {
        width: 1.5em;
        height: 1.5em;
      }
      a,
      button {
        color: inherit;
      }
      .navigation-links__home {
        display: flex;
        gap: 0.25rem;
        align-items: center;
        color: inherit;
        text-decoration: none;
        .navigation-links__home-text::first-letter {
          font-family: 'Comic Neue', Roboto, cursive;
          font-size: 1.2em;
          font-style: italic;
          font-weight: bold;
        }
      }
      .navigation-links__right-side {
        display: flex;
        gap: 0.25rem;
        .offline-mode {
          display: flex;
          align-items: center;
          padding: 2px;
          font-size: 0.625rem;
          font-weight: 500;
          border: 2px dashed oklch(24.3% 0.024 249deg);
          svg {
            width: 1.2em;
            height: 1.2em;
          }
        }
        .navigation-links__profile {
          padding-right: 4px;
        }
      }
    }
  }
}
</style>
