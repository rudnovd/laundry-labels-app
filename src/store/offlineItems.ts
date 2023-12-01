import { db } from '@/db'
import type { Item, ItemBlank } from '@/interfaces/item'
import Dexie from 'dexie'
import { defineStore } from 'pinia'
import { date, uid } from 'quasar'

interface ItemState {
  items: Array<Item>
}

async function getItemImages(payload: { _id: string }) {
  const item = await db.offlineItems.get(payload._id)
  if (!item) {
    return []
  }

  const imagesPromises: Array<
    Promise<
      | {
          _id: string
          file: File
        }
      | undefined
    >
  > = []
  item.images.forEach((_id) => imagesPromises.push(db.upload.get({ _id })))

  const uploadItems = await Promise.all(imagesPromises)
  const images: Array<string> = []

  uploadItems.forEach((uploadItem) => {
    if (uploadItem?.file) {
      images.push(URL.createObjectURL(uploadItem.file))
    }
  })

  return images
}

export const useOfflineItemsStore = defineStore('offlineItems', {
  state: (): ItemState => ({
    items: [],
  }),
  actions: {
    async getItems() {
      this.items = await db.offlineItems.orderBy('updatedAt').toArray()

      const imagesPromises: Array<Promise<string[]>> = []
      this.items.forEach((item) => {
        imagesPromises.push(getItemImages({ _id: item._id }))
      })
      const images = await Promise.all(imagesPromises)
      this.items.forEach((item, index) => {
        item.images = images[index]
      })

      return this.items
    },
    async getItemById(payload: { _id: string }) {
      const item = await db.offlineItems.get({ _id: payload._id })
      if (item) {
        item.images = await getItemImages({ _id: item._id })
        this.items.push(item)
      }

      return item
    },
    async createItem(payload: { item: ItemBlank }) {
      const newOfflineItem: Item = {
        ...payload.item,
        _id: `offline-${uid()}`,
        createdAt: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS'),
        updatedAt: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS'),
      }

      await db.offlineItems.add(Dexie.deepClone(newOfflineItem))

      newOfflineItem.images = await getItemImages({ _id: newOfflineItem._id })

      this.items.push(newOfflineItem)

      return newOfflineItem
    },
    async editItem(payload: { item: Omit<Item, 'updatedAt' | 'createdAt'> }) {
      await db.offlineItems.update(
        payload.item._id,
        Dexie.deepClone({ ...payload.item, updatedAt: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS') }),
      )

      const item = await db.offlineItems.get({ _id: payload.item._id })
      if (!item) {
        return this.items
      }

      const itemForUpdateIndex = this.items.findIndex((item) => item._id === payload.item._id)
      this.items[itemForUpdateIndex].images.forEach((image) => URL.revokeObjectURL(image))

      this.items.splice(itemForUpdateIndex, 1, item)
      this.items[itemForUpdateIndex].images = await getItemImages({ _id: payload.item._id })

      return this.items
    },
    async deleteItem(payload: { _id: string }) {
      const item = await db.offlineItems.get({ _id: payload._id })
      if (item) {
        await db.offlineItems.delete(payload._id)
        item.images.forEach((_id) => db.upload.delete(_id))
        this.items = await db.offlineItems.toArray()
      }
      return this.items
    },
    async uploadImage(payload: File) {
      const uploadId = `offline-${uid()}`
      await db.upload.add({
        _id: uploadId,
        file: payload,
      })
      return {
        _id: uploadId,
        file: payload,
      }
    },
  },
})
