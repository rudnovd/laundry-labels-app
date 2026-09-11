import type { Item, ItemBlank } from '@/types/item'
import Dexie from 'dexie'
import { defineStore } from 'pinia'
import { db } from '@/db'
import 'temporal-polyfill/global'

interface ItemState {
  items: Array<Item>
}

export const useOfflineItemsStore = defineStore('offlineItems', {
  state: (): ItemState => ({
    items: [],
  }),
  actions: {
    async getItems(): Promise<Array<Item>> {
      const items = await db.offlineItems.reverse().toArray()
      this.items = items
      return this.items
    },
    async getItemById(id: Item['id']): Promise<Item> {
      const item = await db.offlineItems.get({ id })
      if (!item) {
        throw new Error(`Item with id ${id} not found`)
      }
      this.items.push(item)
      return item
    },
    async createItem(itemBlank: ItemBlank): Promise<Item> {
      const now = Temporal.PlainDate.from(Temporal.Now.plainDateTimeISO('UTC'))
      const newOfflineItem: Item = Dexie.deepClone({
        id: `offline-${Temporal.Now.instant().epochMilliseconds}`,
        name: itemBlank.name ?? null,
        symbols: [...itemBlank.symbols],
        tags: [...itemBlank.tags],
        photos: [...itemBlank.photos],
        materials: itemBlank.materials,
        created_at: now.toString(),
        updated_at: null,
      })
      await db.offlineItems.add(newOfflineItem)
      this.items.unshift(newOfflineItem)
      return newOfflineItem
    },
    async editItem(editedItem: Omit<Item, | 'created_at' | 'updated_at'>): Promise<Array<Item>> {
      const now = Temporal.PlainDate.from(Temporal.Now.plainDateTimeISO('UTC'))
      const databaseEditedItem = {
        ...editedItem,
        symbols: [...editedItem.symbols],
        tags: [...editedItem.tags],
        photos: [...editedItem.photos],
        materials: editedItem.materials,
        updated_at: now.toString(),
      }
      await db.offlineItems.update(editedItem.id, Dexie.deepClone(databaseEditedItem))
      const item = await db.offlineItems.get({ id: editedItem.id })
      if (!item) {
        throw new Error(`Item with id ${editedItem.id} not found`)
      }
      const itemForUpdateIndex = this.items.findIndex(item => item.id === editedItem.id)
      this.items[itemForUpdateIndex].photos.forEach(URL.revokeObjectURL)
      this.items.splice(itemForUpdateIndex, 1, item)
      return this.items
    },
    async deleteItem(id: Item['id']): Promise<Array<Item>> {
      const item = await db.offlineItems.get({ id })
      if (!item) {
        throw new Error(`Item with id ${id} not found`)
      }
      await db.offlineItems.delete(id)
      const items = await db.offlineItems.toArray()
      this.items = items
      return this.items
    },
    async getPhoto(id: string) {
      const item = await db.upload.get({ id })
      if (!item) {
        throw new Error(`Photo with id ${id} not found`)
      }
      return URL.createObjectURL(item.file)
    },
    async deletePhoto(id: string) {
      const item = await db.upload.get({ id })
      if (!item) {
        throw new Error(`Photo with id ${id} not found`)
      }
      return await db.upload.delete(id)
    },
    async uploadPhoto(file: File | Blob) {
      const id = `offline-${Temporal.Now.instant().epochMilliseconds}`
      await db.upload.add({ id, file })
      return id
    },
  },
})
