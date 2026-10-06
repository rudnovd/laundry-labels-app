import { RegleVuePlugin } from '@regle/core'
import VWave from 'v-wave'
import { createApp } from 'vue'
import App from '@/App.vue'
import { getAppLocale, i18n, setLocale } from '@/i18n'
import { router } from '@/router'
import { IS_ONBOARDING_FINISHED_KEY } from './constants/onboarding'
import pinia from './stores'
import { useUserStore } from './stores/user'
import { supabase } from './supabase'

setLocale(getAppLocale()).then(async () => {
  const app = createApp(App)
  app.use(pinia)
  const userStore = useUserStore()
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      userStore.user = session.user
    }
  }
  app.use(router)
  const isOnboardingFinished = localStorage.getItem(IS_ONBOARDING_FINISHED_KEY) === 'true'
  if (!isOnboardingFinished) {
    localStorage.setItem(IS_ONBOARDING_FINISHED_KEY, 'false')
  }
  app.use(VWave, { color: '#7cc6ff', initialOpacity: 0.5, easing: 'ease-in' })
  app.use(RegleVuePlugin)
  app.use(i18n).mount('#app')
})
