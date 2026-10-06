import type { Item, ItemTag } from '@/types/item'

export function collectItemCustomTags(item: Item, tags: Record<ItemTag['name'], ItemTag>): Set<ItemTag['name']> {
  const customTags = new Set<ItemTag['name']>()
  for (const tag of item.tags) {
    if (!tags[tag]?.group) {
      customTags.add(tag)
    }
  }
  return customTags
}

export function sortItemsByCreatedDate(items: Item[]) {
  return items.toSorted((a, b) => {
    const aTime = new Date(a.created_at).getTime()
    const bTime = new Date(b.created_at).getTime()
    return bTime - aTime
  })
}
