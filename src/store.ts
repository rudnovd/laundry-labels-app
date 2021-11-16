import type { Item } from '@/interfaces/item'
import type { User } from '@/interfaces/user'
import request from '@/services/request'
import { LocalStorage, Notify } from 'quasar'
import { createStore } from 'vuex'

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
}

const store = createStore({
  actions: {
    async login({ state, commit }, payload: { email: string; password: string; token: string }): Promise<User> {
      try {
        const response = await request.post(
          '/auth/login',
          { email: payload.email, password: payload.password, token: payload.token },
          { withCredentials: true }
        )
        if (response.data.accessToken) {
          LocalStorage.set('accessToken', response.data.accessToken)
          LocalStorage.set('hasRefreshToken', true)
          commit('SET_USER', response.data.user)
        } else {
          throw throwStoreError({ response })
        }
      } catch (error) {
        throwStoreError(error)
      }

      return state.user
    },
    async registration({ state, commit }, payload: { email: string; password: string; token: string }): Promise<User> {
      try {
        const response = await request.post('/auth/registration', {
          email: payload.email,
          password: payload.password,
          token: payload.token,
        })
        if (response.data.accessToken) {
          LocalStorage.set('accessToken', response.data.accessToken)
          LocalStorage.set('hasRefreshToken', true)
          commit('SET_USER', response.data.user)
        } else {
          throw throwStoreError({ response })
        }
      } catch (error) {
        throw throwStoreError(error)
      }

      return state.user
    },
    async logout({ state, commit }): Promise<User> {
      try {
        await request.post('/auth/logout', {}, { withCredentials: true })
        LocalStorage.remove('accessToken')
        LocalStorage.remove('hasRefreshToken')
        commit('SET_USER', {})
      } catch (error) {
        throw throwStoreError(error)
      }

      return state.user
    },
    async getAuthFromRefreshToken({ state, commit }): Promise<{ user: User; accessToken: string }> {
      try {
        const response = await request.post('/auth/refreshtoken', {}, { withCredentials: true })
        if (response.data.accessToken) {
          LocalStorage.set('accessToken', response.data.accessToken)
          LocalStorage.set('hasRefreshToken', true)

          commit('SET_USER', response.data.user)
        }
        return { user: response.data.user, accessToken: response.data.accessToken }
      } catch (error) {
        LocalStorage.remove('hasRefreshToken')
      }

      return { user: state.user, accessToken: '' }
    },

    async getItems({ state, commit }): Promise<Array<Item>> {
      try {
        const response = await request.get('/api/items')

        commit('SET_ITEMS', response.data)
      } catch (error) {
        throw throwStoreError(error)
      }

      return state.items
    },
    async getItem({ state, commit }, payload: { _id: string }): Promise<{ item: Item; items: Array<Item> }> {
      try {
        const response = await request.get(`/api/item/${payload._id}`)

        commit('SET_ITEMS', [...state.items, response.data])
      } catch (error) {
        throw throwStoreError(error)
      }

      return { item: state.items[state.items.length - 1], items: state.items }
    },
    async postItem({ state, commit }, payload: { item: Item }): Promise<Array<Item>> {
      try {
        const response = await request.post('/api/items', payload.item)

        commit('SET_ITEMS', [...state.items, response.data])
      } catch (error) {
        throw throwStoreError(error)
      }

      return state.items
    },
    async editItem({ state, commit }, payload: { item: Item }): Promise<Array<Item>> {
      try {
        const response = await request.put(`/api/item/${payload.item._id}`, payload.item)

        commit('UPDATE_ITEMS', response.data)
      } catch (error) {
        throw throwStoreError(error)
      }

      return state.items
    },
    async deleteItem({ state, commit }, payload: { _id: string }): Promise<Array<Item>> {
      try {
        await request.delete(`/api/item/${payload._id}`)

        commit(
          'SET_ITEMS',
          state.items.filter((item: Item) => item._id !== payload._id)
        )
      } catch (error) {
        throw throwStoreError(error)
      }

      return state.items
    },
  },
  mutations: {
    SET_USER(state, user: User) {
      console.log('SET_USER', user)
      state.user = user
    },
    SET_ITEMS(state, items: Array<Item>) {
      state.items = items
    },
    UPDATE_ITEMS(state, item: Item) {
      const forUpdateItemIndex = state.items.findIndex((stateItems) => stateItems._id === item._id)
      if (forUpdateItemIndex) state.items.splice(forUpdateItemIndex, 1, item)
    },
  },
  state: {
    user: {} as User,
    items: [] as Array<Item>,
  },

  strict: process.env.NODE_ENV === 'development',
})

export default store