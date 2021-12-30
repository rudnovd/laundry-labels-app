import type { Item, ItemBlank } from '@/interfaces/item'
import type { User } from '@/interfaces/user'
import request from '@/services/request'
import { defineStore } from 'pinia'
import { LocalStorage, Notify } from 'quasar'

interface State {
  user: User | Record<string, unknown>
  items: Array<Item>
}

export class RequestError extends Error {
  constructor(name: string, message: string) {
    super()
    this.name = name
    this.message = message
    // Error.captureStackTrace(this, this.constuctor)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throwStoreError(error: any) {
  const errorObject = error.response.data.error as { name: string; message: string }
  const requestError = new RequestError(errorObject.name, errorObject.message)
  console.error(`${requestError.name}: ${requestError.message}`)
  Notify.create({
    type: 'negative',
    message: requestError.message,
    timeout: 5000,
  })
  throw requestError
}

export const useStore = defineStore('data', {
  state: (): State => ({
    user: {},
    items: [],
  }),
  actions: {
    async login(payload: { email: string; password: string; token: string }) {
      try {
        const response = await request.post(
          '/api/auth/login',
          { email: payload.email, password: payload.password, token: payload.token },
          { withCredentials: true }
        )
        if (response.data.accessToken) {
          LocalStorage.set('accessToken', response.data.accessToken)
          LocalStorage.set('hasRefreshToken', true)
          this.user = response.data.user
        } else {
          throw throwStoreError({ response })
        }
      } catch (error) {
        throwStoreError(error)
      }

      return this.user
    },
    async registration(payload: { email: string; password: string; token: string }) {
      try {
        const response = await request.post('/api/auth/registration', {
          email: payload.email,
          password: payload.password,
          token: payload.token,
        })
        if (response.data.accessToken) {
          LocalStorage.set('accessToken', response.data.accessToken)
          LocalStorage.set('hasRefreshToken', true)
          this.user = response.data.user
        } else {
          throw throwStoreError({ response })
        }
      } catch (error) {
        throw throwStoreError(error)
      }

      return this.user
    },
    async logout() {
      try {
        await request.post('/api/auth/logout', {}, { withCredentials: true })
        LocalStorage.remove('accessToken')
        LocalStorage.remove('hasRefreshToken')
        this.user = {}
      } catch (error) {
        throw throwStoreError(error)
      }

      return this.user
    },
    async getAuthFromRefreshToken() {
      try {
        const response = await request.post('/api/auth/refreshtoken', {}, { withCredentials: true })
        if (response.data.accessToken) {
          LocalStorage.set('accessToken', response.data.accessToken)
          LocalStorage.set('hasRefreshToken', true)
          this.user = response.data.user
        }

        return { user: response.data.user, accessToken: response.data.accessToken }
      } catch (error) {
        LocalStorage.remove('hasRefreshToken')
      }

      return { user: this.user, accessToken: '' }
    },
    async getItems() {
      try {
        const response = await request.get('/api/items')
        this.items = response.data
      } catch (error) {
        throw throwStoreError(error)
      }

      return this.items
    },
    async getItem(payload: { _id: string }) {
      try {
        const response = await request.get(`/api/item/${payload._id}`)
        this.items = [...this.items, response.data]
      } catch (error) {
        throw throwStoreError(error)
      }

      return { item: this.items[this.items.length - 1], items: this.items }
    },
    async postItem(payload: { item: ItemBlank }) {
      try {
        const response = await request.post('/api/items', payload.item)
        this.items = [...this.items, response.data]
      } catch (error) {
        throw throwStoreError(error)
      }

      return this.items
    },
    async editItem(payload: { item: Omit<Item, 'createdAt' | 'updatedAt'> }) {
      try {
        const response = await request.put(`/api/item/${payload.item._id}`, payload.item)
        const forUpdateItemIndex = this.items.findIndex((stateItems) => stateItems._id === response.data._id)
        if (forUpdateItemIndex) this.items = this.items.splice(forUpdateItemIndex, 1, response.data._id)
      } catch (error) {
        throw throwStoreError(error)
      }

      return this.items
    },
    async deleteItem(payload: { _id: string }) {
      try {
        await request.delete(`/api/item/${payload._id}`)
        this.items = this.items.filter((item: Item) => item._id !== payload._id)
      } catch (error) {
        throw throwStoreError(error)
      }

      return this.items
    },
  },
})
