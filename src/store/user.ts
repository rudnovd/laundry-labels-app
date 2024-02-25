import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useOnline } from '@vueuse/core'
import { supabase } from '@/supabase'
import type { Provider, User, UserAttributes } from '@supabase/supabase-js'
import type { UserSignInCredentials, UserSignUpCredentials } from '@/types/user'

interface UserState {
  user: User | null
  isOnline: Ref<boolean>
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isOnline: useOnline(),
  }),
  actions: {
    async signIn(payload: UserSignInCredentials) {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword(payload)
      if (error) throw error

      this.user = user

      return this.user
    },
    async signInWithOAuth(options: { provider: Provider }) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: options.provider,
      })
      if (error) throw error
    },
    async getSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
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
      } = await supabase.auth.signUp(credentials)
      if (error) throw error

      this.user = user

      return this.user
    },
    async signOut() {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      this.user = null

      return this.user
    },
    async resetPassword(payload: { email: string; captchaToken: string }) {
      const { error } = await supabase.auth.resetPasswordForEmail(payload.email, {
        captchaToken: payload.captchaToken,
      })
      if (error) throw error
    },
    async update(payload: UserAttributes) {
      const {
        data: { user },
        error,
      } = await supabase.auth.updateUser(payload)
      if (error) throw error

      this.user = user

      return this.user
    },
    async refreshSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) throw error
      const {
        data: { user },
        error: refreshSessionError,
      } = await supabase.auth.refreshSession({ refresh_token: session?.refresh_token ?? '' })
      if (refreshSessionError) throw refreshSessionError

      this.user = user

      return this.user
    },
  },
})
