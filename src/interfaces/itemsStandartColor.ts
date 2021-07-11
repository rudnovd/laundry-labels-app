import { Language } from './language'

export interface ItemStandartColor {
  code: string
  value: string
}

export interface ItemStandartColorTranslation {
  id: string
  colorCode: string
  language: Language
  value: string
}
