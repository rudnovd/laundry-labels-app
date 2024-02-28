import type { Item, ItemBlank, ItemSymbol, ItemTag } from '@/types/item.ts'
import { supabase } from '@/supabase'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import Compressor from 'compressorjs'

interface ItemState {
  items: Array<Item>
  symbols: Array<ItemSymbol>
  tags: Array<ItemTag>
}

export const useItemsStore = defineStore('items', {
  state: (): ItemState => ({
    items: [],
    symbols: [],
    tags: [],
  }),
  getters: {
    tagsByGroups(): Record<string, Array<string>> {
      return this.tags.reduce((tags: Record<string, Array<string>>, tag: ItemTag) => {
        if (!tags[tag.group]) {
          tags[tag.group] = []
        }
        tags[tag.group].push(tag.name)
        return tags
      }, {})
    },
    symbolsByGroups(): Record<string, Array<ItemSymbol>> {
      return this.symbols.reduce((symbols: Record<string, Array<ItemSymbol>>, symbol: ItemSymbol) => {
        if (!symbols[symbol.group]) {
          symbols[symbol.group] = []
        }
        symbols[symbol.group].push(symbol)
        return symbols
      }, {})
    },
  },
  actions: {
    async getItems() {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data, error } = await supabase
        .from('items')
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .eq('owner', userStore.user?.id)
        .order('created_at', { ascending: false })
      if (error) throw error

      this.items = data

      return this.items
    },
    async getItemById(payload: { id: string }) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data, error } = await supabase
        .from('items')
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .eq('owner', userStore.user?.id)
        .eq('id', payload.id)
        .single()
      if (error) throw error

      this.items.push(data)

      return data
    },
    async createItem(payload: { item: ItemBlank }) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data, error } = await supabase
        .from('items')
        .insert({ ...payload.item, owner: userStore.user?.id })
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .single()
      if (error) throw error

      this.items.push(data)

      return data
    },
    async editItem(payload: { item: Omit<Item, 'updatedAt' | 'createdAt'> }) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data: updatedItem, error } = await supabase
        .from('items')
        .update(payload.item)
        .eq('owner', userStore.user?.id)
        .eq('id', payload.item.id)
        .select('id, name, symbols, tags, photos, materials, created_at, updated_at')
        .single()
      if (error) throw error

      const itemForUpdateIndex = this.items.findIndex(({ id }) => id === updatedItem.id)
      this.items.splice(itemForUpdateIndex, 1, updatedItem)

      return this.items
    },
    async deleteItem(payload: { id: string }) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('owner', userStore.user?.id)
        .eq('id', payload.id)
      if (error) throw error

      const itemForDeleteIndex = this.items.findIndex((item) => item.id === payload.id)
      this.items.splice(itemForDeleteIndex, 1)

      return this.items
    },
    async uploadImage(payload: File) {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')

      let url = ''
      new Compressor(payload, {
        quality: 0.3,
        mimeType: 'image/webp',
        async success(result) {
          const { data, error } = await supabase.storage
            .from('items')
            .upload(`${userStore.user?.id}/${payload.name}`, result)
          if (error) throw error

          url = data.path
        },
      })

      return url
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
