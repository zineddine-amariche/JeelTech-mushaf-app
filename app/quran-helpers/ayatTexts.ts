import { equivalentVerses } from "app/quran-helpers/quranCountingData"
import { Mushaf } from "app/quran-helpers/quranData"
const warchData = require("assets/db/ayat/warsh.json")
const warchTextsMappedMushaf = "imamMalik"

export const getEquivalantWarchAyatCombined = (verseNo: number, selectedMushaf: Mushaf): string => {
  return getWarchAyatCombined(equivalentVerses(verseNo, selectedMushaf, warchTextsMappedMushaf))
}

export const getWarchAyatCombined = (verses: number[]): string => {
  return verses
    .map((item) => warchData[item - 1].slice(0, -2))
    .join(" ")
    .replaceAll("۞", "")
}
