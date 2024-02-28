import { defineStore } from 'pinia'
import { date } from 'quasar'
import Dexie from 'dexie'
import { db } from '@/db'
import type { Item, ItemBlank } from '@/types/item'

interface ItemState {
  items: Array<Item>
}

export const useOfflineItemsStore = defineStore('offlineItems', {
  state: (): ItemState => ({
    items: [],
  }),
  actions: {
    async getItems() {
      this.items = await db.offlineItems.orderBy('updated_at').toArray()

      return this.items
    },
    async getItemById(id: string) {
      const item = await db.offlineItems.get({ id })
      if (!item) {
        throw new Error(`Item with id ${id} not found`)
      }
      this.items.push(item)

      return item
    },
    async createItem(itemBlank: Omit<ItemBlank, 'owner'>) {
      const newOfflineItem: Item = {
        ...itemBlank,
        name: itemBlank.name ?? null,
        id: `offline-${Date.now()}`,
        created_at: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS'),
        updated_at: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS'),
      }
      await db.offlineItems.add(Dexie.deepClone(newOfflineItem))
      this.items.push(newOfflineItem)

      return newOfflineItem
    },
    async editItem(editedItem: Omit<Item, 'updated_at' | 'created_at' | 'owner'>) {
      await db.offlineItems.update(
        editedItem.id,
        Dexie.deepClone({ ...editedItem, updated_at: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS') }),
      )

      const item = await db.offlineItems.get({ id: editedItem.id })
      if (!item) return this.items

      const itemForUpdateIndex = this.items.findIndex((item) => item.id === editedItem.id)
      this.items[itemForUpdateIndex].photos.forEach((photo) => URL.revokeObjectURL(photo))
      this.items.splice(itemForUpdateIndex, 1, item)

      return this.items
    },
    async deleteItem(id: string) {
      const item = await db.offlineItems.get({ id })
      if (item) {
        await db.offlineItems.delete(id)
        item.photos.forEach((id) => db.upload.delete(id))
        this.items = await db.offlineItems.toArray()
      }

      return this.items
    },
    async getPhoto(id: string) {
      const item = await db.upload.get({ id })

      if (!item) return null
      return URL.createObjectURL(item.file)
    },
    async uploadPhoto(file: File | Blob) {
      const id = `offline-${Date.now()}`
      await db.upload.add({ id, file })

      return id
    },
  },
})
