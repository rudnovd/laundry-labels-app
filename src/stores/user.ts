import type { Provider, User, UserAttributes } from '@supabase/supabase-js'
import type { Ref } from 'vue'
import type { UserSignInCredentials, UserSignUpCredentials } from '@/types/user'
import { useLocalStorage, useOnline } from '@vueuse/core'
import { defineStore } from 'pinia'
import { IS_OFFLINE_APP } from '@/constants'
import { getAppLocale } from '@/i18n'
import { supabase } from '@/supabase'

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
    isAuthenticated: state => !!state.user?.id && !IS_OFFLINE_APP,
  },
  actions: {
    async signIn(payload: UserSignInCredentials) {
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
    async signInWithOAuth(options: { provider: Provider }) {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: options.provider,
        options: { redirectTo: window.location.origin },
      })
      if (error) {
        throw error
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
    async signUp(credentials: UserSignUpCredentials) {
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
  },
})
