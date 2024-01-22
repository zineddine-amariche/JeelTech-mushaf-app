import { Mushaf, Quran } from "app/quran-helpers/quranData"
import { translate } from "app/i18n"

export const getPrintPageText = (page: number, mushaf: Mushaf) => {
  const tmp = Quran.getPrintPageNumber(page, mushaf)
  return "" + (tmp > 0 ? tmp : translate("mushafPage.extraPage", { page }))
}
