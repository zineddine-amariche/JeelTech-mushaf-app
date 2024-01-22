import { convertObjectToI18n } from "app/i18n"
import { Masahif } from "assets/db/masahif/masahif"
import { Reciters } from "assets/db/reciters/reciters"
import { Tafaseer } from "assets/db/tafaseer/tafaseer"
import { Tarajim } from "assets/db/tarajim/tarajim"

export const loadTranslations = (data: any, category: string) => {
  return Object.keys(data).map((item) => {
    return convertObjectToI18n(data[item].meta, category, item)
  })
}

const masahifTranslations = loadTranslations(Masahif, "masahif")
const recitersTranslations = loadTranslations(Reciters, "reciters")
const tafaseerTranslations = loadTranslations(Tafaseer, "tafaseer")
const tarajimTranslations = loadTranslations(Tarajim, "tarajim")

export const translationsObject = [
  ...masahifTranslations,
  ...recitersTranslations,
  ...tafaseerTranslations,
  ...tarajimTranslations,
]
