import type { SignInWithOAuthCredentials, SignInWithPasswordCredentials, SignUpWithPasswordCredentials, User, UserAttributes } from '@supabase/supabase-js'
import type { Ref } from 'vue'
import type { Locale } from 'vue-i18n'
import { openUrl } from '@tauri-apps/plugin-opener'
import { useLocalStorage, useOnline } from '@vueuse/core'
import { defineStore } from 'pinia'
import { IS_OFFLINE_APP, IS_TAURI } from '@/constants'
import { getAppLocale, setLocale } from '@/i18n'
import { supabase } from '@/supabase'
import { useLaundryDataStore } from './laundryData'

interface UserSettings {
  locale: string
  offlineMode: boolean
  standardTagsLocale: string
}
interface UserState {
  user: User | null
  isOnline: Ref<boolean>
  settings: ReturnType<typeof useLocalStorage<UserSettings>>
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isOnline: useOnline(),
    settings: useLocalStorage<UserSettings>('settings', {
      locale: getAppLocale(),
      offlineMode: IS_OFFLINE_APP,
      standardTagsLocale: getAppLocale(),
    }),
  }),
  getters: {
    isAuthenticated: state => !!state.user?.id,
  },
  actions: {
    async signIn(payload: SignInWithPasswordCredentials) {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const { data: { user }, error } = await supabase.auth.signInWithPassword(payload)
      if (error) {
        throw error
      }
      this.user = user
      return this.user
    },
    async signInWithOAuth({ provider }: SignInWithOAuthCredentials): Promise<void> {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          skipBrowserRedirect: IS_TAURI,
          scopes: provider === 'google' ? 'profile email' : '',
          redirectTo: IS_TAURI ? 'laundrylabelsapp://auth/callback' : window.location.origin,
        },
      })
      if (error) {
        throw error
      }
      if (import.meta.env.VITE_IS_TAURI) {
        if (!data.url) {
          throw new Error('OAuth url is missing')
        }
        await openUrl(data.url)
      }
    },
    async getSession() {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        throw error
      }
      if (session) {
        this.user = session.user
      }
      return session
    },
    async signUp(credentials: SignUpWithPasswordCredentials) {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const { data: { user }, error } = await supabase.auth.signUp(credentials)
      if (error) {
        throw error
      }
      this.user = user
      return this.user
    },
    async sendEmailConfirmation(captchaToken: string) {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      if (!this.user?.email) {
        throw new Error('Email not found')
      }
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: this.user.email,
        options: {
          captchaToken,
          emailRedirectTo: window.location.origin,
        },
      })
      if (error) {
        throw error
      }
      return data.messageId
    },
    async signOut() {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      this.user = null
      return this.user
    },
    async resetPassword(payload: { email: string, captchaToken: string }) {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const { error } = await supabase.auth.resetPasswordForEmail(
        payload.email,
        {
          captchaToken: payload.captchaToken,
          redirectTo: `${window.location.origin}/reset-password/new-password`,
        },
      )
      if (error) {
        throw error
      }
    },
    async update(payload: UserAttributes) {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const { data: { user }, error } = await supabase.auth.updateUser(payload)
      if (error) {
        throw error
      }
      this.user = user
      return this.user
    },
    async refreshSession() {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        throw error
      }
      const { data: { user }, error: refreshSessionError } = await supabase.auth.refreshSession({ refresh_token: session?.refresh_token ?? '' })
      if (refreshSessionError) {
        throw refreshSessionError
      }
      this.user = user
      return this.user
    },
    async changeLocale(locale: Locale) {
      this.settings.locale = locale
      setLocale(locale)
    },
    async changeTagsLocale(locale: Locale) {
      this.settings.standardTagsLocale = locale
      const laundryDataStore = useLaundryDataStore()
      laundryDataStore.getStandardTags()
    },
  },
})
