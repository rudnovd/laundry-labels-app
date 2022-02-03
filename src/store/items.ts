import { db } from '@/db'
import type { Item, ItemBlank } from '@/interfaces/item'
import request from '@/services/request'
import { useUserStore } from '@/store/user'
import Dexie from 'dexie'
import { defineStore } from 'pinia'
import { uid } from 'quasar'

interface ItemState {
  items: Array<Item>
  offlineItems: Array<Item>
}

export const useItemsStore = defineStore('items', {
  state: (): ItemState => ({
    items: [],
    offlineItems: [],
  }),
  actions: {
    async getItems() {
      const user = useUserStore()

      this.items = await db.items.toArray()

      const offlineItems = await db.offlineItems.toArray()
      for (const offlineItem of offlineItems) {
        const itemImages = await db.itemsImages.where({ itemId: offlineItem._id }).toArray()
        offlineItem.images = itemImages.map((image) => URL.createObjectURL(image.image))
      }
      this.offlineItems = offlineItems

      if (!user.offlineMode) {
        const items = await request.get('/api/items').json<Array<Item>>()
        await db.items.clear()
        await db.items.bulkAdd(items)
        this.items = await db.items.toArray()
      }

      return { items: this.items, offlineItems: this.offlineItems }
    },
    async getItem(payload: { _id: string }) {
      const user = useUserStore()
      let item: Item | undefined

      // if offline item in offlineItems database
      if (payload._id.indexOf('offline-') !== -1) {
        item = await db.offlineItems.get({ _id: payload._id })

        if (item) {
          const itemImages = await db.itemsImages.where({ itemId: payload._id }).toArray()
          item.images = itemImages.map((itemImage) => URL.createObjectURL(itemImage.image))
        }
      } else {
        item = await db.items.get({ _id: payload._id })
      }

      // if offline mode disabled and item not found in items database
      if (!user.offlineMode && !item) {
        item = await request.get(`/api/item/${payload._id}`).json<Item>()
        if (!item) return { item, items: this.items }
        await db.items.add(item)
        this.items = await db.items.toArray()
      }

      return { item, items: this.items }
    },
    async postItem(payload: { item: ItemBlank }) {
      const user = useUserStore()

      if (user.offlineMode) {
        const _id = `offline-${uid()}`
        const newOfflineItem: Item = {
          ...payload.item,
          _id,
          createdAt: new Date(),
          updatedAt: new Date(),
          images: [],
        }
        const newIndex = await db.offlineItems.add(Dexie.deepClone(newOfflineItem))
        this.offlineItems = await db.offlineItems.toArray()

        if (payload.item.images.length) {
          const currentImages = await db.itemsImages.where({ imageUrl: payload.item.images[0] }).toArray()
          await db.itemsImages.update(currentImages[0], { itemId: _id })
        }
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
        const itemImages = await db.itemsImages.where({ itemId: payload._id }).primaryKeys()
        itemImages.forEach((image) => db.itemsImages.delete(image))
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
