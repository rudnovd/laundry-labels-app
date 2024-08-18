import type { RowType } from './supabase'

export type DatabaseItem = RowType<'items'>

export interface Item {
  readonly id: string
  readonly name: string | null
  readonly symbols: Set<string>
  readonly photos: Array<string>
  readonly materials: Array<ItemMaterial>
  readonly tags: Set<string>
  readonly created_at: string
  readonly updated_at: string | null
}
export interface ItemBlank {
  name: string | null
  symbols: Set<string>
  photos: Array<string>
  materials: Array<ItemMaterial>
  tags: Set<string>
}

export interface ItemSymbol {
  readonly description: string
  readonly group: string
  readonly name: string
}
export type ItemMaterialName = string
export type ItemMaterialPercent = string
export type ItemMaterial = `${ItemMaterialName}-${ItemMaterialPercent}`
export type ItemTag = RowType<'items_tags'>
