import type { RowType } from './supabase'

export type DatabaseItem = RowType<'items'>

export interface Item {
  readonly id: string
  readonly name: string | null
  readonly symbols: Set<string>
  readonly photos: Set<string>
  readonly materials: Array<ItemMaterial>
  readonly tags: Set<string>
  readonly created_at: string
  readonly updated_at: string | null
}
export interface ItemBlank {
  name: string | null
  symbols: Set<string>
  photos: Set<string>
  materials: Array<ItemMaterial>
  tags: Set<string>
}

export interface ItemSymbol {
  description: string
  group: string
  name: string
}
export type ItemMaterial = `${string}-${string}`
export type ItemTag = RowType<'items_tags'>
