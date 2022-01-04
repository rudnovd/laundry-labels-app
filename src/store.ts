import { db } from '@/db'
import type { Item, ItemBlank } from '@/interfaces/item'
import type { User, UserLoginResponse, UserRefreshTokenResponse } from '@/interfaces/user'
import request from '@/services/request'
import Dexie from 'dexie'
import { createPinia, defineStore } from 'pinia'
import { LocalStorage, Notify, uid } from 'quasar'
import { setUserSettings, userSettings } from './localstorage'

interface State {
  user: User | Record<string, unknown>
  offlineMode: boolean
  isOnline: boolean
  items: Array<Item>
  offlineItems: Array<Item>

  options: {
    install: {
      event: any
      showInstallButton: boolean
    }
  }
}

export const store = createPinia()

export class RequestError extends Error {
  constructor(name: string, message: string) {
    super()
    this.name = name
    this.message = message
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throwStoreError(error: { name: string; message: string }) {
  const requestError = new RequestError(error.name, error.message)
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
    offlineMode: userSettings.offlineMode,
    isOnline: navigator.onLine,
    items: [],
    offlineItems: [],
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
    async getItems() {
      this.items = await db.items.toArray()
      this.offlineItems = await db.offlineItems.toArray()

      if (!this.offlineMode) {
        const items = await request.get('/api/items').json<Array<Item>>()
        await db.items.clear()
        await db.items.bulkAdd(items)
        this.items = await db.items.toArray()
      }

      return { items: this.items, offlineItems: this.offlineItems }
    },
    async getItem(payload: { _id: string }) {
      let item: Item | undefined

      // if offline item in offlineItems database
      if (payload._id.indexOf('offline-') !== -1) {
        item = await db.offlineItems.get({ _id: payload._id })
      } else {
        item = await db.items.get({ _id: payload._id })
      }

      // if offline mode disabled and item not found in items database
      if (!this.offlineMode && !item) {
        item = await request.get(`/api/item/${payload._id}`).json<Item>()
        if (!item) return { item, items: this.items }
        await db.items.add(item)
        this.items = await db.items.toArray()
      }

      return { item, items: this.items }
    },
    async postItem(payload: { item: ItemBlank }) {
      if (this.offlineMode) {
        const newOfflineItem: Item = {
          ...payload.item,
          _id: `offline-${uid()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        const newIndex = await db.offlineItems.add(Dexie.deepClone(newOfflineItem))
        this.offlineItems = await db.offlineItems.toArray()
        return await db.offlineItems.get(newIndex)
      }

      const newItem = await request.post('/api/items', { json: payload.item }).json<Item>()
      await db.items.add(newItem)
      this.items = await db.items.toArray()
      return newItem
    },
    async editItem(payload: { item: Omit<Item, 'createdAt' | 'updatedAt'> }) {
      if (payload.item._id.indexOf('offline-') !== -1) {
        await db.offlineItems.update(payload.item._id, Dexie.deepClone(payload.item))
        this.offlineItems = await db.offlineItems.toArray()
        return this.offlineItems
      }

      const response = await request.put(`/api/item/${payload.item._id}`, { json: payload.item }).json<Item>()
      db.items.put(response)
      this.items = await db.items.toArray()
      return this.items
    },
    async deleteItem(payload: { _id: string }) {
      if (payload._id.indexOf('offline-') !== -1) {
        db.offlineItems.delete(payload._id)
        this.offlineItems = await db.offlineItems.toArray()
        return this.offlineItems
      }

      await request.delete(`/api/item/${payload._id}`)
      db.items.delete(payload._id)
      this.items = await db.items.toArray()
      return this.items
    },
  },
})

store.use(({ store }) => {
  store.$onAction(({ onError }) => {
    // catch errors for all store actions
    onError((response) => {
      if (response instanceof Dexie.DexieError) {
        const error = { error: { name: response.message, message: response.message } }
        throwStoreError(error.error)
      } else {
        const error = response as { error: { name: string; message: string } }
        throwStoreError(error.error)
      }
    })
  })
})
