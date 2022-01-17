import type { Table } from 'dexie'
import Dexie from 'dexie'
import type { Item } from './interfaces/item'

export class MySubClassedDexie extends Dexie {
  items!: Table<Item>
  offlineItems!: Table<Item>
  itemsImages!: Table<{
    _id: string
    itemId: string | null
    image: Blob
    imageUrl: string
  }>

  constructor() {
    super('main')
    this.version(1).stores({
      items: '++_id, createdAt, updatedAt',
      offlineItems: '++_id, createdAt, updatedAt',
      itemsImages: '++_id, itemId, imageUrl',
    })
  }
}

export const db = new MySubClassedDexie()
