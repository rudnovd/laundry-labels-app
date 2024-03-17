import { defineStore } from 'pinia'
import { date } from 'quasar'
import Dexie from 'dexie'
import { db } from '@/db'
import type { DatabaseItem, Item, ItemBlank } from '@/types/item.ts'
import { convertItem } from '@/utils/items'

interface ItemState {
  items: Array<Item>
}

export const useOfflineItemsStore = defineStore('offlineItems', {
  state: (): ItemState => ({
    items: [],
  }),
  actions: {
    async getItems(): Promise<Array<Item>> {
      const items = await db.offlineItems.orderBy('updated_at').toArray()
      this.items = items.map((item) => convertItem(item))
      return this.items
    },
    async getItemById(id: Item['id']): Promise<Item> {
      const item = await db.offlineItems.get({ id })
      if (!item) throw new Error(`Item with id ${id} not found`)
      const convertedItem = convertItem(item)
      this.items.push(convertedItem)
      return convertedItem
    },
    async createItem(itemBlank: ItemBlank): Promise<Item> {
      const newOfflineItem: Omit<DatabaseItem, 'owner'> = Dexie.deepClone({
        id: `offline-${Date.now()}`,
        name: itemBlank.name ?? null,
        symbols: [...itemBlank.symbols],
        tags: [...itemBlank.tags],
        photos: [...itemBlank.photos],
        materials: [...itemBlank.materials],
        created_at: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS'),
        updated_at: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS'),
      })
      await db.offlineItems.add(newOfflineItem)
      const newConvertedItem = convertItem(newOfflineItem)
      this.items.push(newConvertedItem)
      return newConvertedItem
    },
    async editItem(editedItem: Omit<Item, 'owner' | 'created_at' | 'updated_at'>): Promise<Array<Item>> {
      const databaseEditedItem = {
        ...editedItem,
        symbols: [...editedItem.symbols],
        tags: [...editedItem.tags],
        photos: [...editedItem.photos],
        materials: [...editedItem.materials],
        updated_at: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS'),
      }
      await db.offlineItems.update(editedItem.id, Dexie.deepClone(databaseEditedItem))
      const item = await db.offlineItems.get({ id: editedItem.id })
      if (!item) throw new Error(`Item with id ${editedItem.id} not found`)
      const itemForUpdateIndex = this.items.findIndex((item) => item.id === editedItem.id)
      this.items[itemForUpdateIndex].photos.forEach((photo) => URL.revokeObjectURL(photo))
      this.items.splice(itemForUpdateIndex, 1, convertItem(item))
      return this.items
    },
    async deleteItem(id: Item['id']): Promise<Array<Item>> {
      const item = await db.offlineItems.get({ id })
      if (!item) throw new Error(`Item with id ${id} not found`)
      await db.offlineItems.delete(id)
      item.photos.forEach((id) => db.upload.delete(id))
      const items = await db.offlineItems.toArray()
      this.items = items.map((item) => convertItem(item))
      return this.items
    },
    async getPhoto(id: string) {
      const item = await db.upload.get({ id })
      if (!item) throw new Error(`Photo with id ${id} not found`)
      return URL.createObjectURL(item.file)
    },
    async uploadPhoto(file: File | Blob) {
      const id = `offline-${Date.now()}`
      await db.upload.add({ id, file })
      return id
    },
  },
})
