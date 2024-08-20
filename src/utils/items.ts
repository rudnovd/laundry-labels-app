import type { DatabaseItem, Item, ItemTag } from '@/types/item'

export function convertItem(item: Omit<DatabaseItem, 'owner'>): Item {
  return {
    id: item.id,
    name: item.name,
    symbols: new Set(item.symbols),
    tags: new Set(item.tags),
    photos: item.photos,
    materials: item.materials,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }
}

export function collectItemCustomTags(item: Item, tags: Record<ItemTag['name'], ItemTag>): Set<ItemTag['name']> {
  const customTags = new Set<ItemTag['name']>()
  for (const tag of item.tags) {
    if (!tags[tag]?.group) customTags.add(tag)
  }
  return customTags
}
