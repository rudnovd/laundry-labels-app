import type { DatabaseItem } from '@/types/item'

export function convertItem(item: Omit<DatabaseItem, 'owner'>) {
  return {
    id: item.id,
    name: item.name,
    symbols: new Set(item.symbols),
    tags: new Set(item.tags),
    photos: new Set(item.photos),
    materials: item.materials,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }
}
