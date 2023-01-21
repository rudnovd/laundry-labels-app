import type { User, UserLoginResponse, UserRefreshTokenResponse } from '@/interfaces/user'
import request from '@/services/request'
import type { JwtPayload } from 'jwt-decode'
import jwtDecode from 'jwt-decode'
import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

interface UserState {
  user: User | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
  }),
  actions: {
    async signIn(payload: { email: string; password: string; token: string }) {
      const response = await request
        .post('/auth/login', {
          json: { email: payload.email, password: payload.password, token: payload.token },
        })
        .json<UserLoginResponse>()
      LocalStorage.set('accessToken', response.accessToken)
      LocalStorage.set('hasRefreshToken', true)
      this.user = response.user

      return this.user
    },
    async signUp(payload: { email: string; password: string; token: string }) {
      const response = await request
        .post('/auth/registration', {
          json: {
            email: payload.email,
            password: payload.password,
            token: payload.token,
          },
        })
        .json<UserLoginResponse>()
      LocalStorage.set('accessToken', response.accessToken)
      LocalStorage.set('hasRefreshToken', true)
      this.user = response.user

      return this.user
    },
    async signOut() {
      await request.post('/auth/logout')
      LocalStorage.remove('accessToken')
      LocalStorage.remove('hasRefreshToken')
      this.user = null

      return this.user
    },
    async signInFromRefreshToken() {
      try {
        const response = await request.post('/auth/refreshtoken').json<UserRefreshTokenResponse>()
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
    signInFromAccessToken() {
      const accessToken = LocalStorage.getItem('accessToken')?.toString()
      if (accessToken) {
        this.user = jwtDecode<JwtPayload & { data: { _id: string } }>(accessToken).data
      }

      return { user: this.user, accessToken }
    },
  },
})
