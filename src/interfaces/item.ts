export interface Item {
  _id: string
  icons: Array<string>
  images: Array<string>
  tags: Array<string>
  createdAt: string
  updatedAt: string
}

export type ItemBlank = Omit<Item, '_id' | 'createdAt' | 'updatedAt'>
