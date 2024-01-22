import { Quran } from "./quranData"
import { Masahif } from "assets/db/masahif/masahif"

export const injectMasahif = () => {
  Quran._const.masahif = Masahif
}
