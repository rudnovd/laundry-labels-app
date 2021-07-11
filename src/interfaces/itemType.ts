import { Language } from './language'

export interface itemType {
  code: string
}

export interface itemTypeValues {
  id: string
  itemTypeCode: itemType
  language: Language
  name: string
  desciption?: string
}
