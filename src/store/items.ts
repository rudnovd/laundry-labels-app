import type { Item, ItemBlank, ItemSymbol, ItemTag } from '@/types/item.ts'
import { supabase } from '@/supabase'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import Compressor from 'compressorjs'

interface ItemState {
  items: Array<Item>
  symbols: Record<string, { group: string; description: string }>
  tags: Record<string, { group: string; name: string }>
}

export const useItemsStore = defineStore('items', {
  state: (): ItemState => ({
    items: [],
    symbols: {},
    tags: {},
  }),
  getters: {
    tagsByGroups(): ReadonlyMap<string, Array<ItemTag>> {
      const tagsByGroups: Map<string, Array<ItemTag>> = new Map([])
      for (const tag in this.tags) {
        const group = this.tags[tag].group
        tagsByGroups.set(group, [...(tagsByGroups.get(group) ?? []), this.tags[tag]])
      }
      return tagsByGroups
    },
    symbolsByGroups(): ReadonlyMap<string, Array<ItemSymbol>> {
      const symbolsByGroups: Map<string, Array<ItemSymbol>> = new Map([
        ['washing', []],
        ['ironing', []],
        ['bleaching', []],
        ['tumble-drying', []],
        ['natural-drying', []],
        ['dry-cleaning', []],
        ['wet-cleaning', []],
      ])
      for (const symbolKey in this.symbols) {
        const symbol = this.symbols[symbolKey]
        symbolsByGroups.get(symbol.group)?.push({ ...symbol, name: symbolKey })
      }
      return symbolsByGroups
    },
  },
  actions: {
    async getItems() {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data, error } = await supabase
        .from('items')
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .eq('owner', userStore.user.id)
        .order('created_at', { ascending: false })
      if (error) throw error

      this.items = data

      return this.items
    },
    async getItemById(id: string) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data, error } = await supabase
        .from('items')
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .eq('owner', userStore.user.id)
        .eq('id', id)
        .single()
      if (error) throw error

      this.items.push(data)

      return data
    },
    async createItem(itemBlank: Omit<ItemBlank, 'owner'>) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')

      const { data, error } = await supabase
        .from('items')
        .insert({ ...itemBlank, owner: userStore.user.id })
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .single()
      if (error) throw error

      this.items.push(data)

      return data
    },
    async editItem(editedItem: Omit<Item, 'updated_at' | 'created_at' | 'owner'>) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data: updatedItem, error } = await supabase
        .from('items')
        .update(editedItem)
        .eq('owner', userStore.user?.id)
        .eq('id', editedItem.id)
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .single()
      if (error) throw error

      const itemForUpdateIndex = this.items.findIndex(({ id }) => id === updatedItem.id)
      this.items.splice(itemForUpdateIndex, 1, updatedItem)

      return this.items
    },
    async deleteItem(id: string) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { error } = await supabase.from('items').delete().eq('owner', userStore.user?.id).eq('id', id)
      if (error) throw error

      const itemForDeleteIndex = this.items.findIndex((item) => item.id === id)
      this.items.splice(itemForDeleteIndex, 1)

      return this.items
    },
    async uploadPhoto(file: File | Blob) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')

      const { data, error } = await supabase.storage.from('items').upload(`${userStore.user.id}/${Date.now()}`, file)
          if (error) throw error

      return data.path
    },
    async getStandardTags() {
      this.tags = {}
      const standardTagsLocale = userSettingsStorage.value.items.standardTagsLocale
      const tags: Array<{ group: string; items: Array<string> }> = (
        await import(`../assets/data/tags/${standardTagsLocale}.ts`)
      ).default
      for (const { items, group } of tags) {
        for (const tag of items) {
          this.tags[tag] = { name: tag, group }
        }
      }

      return this.tags
    },
    async getStandardSymbols() {
      this.symbols = {}
      const locale = userSettingsStorage.value.locale
      const symbols: Record<string, { group: string; description: string }> = (
        await import(`../assets/data/laundry-icons/${locale}.ts`)
      ).default
      this.symbols = symbols

      return this.symbols
    },
  },
})
