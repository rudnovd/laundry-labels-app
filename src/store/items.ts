import type { Item, ItemBlank } from '@/interfaces/item'
import request from '@/services/request'
import { defineStore } from 'pinia'

interface ItemState {
  items: Array<Item>
}

export const useItemsStore = defineStore('items', {
  state: (): ItemState => ({
    items: [],
  }),
  actions: {
    async get() {
      this.items = await request.get('/api/items').json<Array<Item>>()
      return this.items
    },
    async getById(payload: { _id: string }) {
      const item = await request.get(`/api/item/${payload._id}`).json<Item>()
      this.items.push(item)
      return item
    },
    async create(payload: { item: ItemBlank }) {
      const newItem = await request.post('/api/items', { json: payload.item }).json<Item>()
      this.items.push(newItem)
      return newItem
    },
    async edit(payload: { item: Omit<Item, 'updatedAt' | 'createdAt'> }) {
      const editedItem = await request.put(`/api/item/${payload.item._id}`, { json: payload.item }).json<Item>()
      const itemForUpdateIndex = this.items.findIndex((item) => item._id === payload.item._id)
      this.items[itemForUpdateIndex] = editedItem
      return this.items
    },
    async delete(payload: { _id: string }) {
      await request.delete(`/api/item/${payload._id}`)
      const itemForDeleteIndex = this.items.findIndex((item) => item._id === payload._id)
      this.items.splice(itemForDeleteIndex, 1)
      return this.items
    },
    async uploadImage(payload: { image: Blob }) {
      const formData = new FormData()
      formData.append('images', payload.image)
      const images = await request
        .post('/api/upload/items', {
          body: formData,
        })
        .json<{ images: Array<string> }>()

      return images
    },
  },
})
