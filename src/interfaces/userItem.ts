import { laundryIcon } from './laundryIcon'

export interface userItem {
  id: string
  name?: string
  type: string
  laundryIcons: laundryIcon[]
  images?: string[]
  // color?: {
  //   name: string
  //   value: string
  // }
  created: Date
  edited?: Date
}

export interface userItemBlank {
  name?: string | null
  type: { code: string; value: string } | null
  laundryIcons: laundryIcon[]
  images?: string[] | null
}
