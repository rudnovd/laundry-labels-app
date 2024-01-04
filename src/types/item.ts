import type { InsertType, RowType } from './supabase'

export type Item = Omit<RowType<'items'>, 'owner'>
export type ItemBlank = InsertType<'items'>

export type ItemSymbol = RowType<'items_symbols'>
export type ItemTag = RowType<'items_tags'>
