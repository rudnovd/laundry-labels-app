export type ItemFilterKey = 'search' | 'tags' | 'materials' | 'symbols'
export const ALLOWED_ITEM_FILTERS: ReadonlySet<ItemFilterKey> = new Set(['tags', 'materials', 'symbols', 'search'])
