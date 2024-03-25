import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import type { Item, ItemBlank, ItemSymbol, ItemTag } from '@/types/item.ts'
import { useUserStore } from '@/store/user'
import { userSettingsStorage } from '@/utils/localStorage'
import { convertItem } from '@/utils/items'

interface ItemState {
  items: Array<Item>
  symbols: Record<string, { group: string; description: string }>
  tags: Record<string, { group: string; name: string }>
  materials: Array<string>
}

export const useItemsStore = defineStore('items', {
  state: (): ItemState => ({
    items: [],
    symbols: {},
    tags: {},
    materials: [],
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
        ['bleaching', []],
        ['ironing', []],
        ['tumble-drying', []],
        ['dry-cleaning', []],
        ['wet-cleaning', []],
        ['natural-drying', []],
      ])
      for (const symbolKey in this.symbols) {
        const symbol = this.symbols[symbolKey]
        symbolsByGroups.get(symbol.group)?.push({ ...symbol, name: symbolKey })
      }
      return symbolsByGroups
    },
  },
  actions: {
    async getItems(): Promise<Array<Item>> {
      const userStore = useUserStore()
      if (!userStore.user) throw new Error('Authorization required')
      const { data: items, error } = await supabase
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
      const { data: item, error } = await supabase
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
      const { data: item, error } = await supabase
        .from('items')
        .insert({
          ...itemBlank,
          symbols: [...itemBlank.symbols],
          tags: [...itemBlank.tags],
          photos: [...itemBlank.photos],
          materials: [...itemBlank.materials],
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
      const { data: updatedItem, error } = await supabase
        .from('items')
        .update({
          ...editedItem,
          symbols: [...editedItem.symbols],
          tags: [...editedItem.tags],
          photos: [...editedItem.photos],
          materials: [...editedItem.materials],
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
      const { error } = await supabase.from('items').delete().eq('owner', userStore.user?.id).eq('id', id)
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
      } = supabase.storage.from('items').getPublicUrl(path)
      return publicUrl
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
        for (const tag of items) this.tags[tag] = { name: tag, group }
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
    async getStandardMaterials() {
      const locale = userSettingsStorage.value.locale
      const materials: Array<string> = (await import(`../assets/data/materials/${locale}.ts`)).default
      this.materials = materials
      return this.materials
    },
    // TODO: remove after migration date is over
    async getMigrationItems() {
      const userStore = useUserStore()
      if (!userStore.user?.email) throw new Error('Authorization required')
      const { data, error } = await supabase
        .from('items_migration')
        .select('items, migration_date')
        .eq('owner_email', userStore.user.email)
        .single()
      if (error) throw error
      return data
    },
    // TODO: remove after migration date is over
    async updateMigrationDate() {
      const userStore = useUserStore()
      if (!userStore.user?.email) throw new Error('Authorization required')
      const { data, error } = await supabase
        .from('items_migration')
        .update({ migration_date: new Date().toISOString() })
        .eq('owner_email', userStore.user.email)
        .select('migration_date')
      if (error) throw error
      return data
    },
  },
})
