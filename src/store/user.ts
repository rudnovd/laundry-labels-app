import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useOnline } from '@vueuse/core'
import { supabase } from '@/supabase'
import type { Provider, User, UserAttributes } from '@supabase/supabase-js'
import type { UserSignInCredentials, UserSignUpCredentials } from '@/types/user'
import { IS_OFFLINE_APP } from '@/constants'
import { userSettingsStorage } from '@/utils/localStorage'

interface UserState {
  user: User | null
  isOnline: Ref<boolean>
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isOnline: useOnline(),
  }),
  getters: {
    isAuthenticated: (state) => !!state.user?.id && !IS_OFFLINE_APP,
    isOfflineMode: () => !!userSettingsStorage.value.offlineMode,
  },
  actions: {
    async signIn(payload: UserSignInCredentials) {
      const {
        data: { user },
        error,
      } = await supabase!.auth.signInWithPassword(payload)
      if (error) throw error

      this.user = user

      return this.user
    },
    async signInWithOAuth(options: { provider: Provider }) {
      const { error } = await supabase!.auth.signInWithOAuth({
        provider: options.provider,
        options: { redirectTo: window.location.origin },
      })
      if (error) throw error
    },
    async getSession() {
      const {
        data: { session },
        error,
      } = await supabase!.auth.getSession()
      if (error) throw error
      if (session) {
        this.user = session.user
      }

      return session
    },
    async signUp(credentials: UserSignUpCredentials) {
      const {
        data: { user },
        error,
      } = await supabase!.auth.signUp(credentials)
      if (error) throw error

      this.user = user

      return this.user
    },
    async sendEmailConfirmation(captchaToken: string) {
      if (!this.user?.email) throw new Error('Email not found')
      const { data, error } = await supabase!.auth.resend({
        type: 'signup',
        email: this.user.email,
        options: {
          captchaToken,
          emailRedirectTo: window.location.origin,
        },
      })
      if (error) throw error

      return data.messageId
    },
    async signOut() {
      const { error } = await supabase!.auth.signOut()
      if (error) throw error

      this.user = null

      return this.user
    },
    async resetPassword(payload: { email: string; captchaToken: string }) {
      const { error } = await supabase!.auth.resetPasswordForEmail(payload.email, {
        captchaToken: payload.captchaToken,
      })
      if (error) throw error
    },
    async update(payload: UserAttributes) {
      const {
        data: { user },
        error,
      } = await supabase!.auth.updateUser(payload)
      if (error) throw error

      this.user = user

      return this.user
    },
    async refreshSession() {
      const {
        data: { session },
        error,
      } = await supabase!.auth.getSession()
      if (error) throw error
      const {
        data: { user },
        error: refreshSessionError,
      } = await supabase!.auth.refreshSession({ refresh_token: session?.refresh_token ?? '' })
      if (refreshSessionError) throw refreshSessionError

      this.user = user

      return this.user
    },
  },
})
