import type { Item } from '@/interfaces/item'
import Dexie, { type Table } from 'dexie'

const DATABASE_VERSION = 1

export class Database extends Dexie {
  offlineItems!: Table<Item>
  upload!: Table<{ _id: string; file: File }>

  constructor() {
    super('laundrylabelsapp')
    this.version(DATABASE_VERSION).stores({
      offlineItems: '++_id, name, icons, tags, createdAt, updatedAt',
      upload: '++_id, file',
    })
  }
}

export const db = new Database()
