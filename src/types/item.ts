import type { InsertType, RowType } from './supabase'

export type Item = Omit<RowType<'items'>, 'owner'>
export type ItemBlank = InsertType<'items'>

export interface ItemSymbol {
  description: string
  group: string
  name: string
}
export type ItemTag = RowType<'items_tags'>

// export type ItemSymbolKey = 'wash' | 'mild-wash' | 'very-mild-wash' | 'hand-wash' | 'do-not-wash' | 'wash-cold' |
