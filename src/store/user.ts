import type { User, UserLoginResponse, UserRefreshTokenResponse } from '@/interfaces/user'
import { setUserSettings, userSettings } from '@/localstorage'
import request from '@/services/request'
import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

interface UserState {
  user: User | Record<string, unknown>
  offlineMode: boolean
  isOnline: boolean

  options: {
    install: {
      event: any
      showInstallButton: boolean
    }
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: {},
    offlineMode: userSettings ? userSettings.offlineMode : true,
    isOnline: navigator.onLine,
    options: {
      install: {
        event: null,
        showInstallButton: false,
      },
    },
  }),
  actions: {
    async login(payload: { email: string; password: string; token: string }) {
      const response = await request
        .post('/api/auth/login', {
          json: { email: payload.email, password: payload.password, token: payload.token },
        })
        .json<UserLoginResponse>()
      LocalStorage.set('accessToken', response.accessToken)
      LocalStorage.set('hasRefreshToken', true)
      setUserSettings({ offlineMode: false })
      this.user = response.user

      return this.user
    },
    async registration(payload: { email: string; password: string; token: string }) {
      const response = await request
        .post('/api/auth/registration', {
          json: {
            email: payload.email,
            password: payload.password,
            token: payload.token,
          },
        })
        .json<UserLoginResponse>()
      LocalStorage.set('accessToken', response.accessToken)
      LocalStorage.set('hasRefreshToken', true)
      setUserSettings({ offlineMode: false })
      this.user = response.user

      return this.user
    },
    async logout() {
      await request.post('/api/auth/logout')
      LocalStorage.remove('accessToken')
      LocalStorage.remove('hasRefreshToken')
      setUserSettings({ offlineMode: true })
      this.user = {}

      return this.user
    },
    async getAuthFromRefreshToken() {
      try {
        const response = await request.post('/api/auth/refreshtoken').json<UserRefreshTokenResponse>()
        if (response.accessToken) {
          LocalStorage.set('accessToken', response.accessToken)
          LocalStorage.set('hasRefreshToken', true)
          this.user = response.user
        }

        return { user: response.user, accessToken: response.accessToken }
      } catch (error) {
        LocalStorage.remove('hasRefreshToken')
      }

      return { user: this.user, accessToken: '' }
    },
  },
})
