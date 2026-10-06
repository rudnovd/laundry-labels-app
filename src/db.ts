import type { Table } from 'dexie'
import type { Item } from './types/item'
import Dexie from 'dexie'

const DATABASE_VERSION = 2

export class Database extends Dexie {
  offlineItems!: Table<Item>
  upload!: Table<{ id: string, file: File | Blob }>

  constructor() {
    super('laundrylabelsapp')
    this.version(DATABASE_VERSION).stores({
      offlineItems: '++id, name, symbols, tags, materials, photos, created_at, updated_at',
      upload: '++id, file',
    })
  }
}

export const db = new Database()
