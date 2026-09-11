import type { Item, ItemBlank } from '@/types/item.ts'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/supabase'

interface ItemState {
  items: Array<Item>
}

export const useItemsStore = defineStore('items', {
  state: (): ItemState => ({
    items: [],
  }),
  actions: {
    async getItems(): Promise<Array<Item>> {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const userStore = useUserStore()
      if (!userStore.user) {
        throw new Error('Authorization required')
      }
      const { data: items, error } = await supabase
        .from('items')
        .select('*')
        .eq('owner', userStore.user.id)
        .order('created_at', { ascending: false })
      if (error) {
        throw error
      }
      this.items = items
      return this.items
    },
    async getItemById(id: Item['id']): Promise<Item> {
      const userStore = useUserStore()
      if (!userStore.user) {
        throw new Error('Authorization required')
      }
      const { data: item, error } = await supabase!
        .from('items')
        .select('*')
        .eq('owner', userStore.user.id)
        .eq('id', id)
        .single()
      if (error) {
        throw error
      }
      this.items.push(item)
      return item
    },
    async createItem(itemBlank: ItemBlank): Promise<Item> {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const userStore = useUserStore()
      if (!userStore.user) {
        throw new Error('Authorization required')
      }
      const { data: item, error } = await supabase
        .from('items')
        .insert({
          ...itemBlank,
          symbols: [...itemBlank.symbols],
          tags: [...itemBlank.tags],
          photos: [...itemBlank.photos],
          materials: itemBlank.materials,
          owner: userStore.user.id,
        })
        .select('*')
        .single()
      if (error) {
        throw error
      }
      this.items.unshift(item)
      return item
    },
    async editItem(editedItem: Omit<Item, 'owner' | 'created_at' | 'updated_at'>): Promise<Array<Item>> {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const userStore = useUserStore()
      if (!userStore.user) {
        throw new Error('Authorization required')
      }
      const { id, ...itemData } = editedItem
      const { data: updatedItem, error } = await supabase!
        .from('items')
        .update({
          ...itemData,
          symbols: [...itemData.symbols],
          tags: [...itemData.tags],
          photos: [...itemData.photos],
          materials: itemData.materials,
          owner: userStore.user.id,
        })
        .eq('owner', userStore.user.id)
        .eq('id', editedItem.id)
        .select('*')
        .single()
      if (error) {
        throw error
      }
      const itemForUpdateIndex = this.items.findIndex(({ id }) => id === updatedItem.id)
      this.items.splice(itemForUpdateIndex, 1, updatedItem)
      return this.items
    },
    async deleteItem(id: Item['id']): Promise<Array<Item>> {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const userStore = useUserStore()
      if (!userStore.user) {
        throw new Error('Authorization required')
      }
      const { error } = await supabase.from('items').delete().eq('owner', userStore.user?.id).eq('id', id)
      if (error) {
        throw error
      }
      const itemForDeleteIndex = this.items.findIndex(item => item.id === id)
      this.items.splice(itemForDeleteIndex, 1)
      return this.items
    },
    async getPhoto(path: string) {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const userStore = useUserStore()
      if (!userStore.user) {
        throw new Error('Authorization required')
      }
      const { data: { publicUrl } } = supabase.storage.from('items').getPublicUrl(path)
      return publicUrl
    },
    async deletePhoto(path: string) {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const userStore = useUserStore()
      if (!userStore.user) {
        throw new Error('Authorization required')
      }
      const { error } = await supabase.storage.from('items').remove([path])
      if (error) {
        throw error
      }
      return true
    },
    async uploadPhoto(file: File | Blob) {
      if (!supabase) {
        throw new Error('Supabase not initialized')
      }
      const userStore = useUserStore()
      if (!userStore.user) {
        throw new Error('Authorization required')
      }
      const { data, error } = await supabase.storage.from('items').upload(`${userStore.user.id}/${Date.now()}`, file)
      if (error) {
        throw error
      }
      return data.path
    },
  },
})
