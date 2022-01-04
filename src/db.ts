import type { Table } from 'dexie'
import Dexie from 'dexie'
import type { Item } from './interfaces/item'

export class MySubClassedDexie extends Dexie {
  items!: Table<Item>
  offlineItems!: Table<Item>

  constructor() {
    super('main')
    this.version(1).stores({
      items: '++_id, createdAt',
      offlineItems: '++_id, createdAt',
    })
  }
}

export const db = new MySubClassedDexie()
