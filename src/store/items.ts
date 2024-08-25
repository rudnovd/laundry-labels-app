import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import type { Item, ItemBlank } from '@/types/item.ts'
import { useUserStore } from '@/store/user'
import { convertItem } from '@/utils/items'

interface ItemState {
  items: Array<Item>
}

export const useItemsStore = defineStore('items', {
  state: (): ItemState => ({
    items: [],
  }),
  actions: {
    async getItems(): Promise<Array<Item>> {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data: items, error } = await supabase!
        .from('items')
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .eq('owner', userStore.user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      this.items = items.map((item) => convertItem(item))
      return this.items
    },
    async getItemById(id: Item['id']): Promise<Item> {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data: item, error } = await supabase!
        .from('items')
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .eq('owner', userStore.user.id)
        .eq('id', id)
        .single()
      if (error) throw error
      const convertedItem = convertItem(item)
      this.items.push(convertedItem)
      return convertedItem
    },
    async createItem(itemBlank: ItemBlank): Promise<Item> {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data: item, error } = await supabase!
        .from('items')
        .insert({
          ...itemBlank,
          symbols: [...itemBlank.symbols],
          tags: [...itemBlank.tags],
          photos: [...itemBlank.photos],
          materials: itemBlank.materials,
          owner: userStore.user.id,
        })
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .single()
      if (error) throw error
      const convertedItem = convertItem(item)
      this.items.push(convertedItem)
      return convertedItem
    },
    async editItem(editedItem: Omit<Item, 'owner' | 'created_at' | 'updated_at'>): Promise<Array<Item>> {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data: updatedItem, error } = await supabase!
        .from('items')
        .update({
          ...editedItem,
          symbols: [...editedItem.symbols],
          tags: [...editedItem.tags],
          photos: [...editedItem.photos],
          materials: editedItem.materials,
          owner: userStore.user.id,
        })
        .eq('owner', userStore.user?.id)
        .eq('id', editedItem.id)
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .single()
      if (error) throw error
      const itemForUpdateIndex = this.items.findIndex(({ id }) => id === updatedItem.id)
      this.items.splice(itemForUpdateIndex, 1, convertItem(updatedItem))
      return this.items
    },
    async deleteItem(id: Item['id']): Promise<Array<Item>> {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { error } = await supabase!.from('items').delete().eq('owner', userStore.user?.id).eq('id', id)
      if (error) throw error
      const itemForDeleteIndex = this.items.findIndex((item) => item.id === id)
      this.items.splice(itemForDeleteIndex, 1)
      return this.items
    },
    async getPhoto(path: string) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const {
        data: { publicUrl },
      } = supabase!.storage.from('items').getPublicUrl(path)
      return publicUrl
    },
    async uploadPhoto(file: File | Blob) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data, error } = await supabase!.storage.from('items').upload(`${userStore.user.id}/${Date.now()}`, file)
      if (error) throw error
      return data.path
    },
  },
})
