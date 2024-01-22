import { TafaseerID } from "./tafaseer/tafaseer"
import { TarajimID } from "./tarajim/tarajim"

interface BookMeta {
  name: {
    ar: string
    en: string
    fr: string
  }
  author: {
    ar: string
    en: string
    fr: string
  }
}

export interface BookType {
  enabled: boolean
  id: TafaseerID | TarajimID
  lang: string
  file: any
  meta: BookMeta
}

export type BooksType = {
  [key in TarajimID | TafaseerID]?: Partial<BookType>
}
