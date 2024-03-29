import { computed } from 'vue'
import Compressor from 'compressorjs'
import { useItemsStore } from '@/store/items'
import { useOfflineItemsStore } from '@/store/offlineItems'
import { userSettingsStorage } from '@/utils/localStorage'

export default function useItems() {
  const itemsStore = useItemsStore()
  const offlineItemsStore = useOfflineItemsStore()

  const items = computed(() => [...itemsStore.items, ...offlineItemsStore.items])
  const symbols = computed(() => itemsStore.symbols)
  const tags = computed(() => itemsStore.tags)
  const symbolsByGroups = computed(() => itemsStore.symbolsByGroups)
  const tagsByGroups = computed(() => itemsStore.tagsByGroups)

  function compressPhoto(file: File | Blob) {
    return new Promise<File | Blob>((resolve, reject) => {
      new Compressor(file, {
        quality: 0.3,
        mimeType: 'image/webp',
        convertSize: 2_097_152,
        success: resolve,
        error: reject,
      })
    })
  }

  function isOfflineItem(id: string) {
    return id.includes('offline-')
  }

  async function getItems() {
    const requests = [offlineItemsStore.getItems()]
    if (!userSettingsStorage.value.offlineMode) requests.push(itemsStore.getItems())
    const items = await Promise.all(requests)
    return items.flat()
  }

  async function getItemById(id: Parameters<typeof itemsStore.getItemById>[0]) {
    return isOfflineItem(id) ? await offlineItemsStore.getItemById(id) : await itemsStore.getItemById(id)
  }

  function createItem(itemBlank: Parameters<typeof itemsStore.createItem>[0]) {
    return userSettingsStorage.value.offlineMode
      ? offlineItemsStore.createItem(itemBlank)
      : itemsStore.createItem(itemBlank)
  }

  async function editItem(editedItem: Parameters<typeof itemsStore.editItem>[0]) {
    return isOfflineItem(editedItem.id) ? offlineItemsStore.editItem(editedItem) : itemsStore.editItem(editedItem)
  }

  function deleteItem(id: Parameters<typeof itemsStore.deleteItem>[0]) {
    return isOfflineItem(id) ? offlineItemsStore.deleteItem(id) : itemsStore.deleteItem(id)
  }

  function getPhoto(path: Parameters<typeof itemsStore.getPhoto>[0]) {
    return isOfflineItem(path) ? offlineItemsStore.getPhoto(path) : itemsStore.getPhoto(path)
  }

  async function uploadPhoto(file: Parameters<typeof itemsStore.uploadPhoto>[0]) {
    const compressedFile = await compressPhoto(file)
    return userSettingsStorage.value.offlineMode
      ? offlineItemsStore.uploadPhoto(compressedFile)
      : itemsStore.uploadPhoto(compressedFile)
  }

  return {
    items,
    tags,
    symbols,
    symbolsByGroups,
    tagsByGroups,

    isOfflineItem,
    getItems,
    getItemById,
    createItem,
    editItem,
    deleteItem,
    uploadPhoto,
    getPhoto,
  }
}
