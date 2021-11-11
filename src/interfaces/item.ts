export interface Item {
  _id: string
  icons: string[]
  images?: string[]
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export type ItemBlank = Omit<Item, '_id' | 'createdAt' | 'updatedAt'>
