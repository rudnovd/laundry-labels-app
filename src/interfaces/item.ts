export interface Item {
  _id: string
  icons: string[]
  images: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type ItemBlank = Omit<Item, '_id' | 'createdAt' | 'updatedAt'>
