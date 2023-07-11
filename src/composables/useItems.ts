import { db } from '@/db'
import type { Item, ItemBlank } from '@/interfaces/item'
import type { UserSettings } from '@/interfaces/types'
import { useItemsStore } from '@/store/items'
import { useOfflineItemsStore } from '@/store/offlineItems'
import { useUserStore } from '@/store/user'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

export default function useItems() {
  const itemsStore = useItemsStore()
  const offlineItemsStore = useOfflineItemsStore()
  const { isOnline } = useUserStore()
  const userSettings = useLocalStorage<Partial<UserSettings>>('user-settings', {
    offlineMode: false,
  })

  const items = computed(() => [...itemsStore.items, ...offlineItemsStore.items])

  function isOfflineItem(id: string) {
    return id.includes('offline-')
  }

  async function getItems() {
    const requests = [offlineItemsStore.getItems()]

    if (!userSettings.value.offlineMode) {
      requests.push(itemsStore.getItems())
    }

    const items = await Promise.all(requests)
    return items.flat()
  }

  async function getItemById(payload: { _id: string }) {
    let item: Item | undefined

    if (isOfflineItem(payload._id)) {
      item = await offlineItemsStore.getItemById(payload)
    } else {
      if (isOnline) {
        item = await itemsStore.getItemById({ _id: payload._id })
      } else {
        const items = await itemsStore.getItems()
        item = items.find((_item) => _item._id === payload._id)
      }
    }

    return item
  }

  function createItem(payload: { item: ItemBlank }) {
    return userSettings.value.offlineMode ? offlineItemsStore.createItem(payload) : itemsStore.createItem(payload)
  }

  async function editItem(payload: { item: Omit<Item, 'updatedAt' | 'createdAt'> }) {
    if (isOfflineItem(payload.item._id)) {
      const offlineItem = await db.offlineItems.get({ _id: payload.item._id })
      if (offlineItem) {
        payload.item.images = payload.item.images.map((image, index) => {
          return image.includes('blob') ? offlineItem.images[index] : image
        })
      }
    }

    return isOfflineItem(payload.item._id) ? offlineItemsStore.editItem(payload) : itemsStore.editItem(payload)
  }

  function deleteItem(payload: { _id: string }) {
    return isOfflineItem(payload._id) ? offlineItemsStore.deleteItem(payload) : itemsStore.deleteItem(payload)
  }

  function uploadImage(payload: File) {
    return userSettings.value.offlineMode ? offlineItemsStore.uploadImage(payload) : itemsStore.uploadImage(payload)
  }

  return {
    items,

    isOfflineItem,
    getItems,
    getItemById,
    createItem,
    editItem,
    deleteItem,
    uploadImage,
  }
}
