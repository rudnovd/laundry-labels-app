import type { Tables } from './supabase'

export type ItemSymbolGroup
  = | 'washing'
    | 'ironing'
    | 'bleaching'
    | 'tumble-drying'
    | 'natural-drying'
    | 'dry-cleaning'
    | 'wet-cleaning'

export type Item = Omit<Tables<'items'>, 'owner'>
export type ItemBlank = Omit<Tables<'items'>, 'id' | 'owner' | 'created_at' | 'updated_at'>

export interface ItemSymbol {
  readonly description: string
  readonly group: string
  readonly name: string
}
export type ItemMaterialName = string
export type ItemMaterialPercent = string
export type ItemMaterial = `${ItemMaterialName}-${ItemMaterialPercent}`
export type ItemTag = Tables<'items_tags'>
