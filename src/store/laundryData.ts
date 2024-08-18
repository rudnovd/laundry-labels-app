import i18n from '@/i18n'
import type { ItemMaterialName, ItemSymbol, ItemTag } from '@/types/item'
import { userSettingsStorage } from '@/utils/localStorage'
import { defineStore } from 'pinia'

interface LaundryDataState {
  symbols: Record<ItemSymbol['name'], { group: ItemSymbol['group']; description: string; short: string }>
  tags: Array<{ group: ItemTag['group']; items: Set<ItemTag['name']> }>
  materials: Array<ItemMaterialName>
}

export const useLaundryDataStore = defineStore('laundryData', {
  state: (): LaundryDataState => ({
    symbols: {},
    tags: [],
    materials: [],
  }),
  getters: {
    customTagGroup(): { group: ItemTag['group']; items: Set<ItemTag['name']> } {
      if (!this.tags.length) {
        return { group: i18n.global.t('components.item.inputItemTags.customTagGroup'), items: new Set() }
      }
      return this.tags[0]
    },
    tagsRecord(): Record<ItemTag['name'], ItemTag> {
      const tagsRecord: Record<ItemTag['name'], ItemTag> = {}
      for (const { group, items } of this.tags) {
        for (const tag of items) tagsRecord[tag] = { group, name: tag }
      }
      return tagsRecord
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
    async getStandardTags() {
      this.tags = []
      const standardTagsLocale = userSettingsStorage.value.items.standardTagsLocale
      const tags: Array<{ group: ItemTag['group']; items: Array<ItemTag['name']> }> = (
        await import(`../assets/data/tags/${standardTagsLocale}.ts`)
      ).default
      for (const { group, items } of tags) {
        this.tags.push({ group, items: new Set(items) })
      }
      return this.tags
    },
    async getStandardSymbols() {
      this.symbols = {}
      const locale = userSettingsStorage.value.locale
      const symbols: Record<string, { group: string; description: string; short: string }> = (
        await import(`../assets/data/laundry-symbols/${locale}.ts`)
      ).default
      this.symbols = symbols
      return this.symbols
    },
    async getStandardMaterials() {
      const locale = userSettingsStorage.value.locale
      const materials: Array<ItemMaterialName> = (await import(`../assets/data/materials/${locale}.ts`)).default
      this.materials = materials
      return this.materials
    },
  },
})
