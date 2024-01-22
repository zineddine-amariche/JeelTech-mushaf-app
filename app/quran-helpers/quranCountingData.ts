/**
 *
 * return an ayah or a set of ayahs equivalent to another countingType
 * search the equivalent of an ayah in another countingType e.g. Kufi or Madani2
 * @param array theArray
 * @param mixed item
 */

import { Mushaf, Quran } from "./quranData"

export const equivalentVerse = (
  verseNo: number,
  mushafSource: Mushaf,
  mushafDestination: Mushaf,
) => {
  return equivalentVerses(verseNo, mushafSource, mushafDestination)[0]
}

export const equivalentVerses = (
  verseNo: number,
  mushafSource: Mushaf,
  mushafDestination: Mushaf,
) => {
  const { surah, ayah } = Quran.getDupletByVerseNo(verseNo, mushafSource)
  const ayat = equivalentAyat(
    surah,
    ayah,
    Quran.getCountingType(mushafSource),
    Quran.getCountingType(mushafDestination),
  )
  return ayat.map((a) => Quran.getVerseNoByDuplet(surah, a, mushafDestination))
}

export const equivalentAyat = (
  surah,
  ayah,
  countingTypeSource = "madani2",
  countingTypeDestination = "kufi",
) => {
  if (countingTypeSource === countingTypeDestination) return [ayah]
  const detailed = convertCountingTypeDetailed(
    surah,
    ayah,
    countingTypeSource,
    countingTypeDestination,
  )
  if (detailed.case === "1-to-1") return [detailed.eq]
  if (detailed.case === "included-in") return detailed.eq
  if (detailed.case === "composed-of") return detailed.eq
  return [ayah]
}
export const convertCountingTypeDetailed = (
  surah,
  ayah,
  countingTypeSource = "madani2",
  countingTypeDestination = "kufi",
) => {
  const shorten = { madani2: "M2", kufi: "K" }
  countingTypeSource = shorten[countingTypeSource]
  countingTypeDestination = shorten[countingTypeDestination]

  const row = _mapSearch(surah, ayah, countingTypeSource, countingTypeDestination)
  let result = { case: null, eq: null }

  // This happens only in surah 1 verse 1
  if (row == false)
    result = {
      case: "failed",
      eq: null,
    }
  else if (row[countingTypeDestination] !== null) {
    result = {
      case: "1-to-1",
      eq: row[countingTypeDestination],
    }
  } else {
    result["eq"] = row["detail"]["eq"][countingTypeDestination]
    len = row["detail"]["eq"][countingTypeDestination].length

    if (len == 0) result["case"] = "no-equivalent"
    else if (len == 1) result["case"] = "included-in"
    else if (len > 1) result["case"] = "composed-of"
  }

  return result
}

/**
 * internal method search
 * search the equivalent of an ayah in another countingType e.g. Kufi or Madani2
 * @param integer surah
 * @param integer ayah
 * @param string countingTypeSource (M2||K)
 * @param string countingTypeDestination (M2||K)
 */

const _mapSearch = (surah, ayah, countingTypeSource = "M2") => {
  // suppose the index is the aya otherwise increase the index
  let index = ayah - 1

  while (surah in map && index in map[surah]) {
    if (countingTypeSource in map[surah][index] && map[surah][index][countingTypeSource] == ayah) {
      if (map[surah][index][countingTypeSource] !== null) return map[surah][index]
      else index++
    } else index++
  }

  return false
}

/* TODO possibily:
 *
 * Optimize the map in a way that it would for example:
*   {
	From index: 2 to 5,
	increase +1 in other words K=M+1
	"detail": null
	},
 **/

const map = {
  1: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [6, 7] } },
    },
    {
      K: null,
      M2: 6,
      detail: { instance: ["M2"], eq: { K: [7] } },
    },
    {
      K: null,
      M2: 7,
      detail: { instance: ["M2"], eq: { K: [7] } },
    },
  ],
  2: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
    {
      K: 61,
      M2: 60,
      detail: null,
    },
    {
      K: 62,
      M2: 61,
      detail: null,
    },
    {
      K: 63,
      M2: 62,
      detail: null,
    },
    {
      K: 64,
      M2: 63,
      detail: null,
    },
    {
      K: 65,
      M2: 64,
      detail: null,
    },
    {
      K: 66,
      M2: 65,
      detail: null,
    },
    {
      K: 67,
      M2: 66,
      detail: null,
    },
    {
      K: 68,
      M2: 67,
      detail: null,
    },
    {
      K: 69,
      M2: 68,
      detail: null,
    },
    {
      K: 70,
      M2: 69,
      detail: null,
    },
    {
      K: 71,
      M2: 70,
      detail: null,
    },
    {
      K: 72,
      M2: 71,
      detail: null,
    },
    {
      K: 73,
      M2: 72,
      detail: null,
    },
    {
      K: 74,
      M2: 73,
      detail: null,
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
    {
      K: 79,
      M2: 78,
      detail: null,
    },
    {
      K: 80,
      M2: 79,
      detail: null,
    },
    {
      K: 81,
      M2: 80,
      detail: null,
    },
    {
      K: 82,
      M2: 81,
      detail: null,
    },
    {
      K: 83,
      M2: 82,
      detail: null,
    },
    {
      K: 84,
      M2: 83,
      detail: null,
    },
    {
      K: 85,
      M2: 84,
      detail: null,
    },
    {
      K: 86,
      M2: 85,
      detail: null,
    },
    {
      K: 87,
      M2: 86,
      detail: null,
    },
    {
      K: 88,
      M2: 87,
      detail: null,
    },
    {
      K: 89,
      M2: 88,
      detail: null,
    },
    {
      K: 90,
      M2: 89,
      detail: null,
    },
    {
      K: 91,
      M2: 90,
      detail: null,
    },
    {
      K: 92,
      M2: 91,
      detail: null,
    },
    {
      K: 93,
      M2: 92,
      detail: null,
    },
    {
      K: 94,
      M2: 93,
      detail: null,
    },
    {
      K: 95,
      M2: 94,
      detail: null,
    },
    {
      K: 96,
      M2: 95,
      detail: null,
    },
    {
      K: 97,
      M2: 96,
      detail: null,
    },
    {
      K: 98,
      M2: 97,
      detail: null,
    },
    {
      K: 99,
      M2: 98,
      detail: null,
    },
    {
      K: 100,
      M2: 99,
      detail: null,
    },
    {
      K: 101,
      M2: 100,
      detail: null,
    },
    {
      K: 102,
      M2: 101,
      detail: null,
    },
    {
      K: 103,
      M2: 102,
      detail: null,
    },
    {
      K: 104,
      M2: 103,
      detail: null,
    },
    {
      K: 105,
      M2: 104,
      detail: null,
    },
    {
      K: 106,
      M2: 105,
      detail: null,
    },
    {
      K: 107,
      M2: 106,
      detail: null,
    },
    {
      K: 108,
      M2: 107,
      detail: null,
    },
    {
      K: 109,
      M2: 108,
      detail: null,
    },
    {
      K: 110,
      M2: 109,
      detail: null,
    },
    {
      K: 111,
      M2: 110,
      detail: null,
    },
    {
      K: 112,
      M2: 111,
      detail: null,
    },
    {
      K: 113,
      M2: 112,
      detail: null,
    },
    {
      K: 114,
      M2: 113,
      detail: null,
    },
    {
      K: 115,
      M2: 114,
      detail: null,
    },
    {
      K: 116,
      M2: 115,
      detail: null,
    },
    {
      K: 117,
      M2: 116,
      detail: null,
    },
    {
      K: 118,
      M2: 117,
      detail: null,
    },
    {
      K: 119,
      M2: 118,
      detail: null,
    },
    {
      K: 120,
      M2: 119,
      detail: null,
    },
    {
      K: 121,
      M2: 120,
      detail: null,
    },
    {
      K: 122,
      M2: 121,
      detail: null,
    },
    {
      K: 123,
      M2: 122,
      detail: null,
    },
    {
      K: 124,
      M2: 123,
      detail: null,
    },
    {
      K: 125,
      M2: 124,
      detail: null,
    },
    {
      K: 126,
      M2: 125,
      detail: null,
    },
    {
      K: 127,
      M2: 126,
      detail: null,
    },
    {
      K: 128,
      M2: 127,
      detail: null,
    },
    {
      K: 129,
      M2: 128,
      detail: null,
    },
    {
      K: 130,
      M2: 129,
      detail: null,
    },
    {
      K: 131,
      M2: 130,
      detail: null,
    },
    {
      K: 132,
      M2: 131,
      detail: null,
    },
    {
      K: 133,
      M2: 132,
      detail: null,
    },
    {
      K: 134,
      M2: 133,
      detail: null,
    },
    {
      K: 135,
      M2: 134,
      detail: null,
    },
    {
      K: 136,
      M2: 135,
      detail: null,
    },
    {
      K: 137,
      M2: 136,
      detail: null,
    },
    {
      K: 138,
      M2: 137,
      detail: null,
    },
    {
      K: 139,
      M2: 138,
      detail: null,
    },
    {
      K: 140,
      M2: 139,
      detail: null,
    },
    {
      K: 141,
      M2: 140,
      detail: null,
    },
    {
      K: 142,
      M2: 141,
      detail: null,
    },
    {
      K: 143,
      M2: 142,
      detail: null,
    },
    {
      K: 144,
      M2: 143,
      detail: null,
    },
    {
      K: 145,
      M2: 144,
      detail: null,
    },
    {
      K: 146,
      M2: 145,
      detail: null,
    },
    {
      K: 147,
      M2: 146,
      detail: null,
    },
    {
      K: 148,
      M2: 147,
      detail: null,
    },
    {
      K: 149,
      M2: 148,
      detail: null,
    },
    {
      K: 150,
      M2: 149,
      detail: null,
    },
    {
      K: 151,
      M2: 150,
      detail: null,
    },
    {
      K: 152,
      M2: 151,
      detail: null,
    },
    {
      K: 153,
      M2: 152,
      detail: null,
    },
    {
      K: 154,
      M2: 153,
      detail: null,
    },
    {
      K: 155,
      M2: 154,
      detail: null,
    },
    {
      K: 156,
      M2: 155,
      detail: null,
    },
    {
      K: 157,
      M2: 156,
      detail: null,
    },
    {
      K: 158,
      M2: 157,
      detail: null,
    },
    {
      K: 159,
      M2: 158,
      detail: null,
    },
    {
      K: 160,
      M2: 159,
      detail: null,
    },
    {
      K: 161,
      M2: 160,
      detail: null,
    },
    {
      K: 162,
      M2: 161,
      detail: null,
    },
    {
      K: 163,
      M2: 162,
      detail: null,
    },
    {
      K: 164,
      M2: 163,
      detail: null,
    },
    {
      K: 165,
      M2: 164,
      detail: null,
    },
    {
      K: 166,
      M2: 165,
      detail: null,
    },
    {
      K: 167,
      M2: 166,
      detail: null,
    },
    {
      K: 168,
      M2: 167,
      detail: null,
    },
    {
      K: 169,
      M2: 168,
      detail: null,
    },
    {
      K: 170,
      M2: 169,
      detail: null,
    },
    {
      K: 171,
      M2: 170,
      detail: null,
    },
    {
      K: 172,
      M2: 171,
      detail: null,
    },
    {
      K: 173,
      M2: 172,
      detail: null,
    },
    {
      K: 174,
      M2: 173,
      detail: null,
    },
    {
      K: 175,
      M2: 174,
      detail: null,
    },
    {
      K: 176,
      M2: 175,
      detail: null,
    },
    {
      K: 177,
      M2: 176,
      detail: null,
    },
    {
      K: 178,
      M2: 177,
      detail: null,
    },
    {
      K: 179,
      M2: 178,
      detail: null,
    },
    {
      K: 180,
      M2: 179,
      detail: null,
    },
    {
      K: 181,
      M2: 180,
      detail: null,
    },
    {
      K: 182,
      M2: 181,
      detail: null,
    },
    {
      K: 183,
      M2: 182,
      detail: null,
    },
    {
      K: 184,
      M2: 183,
      detail: null,
    },
    {
      K: 185,
      M2: 184,
      detail: null,
    },
    {
      K: 186,
      M2: 185,
      detail: null,
    },
    {
      K: 187,
      M2: 186,
      detail: null,
    },
    {
      K: 188,
      M2: 187,
      detail: null,
    },
    {
      K: 189,
      M2: 188,
      detail: null,
    },
    {
      K: 190,
      M2: 189,
      detail: null,
    },
    {
      K: 191,
      M2: 190,
      detail: null,
    },
    {
      K: 192,
      M2: 191,
      detail: null,
    },
    {
      K: 193,
      M2: 192,
      detail: null,
    },
    {
      K: 194,
      M2: 193,
      detail: null,
    },
    {
      K: 195,
      M2: 194,
      detail: null,
    },
    {
      K: 196,
      M2: 195,
      detail: null,
    },
    {
      K: 197,
      M2: 196,
      detail: null,
    },
    {
      K: 198,
      M2: 197,
      detail: null,
    },
    {
      K: 199,
      M2: 198,
      detail: null,
    },
    {
      K: 200,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [199] } },
    },
    {
      K: 201,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [199] } },
    },
    {
      K: null,
      M2: 199,
      detail: { instance: ["M2"], eq: { K: [200, 201] } },
    },
    {
      K: 202,
      M2: 200,
      detail: null,
    },
    {
      K: 203,
      M2: 201,
      detail: null,
    },
    {
      K: 204,
      M2: 202,
      detail: null,
    },
    {
      K: 205,
      M2: 203,
      detail: null,
    },
    {
      K: 206,
      M2: 204,
      detail: null,
    },
    {
      K: 207,
      M2: 205,
      detail: null,
    },
    {
      K: 208,
      M2: 206,
      detail: null,
    },
    {
      K: 209,
      M2: 207,
      detail: null,
    },
    {
      K: 210,
      M2: 208,
      detail: null,
    },
    {
      K: 211,
      M2: 209,
      detail: null,
    },
    {
      K: 212,
      M2: 210,
      detail: null,
    },
    {
      K: 213,
      M2: 211,
      detail: null,
    },
    {
      K: 214,
      M2: 212,
      detail: null,
    },
    {
      K: 215,
      M2: 213,
      detail: null,
    },
    {
      K: 216,
      M2: 214,
      detail: null,
    },
    {
      K: 217,
      M2: 215,
      detail: null,
    },
    {
      K: 218,
      M2: 216,
      detail: null,
    },
    {
      K: 219,
      M2: 217,
      detail: null,
    },
    {
      K: 220,
      M2: 218,
      detail: null,
    },
    {
      K: 221,
      M2: 219,
      detail: null,
    },
    {
      K: 222,
      M2: 220,
      detail: null,
    },
    {
      K: 223,
      M2: 221,
      detail: null,
    },
    {
      K: 224,
      M2: 222,
      detail: null,
    },
    {
      K: 225,
      M2: 223,
      detail: null,
    },
    {
      K: 226,
      M2: 224,
      detail: null,
    },
    {
      K: 227,
      M2: 225,
      detail: null,
    },
    {
      K: 228,
      M2: 226,
      detail: null,
    },
    {
      K: 229,
      M2: 227,
      detail: null,
    },
    {
      K: 230,
      M2: 228,
      detail: null,
    },
    {
      K: 231,
      M2: 229,
      detail: null,
    },
    {
      K: 232,
      M2: 230,
      detail: null,
    },
    {
      K: 233,
      M2: 231,
      detail: null,
    },
    {
      K: 234,
      M2: 232,
      detail: null,
    },
    {
      K: 235,
      M2: 233,
      detail: null,
    },
    {
      K: 236,
      M2: 234,
      detail: null,
    },
    {
      K: 237,
      M2: 235,
      detail: null,
    },
    {
      K: 238,
      M2: 236,
      detail: null,
    },
    {
      K: 239,
      M2: 237,
      detail: null,
    },
    {
      K: 240,
      M2: 238,
      detail: null,
    },
    {
      K: 241,
      M2: 239,
      detail: null,
    },
    {
      K: 242,
      M2: 240,
      detail: null,
    },
    {
      K: 243,
      M2: 241,
      detail: null,
    },
    {
      K: 244,
      M2: 242,
      detail: null,
    },
    {
      K: 245,
      M2: 243,
      detail: null,
    },
    {
      K: 246,
      M2: 244,
      detail: null,
    },
    {
      K: 247,
      M2: 245,
      detail: null,
    },
    {
      K: 248,
      M2: 246,
      detail: null,
    },
    {
      K: 249,
      M2: 247,
      detail: null,
    },
    {
      K: 250,
      M2: 248,
      detail: null,
    },
    {
      K: 251,
      M2: 249,
      detail: null,
    },
    {
      K: 252,
      M2: 250,
      detail: null,
    },
    {
      K: 253,
      M2: 251,
      detail: null,
    },
    {
      K: 254,
      M2: 252,
      detail: null,
    },
    {
      K: 255,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [253, 254] } },
    },
    {
      K: null,
      M2: 253,
      detail: { instance: ["M2"], eq: { K: [255] } },
    },
    {
      K: null,
      M2: 254,
      detail: { instance: ["M2"], eq: { K: [255] } },
    },
    {
      K: 256,
      M2: 255,
      detail: null,
    },
    {
      K: 257,
      M2: 256,
      detail: null,
    },
    {
      K: 258,
      M2: 257,
      detail: null,
    },
    {
      K: 259,
      M2: 258,
      detail: null,
    },
    {
      K: 260,
      M2: 259,
      detail: null,
    },
    {
      K: 261,
      M2: 260,
      detail: null,
    },
    {
      K: 262,
      M2: 261,
      detail: null,
    },
    {
      K: 263,
      M2: 262,
      detail: null,
    },
    {
      K: 264,
      M2: 263,
      detail: null,
    },
    {
      K: 265,
      M2: 264,
      detail: null,
    },
    {
      K: 266,
      M2: 265,
      detail: null,
    },
    {
      K: 267,
      M2: 266,
      detail: null,
    },
    {
      K: 268,
      M2: 267,
      detail: null,
    },
    {
      K: 269,
      M2: 268,
      detail: null,
    },
    {
      K: 270,
      M2: 269,
      detail: null,
    },
    {
      K: 271,
      M2: 270,
      detail: null,
    },
    {
      K: 272,
      M2: 271,
      detail: null,
    },
    {
      K: 273,
      M2: 272,
      detail: null,
    },
    {
      K: 274,
      M2: 273,
      detail: null,
    },
    {
      K: 275,
      M2: 274,
      detail: null,
    },
    {
      K: 276,
      M2: 275,
      detail: null,
    },
    {
      K: 277,
      M2: 276,
      detail: null,
    },
    {
      K: 278,
      M2: 277,
      detail: null,
    },
    {
      K: 279,
      M2: 278,
      detail: null,
    },
    {
      K: 280,
      M2: 279,
      detail: null,
    },
    {
      K: 281,
      M2: 280,
      detail: null,
    },
    {
      K: 282,
      M2: 281,
      detail: null,
    },
    {
      K: 283,
      M2: 282,
      detail: null,
    },
    {
      K: 284,
      M2: 283,
      detail: null,
    },
    {
      K: 285,
      M2: 284,
      detail: null,
    },
    {
      K: 286,
      M2: 285,
      detail: null,
    },
  ],
  3: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [3, 4] } },
    },
    {
      K: null,
      M2: 3,
      detail: { instance: ["M2"], eq: { K: [4] } },
    },
    {
      K: null,
      M2: 4,
      detail: { instance: ["M2"], eq: { K: [4] } },
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [48] } },
    },
    {
      K: 49,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [48] } },
    },
    {
      K: null,
      M2: 48,
      detail: { instance: ["M2"], eq: { K: [48, 49] } },
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
    {
      K: 61,
      M2: 60,
      detail: null,
    },
    {
      K: 62,
      M2: 61,
      detail: null,
    },
    {
      K: 63,
      M2: 62,
      detail: null,
    },
    {
      K: 64,
      M2: 63,
      detail: null,
    },
    {
      K: 65,
      M2: 64,
      detail: null,
    },
    {
      K: 66,
      M2: 65,
      detail: null,
    },
    {
      K: 67,
      M2: 66,
      detail: null,
    },
    {
      K: 68,
      M2: 67,
      detail: null,
    },
    {
      K: 69,
      M2: 68,
      detail: null,
    },
    {
      K: 70,
      M2: 69,
      detail: null,
    },
    {
      K: 71,
      M2: 70,
      detail: null,
    },
    {
      K: 72,
      M2: 71,
      detail: null,
    },
    {
      K: 73,
      M2: 72,
      detail: null,
    },
    {
      K: 74,
      M2: 73,
      detail: null,
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
    {
      K: 79,
      M2: 78,
      detail: null,
    },
    {
      K: 80,
      M2: 79,
      detail: null,
    },
    {
      K: 81,
      M2: 80,
      detail: null,
    },
    {
      K: 82,
      M2: 81,
      detail: null,
    },
    {
      K: 83,
      M2: 82,
      detail: null,
    },
    {
      K: 84,
      M2: 83,
      detail: null,
    },
    {
      K: 85,
      M2: 84,
      detail: null,
    },
    {
      K: 86,
      M2: 85,
      detail: null,
    },
    {
      K: 87,
      M2: 86,
      detail: null,
    },
    {
      K: 88,
      M2: 87,
      detail: null,
    },
    {
      K: 89,
      M2: 88,
      detail: null,
    },
    {
      K: 90,
      M2: 89,
      detail: null,
    },
    {
      K: 91,
      M2: 90,
      detail: null,
    },
    {
      K: 92,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [91, 92] } },
    },
    {
      K: null,
      M2: 91,
      detail: { instance: ["M2"], eq: { K: [92] } },
    },
    {
      K: null,
      M2: 92,
      detail: { instance: ["M2"], eq: { K: [92] } },
    },
    {
      K: 93,
      M2: 93,
      detail: null,
    },
    {
      K: 94,
      M2: 94,
      detail: null,
    },
    {
      K: 95,
      M2: 95,
      detail: null,
    },
    {
      K: 96,
      M2: 96,
      detail: null,
    },
    {
      K: 97,
      M2: 97,
      detail: null,
    },
    {
      K: 98,
      M2: 98,
      detail: null,
    },
    {
      K: 99,
      M2: 99,
      detail: null,
    },
    {
      K: 100,
      M2: 100,
      detail: null,
    },
    {
      K: 101,
      M2: 101,
      detail: null,
    },
    {
      K: 102,
      M2: 102,
      detail: null,
    },
    {
      K: 103,
      M2: 103,
      detail: null,
    },
    {
      K: 104,
      M2: 104,
      detail: null,
    },
    {
      K: 105,
      M2: 105,
      detail: null,
    },
    {
      K: 106,
      M2: 106,
      detail: null,
    },
    {
      K: 107,
      M2: 107,
      detail: null,
    },
    {
      K: 108,
      M2: 108,
      detail: null,
    },
    {
      K: 109,
      M2: 109,
      detail: null,
    },
    {
      K: 110,
      M2: 110,
      detail: null,
    },
    {
      K: 111,
      M2: 111,
      detail: null,
    },
    {
      K: 112,
      M2: 112,
      detail: null,
    },
    {
      K: 113,
      M2: 113,
      detail: null,
    },
    {
      K: 114,
      M2: 114,
      detail: null,
    },
    {
      K: 115,
      M2: 115,
      detail: null,
    },
    {
      K: 116,
      M2: 116,
      detail: null,
    },
    {
      K: 117,
      M2: 117,
      detail: null,
    },
    {
      K: 118,
      M2: 118,
      detail: null,
    },
    {
      K: 119,
      M2: 119,
      detail: null,
    },
    {
      K: 120,
      M2: 120,
      detail: null,
    },
    {
      K: 121,
      M2: 121,
      detail: null,
    },
    {
      K: 122,
      M2: 122,
      detail: null,
    },
    {
      K: 123,
      M2: 123,
      detail: null,
    },
    {
      K: 124,
      M2: 124,
      detail: null,
    },
    {
      K: 125,
      M2: 125,
      detail: null,
    },
    {
      K: 126,
      M2: 126,
      detail: null,
    },
    {
      K: 127,
      M2: 127,
      detail: null,
    },
    {
      K: 128,
      M2: 128,
      detail: null,
    },
    {
      K: 129,
      M2: 129,
      detail: null,
    },
    {
      K: 130,
      M2: 130,
      detail: null,
    },
    {
      K: 131,
      M2: 131,
      detail: null,
    },
    {
      K: 132,
      M2: 132,
      detail: null,
    },
    {
      K: 133,
      M2: 133,
      detail: null,
    },
    {
      K: 134,
      M2: 134,
      detail: null,
    },
    {
      K: 135,
      M2: 135,
      detail: null,
    },
    {
      K: 136,
      M2: 136,
      detail: null,
    },
    {
      K: 137,
      M2: 137,
      detail: null,
    },
    {
      K: 138,
      M2: 138,
      detail: null,
    },
    {
      K: 139,
      M2: 139,
      detail: null,
    },
    {
      K: 140,
      M2: 140,
      detail: null,
    },
    {
      K: 141,
      M2: 141,
      detail: null,
    },
    {
      K: 142,
      M2: 142,
      detail: null,
    },
    {
      K: 143,
      M2: 143,
      detail: null,
    },
    {
      K: 144,
      M2: 144,
      detail: null,
    },
    {
      K: 145,
      M2: 145,
      detail: null,
    },
    {
      K: 146,
      M2: 146,
      detail: null,
    },
    {
      K: 147,
      M2: 147,
      detail: null,
    },
    {
      K: 148,
      M2: 148,
      detail: null,
    },
    {
      K: 149,
      M2: 149,
      detail: null,
    },
    {
      K: 150,
      M2: 150,
      detail: null,
    },
    {
      K: 151,
      M2: 151,
      detail: null,
    },
    {
      K: 152,
      M2: 152,
      detail: null,
    },
    {
      K: 153,
      M2: 153,
      detail: null,
    },
    {
      K: 154,
      M2: 154,
      detail: null,
    },
    {
      K: 155,
      M2: 155,
      detail: null,
    },
    {
      K: 156,
      M2: 156,
      detail: null,
    },
    {
      K: 157,
      M2: 157,
      detail: null,
    },
    {
      K: 158,
      M2: 158,
      detail: null,
    },
    {
      K: 159,
      M2: 159,
      detail: null,
    },
    {
      K: 160,
      M2: 160,
      detail: null,
    },
    {
      K: 161,
      M2: 161,
      detail: null,
    },
    {
      K: 162,
      M2: 162,
      detail: null,
    },
    {
      K: 163,
      M2: 163,
      detail: null,
    },
    {
      K: 164,
      M2: 164,
      detail: null,
    },
    {
      K: 165,
      M2: 165,
      detail: null,
    },
    {
      K: 166,
      M2: 166,
      detail: null,
    },
    {
      K: 167,
      M2: 167,
      detail: null,
    },
    {
      K: 168,
      M2: 168,
      detail: null,
    },
    {
      K: 169,
      M2: 169,
      detail: null,
    },
    {
      K: 170,
      M2: 170,
      detail: null,
    },
    {
      K: 171,
      M2: 171,
      detail: null,
    },
    {
      K: 172,
      M2: 172,
      detail: null,
    },
    {
      K: 173,
      M2: 173,
      detail: null,
    },
    {
      K: 174,
      M2: 174,
      detail: null,
    },
    {
      K: 175,
      M2: 175,
      detail: null,
    },
    {
      K: 176,
      M2: 176,
      detail: null,
    },
    {
      K: 177,
      M2: 177,
      detail: null,
    },
    {
      K: 178,
      M2: 178,
      detail: null,
    },
    {
      K: 179,
      M2: 179,
      detail: null,
    },
    {
      K: 180,
      M2: 180,
      detail: null,
    },
    {
      K: 181,
      M2: 181,
      detail: null,
    },
    {
      K: 182,
      M2: 182,
      detail: null,
    },
    {
      K: 183,
      M2: 183,
      detail: null,
    },
    {
      K: 184,
      M2: 184,
      detail: null,
    },
    {
      K: 185,
      M2: 185,
      detail: null,
    },
    {
      K: 186,
      M2: 186,
      detail: null,
    },
    {
      K: 187,
      M2: 187,
      detail: null,
    },
    {
      K: 188,
      M2: 188,
      detail: null,
    },
    {
      K: 189,
      M2: 189,
      detail: null,
    },
    {
      K: 190,
      M2: 190,
      detail: null,
    },
    {
      K: 191,
      M2: 191,
      detail: null,
    },
    {
      K: 192,
      M2: 192,
      detail: null,
    },
    {
      K: 193,
      M2: 193,
      detail: null,
    },
    {
      K: 194,
      M2: 194,
      detail: null,
    },
    {
      K: 195,
      M2: 195,
      detail: null,
    },
    {
      K: 196,
      M2: 196,
      detail: null,
    },
    {
      K: 197,
      M2: 197,
      detail: null,
    },
    {
      K: 198,
      M2: 198,
      detail: null,
    },
    {
      K: 199,
      M2: 199,
      detail: null,
    },
    {
      K: 200,
      M2: 200,
      detail: null,
    },
  ],
  4: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [44] } },
    },
    {
      K: 45,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [44] } },
    },
    {
      K: null,
      M2: 44,
      detail: { instance: ["M2"], eq: { K: [44, 45] } },
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
    {
      K: 61,
      M2: 60,
      detail: null,
    },
    {
      K: 62,
      M2: 61,
      detail: null,
    },
    {
      K: 63,
      M2: 62,
      detail: null,
    },
    {
      K: 64,
      M2: 63,
      detail: null,
    },
    {
      K: 65,
      M2: 64,
      detail: null,
    },
    {
      K: 66,
      M2: 65,
      detail: null,
    },
    {
      K: 67,
      M2: 66,
      detail: null,
    },
    {
      K: 68,
      M2: 67,
      detail: null,
    },
    {
      K: 69,
      M2: 68,
      detail: null,
    },
    {
      K: 70,
      M2: 69,
      detail: null,
    },
    {
      K: 71,
      M2: 70,
      detail: null,
    },
    {
      K: 72,
      M2: 71,
      detail: null,
    },
    {
      K: 73,
      M2: 72,
      detail: null,
    },
    {
      K: 74,
      M2: 73,
      detail: null,
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
    {
      K: 79,
      M2: 78,
      detail: null,
    },
    {
      K: 80,
      M2: 79,
      detail: null,
    },
    {
      K: 81,
      M2: 80,
      detail: null,
    },
    {
      K: 82,
      M2: 81,
      detail: null,
    },
    {
      K: 83,
      M2: 82,
      detail: null,
    },
    {
      K: 84,
      M2: 83,
      detail: null,
    },
    {
      K: 85,
      M2: 84,
      detail: null,
    },
    {
      K: 86,
      M2: 85,
      detail: null,
    },
    {
      K: 87,
      M2: 86,
      detail: null,
    },
    {
      K: 88,
      M2: 87,
      detail: null,
    },
    {
      K: 89,
      M2: 88,
      detail: null,
    },
    {
      K: 90,
      M2: 89,
      detail: null,
    },
    {
      K: 91,
      M2: 90,
      detail: null,
    },
    {
      K: 92,
      M2: 91,
      detail: null,
    },
    {
      K: 93,
      M2: 92,
      detail: null,
    },
    {
      K: 94,
      M2: 93,
      detail: null,
    },
    {
      K: 95,
      M2: 94,
      detail: null,
    },
    {
      K: 96,
      M2: 95,
      detail: null,
    },
    {
      K: 97,
      M2: 96,
      detail: null,
    },
    {
      K: 98,
      M2: 97,
      detail: null,
    },
    {
      K: 99,
      M2: 98,
      detail: null,
    },
    {
      K: 100,
      M2: 99,
      detail: null,
    },
    {
      K: 101,
      M2: 100,
      detail: null,
    },
    {
      K: 102,
      M2: 101,
      detail: null,
    },
    {
      K: 103,
      M2: 102,
      detail: null,
    },
    {
      K: 104,
      M2: 103,
      detail: null,
    },
    {
      K: 105,
      M2: 104,
      detail: null,
    },
    {
      K: 106,
      M2: 105,
      detail: null,
    },
    {
      K: 107,
      M2: 106,
      detail: null,
    },
    {
      K: 108,
      M2: 107,
      detail: null,
    },
    {
      K: 109,
      M2: 108,
      detail: null,
    },
    {
      K: 110,
      M2: 109,
      detail: null,
    },
    {
      K: 111,
      M2: 110,
      detail: null,
    },
    {
      K: 112,
      M2: 111,
      detail: null,
    },
    {
      K: 113,
      M2: 112,
      detail: null,
    },
    {
      K: 114,
      M2: 113,
      detail: null,
    },
    {
      K: 115,
      M2: 114,
      detail: null,
    },
    {
      K: 116,
      M2: 115,
      detail: null,
    },
    {
      K: 117,
      M2: 116,
      detail: null,
    },
    {
      K: 118,
      M2: 117,
      detail: null,
    },
    {
      K: 119,
      M2: 118,
      detail: null,
    },
    {
      K: 120,
      M2: 119,
      detail: null,
    },
    {
      K: 121,
      M2: 120,
      detail: null,
    },
    {
      K: 122,
      M2: 121,
      detail: null,
    },
    {
      K: 123,
      M2: 122,
      detail: null,
    },
    {
      K: 124,
      M2: 123,
      detail: null,
    },
    {
      K: 125,
      M2: 124,
      detail: null,
    },
    {
      K: 126,
      M2: 125,
      detail: null,
    },
    {
      K: 127,
      M2: 126,
      detail: null,
    },
    {
      K: 128,
      M2: 127,
      detail: null,
    },
    {
      K: 129,
      M2: 128,
      detail: null,
    },
    {
      K: 130,
      M2: 129,
      detail: null,
    },
    {
      K: 131,
      M2: 130,
      detail: null,
    },
    {
      K: 132,
      M2: 131,
      detail: null,
    },
    {
      K: 133,
      M2: 132,
      detail: null,
    },
    {
      K: 134,
      M2: 133,
      detail: null,
    },
    {
      K: 135,
      M2: 134,
      detail: null,
    },
    {
      K: 136,
      M2: 135,
      detail: null,
    },
    {
      K: 137,
      M2: 136,
      detail: null,
    },
    {
      K: 138,
      M2: 137,
      detail: null,
    },
    {
      K: 139,
      M2: 138,
      detail: null,
    },
    {
      K: 140,
      M2: 139,
      detail: null,
    },
    {
      K: 141,
      M2: 140,
      detail: null,
    },
    {
      K: 142,
      M2: 141,
      detail: null,
    },
    {
      K: 143,
      M2: 142,
      detail: null,
    },
    {
      K: 144,
      M2: 143,
      detail: null,
    },
    {
      K: 145,
      M2: 144,
      detail: null,
    },
    {
      K: 146,
      M2: 145,
      detail: null,
    },
    {
      K: 147,
      M2: 146,
      detail: null,
    },
    {
      K: 148,
      M2: 147,
      detail: null,
    },
    {
      K: 149,
      M2: 148,
      detail: null,
    },
    {
      K: 150,
      M2: 149,
      detail: null,
    },
    {
      K: 151,
      M2: 150,
      detail: null,
    },
    {
      K: 152,
      M2: 151,
      detail: null,
    },
    {
      K: 153,
      M2: 152,
      detail: null,
    },
    {
      K: 154,
      M2: 153,
      detail: null,
    },
    {
      K: 155,
      M2: 154,
      detail: null,
    },
    {
      K: 156,
      M2: 155,
      detail: null,
    },
    {
      K: 157,
      M2: 156,
      detail: null,
    },
    {
      K: 158,
      M2: 157,
      detail: null,
    },
    {
      K: 159,
      M2: 158,
      detail: null,
    },
    {
      K: 160,
      M2: 159,
      detail: null,
    },
    {
      K: 161,
      M2: 160,
      detail: null,
    },
    {
      K: 162,
      M2: 161,
      detail: null,
    },
    {
      K: 163,
      M2: 162,
      detail: null,
    },
    {
      K: 164,
      M2: 163,
      detail: null,
    },
    {
      K: 165,
      M2: 164,
      detail: null,
    },
    {
      K: 166,
      M2: 165,
      detail: null,
    },
    {
      K: 167,
      M2: 166,
      detail: null,
    },
    {
      K: 168,
      M2: 167,
      detail: null,
    },
    {
      K: 169,
      M2: 168,
      detail: null,
    },
    {
      K: 170,
      M2: 169,
      detail: null,
    },
    {
      K: 171,
      M2: 170,
      detail: null,
    },
    {
      K: 172,
      M2: 171,
      detail: null,
    },
    {
      K: 173,
      M2: 172,
      detail: null,
    },
    {
      K: 174,
      M2: 173,
      detail: null,
    },
    {
      K: 175,
      M2: 174,
      detail: null,
    },
    {
      K: 176,
      M2: 175,
      detail: null,
    },
  ],
  5: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1, 2] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1] } },
    },
    {
      K: null,
      M2: 2,
      detail: { instance: ["M2"], eq: { K: [1] } },
    },
    {
      K: 2,
      M2: 3,
      detail: null,
    },
    {
      K: 3,
      M2: 4,
      detail: null,
    },
    {
      K: 4,
      M2: 5,
      detail: null,
    },
    {
      K: 5,
      M2: 6,
      detail: null,
    },
    {
      K: 6,
      M2: 7,
      detail: null,
    },
    {
      K: 7,
      M2: 8,
      detail: null,
    },
    {
      K: 8,
      M2: 9,
      detail: null,
    },
    {
      K: 9,
      M2: 10,
      detail: null,
    },
    {
      K: 10,
      M2: 11,
      detail: null,
    },
    {
      K: 11,
      M2: 12,
      detail: null,
    },
    {
      K: 12,
      M2: 13,
      detail: null,
    },
    {
      K: 13,
      M2: 14,
      detail: null,
    },
    {
      K: 14,
      M2: 15,
      detail: null,
    },
    {
      K: 15,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [16, 17] } },
    },
    {
      K: null,
      M2: 16,
      detail: { instance: ["M2"], eq: { K: [15] } },
    },
    {
      K: null,
      M2: 17,
      detail: { instance: ["M2"], eq: { K: [15] } },
    },
    {
      K: 16,
      M2: 18,
      detail: null,
    },
    {
      K: 17,
      M2: 19,
      detail: null,
    },
    {
      K: 18,
      M2: 20,
      detail: null,
    },
    {
      K: 19,
      M2: 21,
      detail: null,
    },
    {
      K: 20,
      M2: 22,
      detail: null,
    },
    {
      K: 21,
      M2: 23,
      detail: null,
    },
    {
      K: 22,
      M2: 24,
      detail: null,
    },
    {
      K: 23,
      M2: 25,
      detail: null,
    },
    {
      K: 24,
      M2: 26,
      detail: null,
    },
    {
      K: 25,
      M2: 27,
      detail: null,
    },
    {
      K: 26,
      M2: 28,
      detail: null,
    },
    {
      K: 27,
      M2: 29,
      detail: null,
    },
    {
      K: 28,
      M2: 30,
      detail: null,
    },
    {
      K: 29,
      M2: 31,
      detail: null,
    },
    {
      K: 30,
      M2: 32,
      detail: null,
    },
    {
      K: 31,
      M2: 33,
      detail: null,
    },
    {
      K: 32,
      M2: 34,
      detail: null,
    },
    {
      K: 33,
      M2: 35,
      detail: null,
    },
    {
      K: 34,
      M2: 36,
      detail: null,
    },
    {
      K: 35,
      M2: 37,
      detail: null,
    },
    {
      K: 36,
      M2: 38,
      detail: null,
    },
    {
      K: 37,
      M2: 39,
      detail: null,
    },
    {
      K: 38,
      M2: 40,
      detail: null,
    },
    {
      K: 39,
      M2: 41,
      detail: null,
    },
    {
      K: 40,
      M2: 42,
      detail: null,
    },
    {
      K: 41,
      M2: 43,
      detail: null,
    },
    {
      K: 42,
      M2: 44,
      detail: null,
    },
    {
      K: 43,
      M2: 45,
      detail: null,
    },
    {
      K: 44,
      M2: 46,
      detail: null,
    },
    {
      K: 45,
      M2: 47,
      detail: null,
    },
    {
      K: 46,
      M2: 48,
      detail: null,
    },
    {
      K: 47,
      M2: 49,
      detail: null,
    },
    {
      K: 48,
      M2: 50,
      detail: null,
    },
    {
      K: 49,
      M2: 51,
      detail: null,
    },
    {
      K: 50,
      M2: 52,
      detail: null,
    },
    {
      K: 51,
      M2: 53,
      detail: null,
    },
    {
      K: 52,
      M2: 54,
      detail: null,
    },
    {
      K: 53,
      M2: 55,
      detail: null,
    },
    {
      K: 54,
      M2: 56,
      detail: null,
    },
    {
      K: 55,
      M2: 57,
      detail: null,
    },
    {
      K: 56,
      M2: 58,
      detail: null,
    },
    {
      K: 57,
      M2: 59,
      detail: null,
    },
    {
      K: 58,
      M2: 60,
      detail: null,
    },
    {
      K: 59,
      M2: 61,
      detail: null,
    },
    {
      K: 60,
      M2: 62,
      detail: null,
    },
    {
      K: 61,
      M2: 63,
      detail: null,
    },
    {
      K: 62,
      M2: 64,
      detail: null,
    },
    {
      K: 63,
      M2: 65,
      detail: null,
    },
    {
      K: 64,
      M2: 66,
      detail: null,
    },
    {
      K: 65,
      M2: 67,
      detail: null,
    },
    {
      K: 66,
      M2: 68,
      detail: null,
    },
    {
      K: 67,
      M2: 69,
      detail: null,
    },
    {
      K: 68,
      M2: 70,
      detail: null,
    },
    {
      K: 69,
      M2: 71,
      detail: null,
    },
    {
      K: 70,
      M2: 72,
      detail: null,
    },
    {
      K: 71,
      M2: 73,
      detail: null,
    },
    {
      K: 72,
      M2: 74,
      detail: null,
    },
    {
      K: 73,
      M2: 75,
      detail: null,
    },
    {
      K: 74,
      M2: 76,
      detail: null,
    },
    {
      K: 75,
      M2: 77,
      detail: null,
    },
    {
      K: 76,
      M2: 78,
      detail: null,
    },
    {
      K: 77,
      M2: 79,
      detail: null,
    },
    {
      K: 78,
      M2: 80,
      detail: null,
    },
    {
      K: 79,
      M2: 81,
      detail: null,
    },
    {
      K: 80,
      M2: 82,
      detail: null,
    },
    {
      K: 81,
      M2: 83,
      detail: null,
    },
    {
      K: 82,
      M2: 84,
      detail: null,
    },
    {
      K: 83,
      M2: 85,
      detail: null,
    },
    {
      K: 84,
      M2: 86,
      detail: null,
    },
    {
      K: 85,
      M2: 87,
      detail: null,
    },
    {
      K: 86,
      M2: 88,
      detail: null,
    },
    {
      K: 87,
      M2: 89,
      detail: null,
    },
    {
      K: 88,
      M2: 90,
      detail: null,
    },
    {
      K: 89,
      M2: 91,
      detail: null,
    },
    {
      K: 90,
      M2: 92,
      detail: null,
    },
    {
      K: 91,
      M2: 93,
      detail: null,
    },
    {
      K: 92,
      M2: 94,
      detail: null,
    },
    {
      K: 93,
      M2: 95,
      detail: null,
    },
    {
      K: 94,
      M2: 96,
      detail: null,
    },
    {
      K: 95,
      M2: 97,
      detail: null,
    },
    {
      K: 96,
      M2: 98,
      detail: null,
    },
    {
      K: 97,
      M2: 99,
      detail: null,
    },
    {
      K: 98,
      M2: 100,
      detail: null,
    },
    {
      K: 99,
      M2: 101,
      detail: null,
    },
    {
      K: 100,
      M2: 102,
      detail: null,
    },
    {
      K: 101,
      M2: 103,
      detail: null,
    },
    {
      K: 102,
      M2: 104,
      detail: null,
    },
    {
      K: 103,
      M2: 105,
      detail: null,
    },
    {
      K: 104,
      M2: 106,
      detail: null,
    },
    {
      K: 105,
      M2: 107,
      detail: null,
    },
    {
      K: 106,
      M2: 108,
      detail: null,
    },
    {
      K: 107,
      M2: 109,
      detail: null,
    },
    {
      K: 108,
      M2: 110,
      detail: null,
    },
    {
      K: 109,
      M2: 111,
      detail: null,
    },
    {
      K: 110,
      M2: 112,
      detail: null,
    },
    {
      K: 111,
      M2: 113,
      detail: null,
    },
    {
      K: 112,
      M2: 114,
      detail: null,
    },
    {
      K: 113,
      M2: 115,
      detail: null,
    },
    {
      K: 114,
      M2: 116,
      detail: null,
    },
    {
      K: 115,
      M2: 117,
      detail: null,
    },
    {
      K: 116,
      M2: 118,
      detail: null,
    },
    {
      K: 117,
      M2: 119,
      detail: null,
    },
    {
      K: 118,
      M2: 120,
      detail: null,
    },
    {
      K: 119,
      M2: 121,
      detail: null,
    },
    {
      K: 120,
      M2: 122,
      detail: null,
    },
  ],
  6: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1, 2] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1] } },
    },
    {
      K: null,
      M2: 2,
      detail: { instance: ["M2"], eq: { K: [1] } },
    },
    {
      K: 2,
      M2: 3,
      detail: null,
    },
    {
      K: 3,
      M2: 4,
      detail: null,
    },
    {
      K: 4,
      M2: 5,
      detail: null,
    },
    {
      K: 5,
      M2: 6,
      detail: null,
    },
    {
      K: 6,
      M2: 7,
      detail: null,
    },
    {
      K: 7,
      M2: 8,
      detail: null,
    },
    {
      K: 8,
      M2: 9,
      detail: null,
    },
    {
      K: 9,
      M2: 10,
      detail: null,
    },
    {
      K: 10,
      M2: 11,
      detail: null,
    },
    {
      K: 11,
      M2: 12,
      detail: null,
    },
    {
      K: 12,
      M2: 13,
      detail: null,
    },
    {
      K: 13,
      M2: 14,
      detail: null,
    },
    {
      K: 14,
      M2: 15,
      detail: null,
    },
    {
      K: 15,
      M2: 16,
      detail: null,
    },
    {
      K: 16,
      M2: 17,
      detail: null,
    },
    {
      K: 17,
      M2: 18,
      detail: null,
    },
    {
      K: 18,
      M2: 19,
      detail: null,
    },
    {
      K: 19,
      M2: 20,
      detail: null,
    },
    {
      K: 20,
      M2: 21,
      detail: null,
    },
    {
      K: 21,
      M2: 22,
      detail: null,
    },
    {
      K: 22,
      M2: 23,
      detail: null,
    },
    {
      K: 23,
      M2: 24,
      detail: null,
    },
    {
      K: 24,
      M2: 25,
      detail: null,
    },
    {
      K: 25,
      M2: 26,
      detail: null,
    },
    {
      K: 26,
      M2: 27,
      detail: null,
    },
    {
      K: 27,
      M2: 28,
      detail: null,
    },
    {
      K: 28,
      M2: 29,
      detail: null,
    },
    {
      K: 29,
      M2: 30,
      detail: null,
    },
    {
      K: 30,
      M2: 31,
      detail: null,
    },
    {
      K: 31,
      M2: 32,
      detail: null,
    },
    {
      K: 32,
      M2: 33,
      detail: null,
    },
    {
      K: 33,
      M2: 34,
      detail: null,
    },
    {
      K: 34,
      M2: 35,
      detail: null,
    },
    {
      K: 35,
      M2: 36,
      detail: null,
    },
    {
      K: 36,
      M2: 37,
      detail: null,
    },
    {
      K: 37,
      M2: 38,
      detail: null,
    },
    {
      K: 38,
      M2: 39,
      detail: null,
    },
    {
      K: 39,
      M2: 40,
      detail: null,
    },
    {
      K: 40,
      M2: 41,
      detail: null,
    },
    {
      K: 41,
      M2: 42,
      detail: null,
    },
    {
      K: 42,
      M2: 43,
      detail: null,
    },
    {
      K: 43,
      M2: 44,
      detail: null,
    },
    {
      K: 44,
      M2: 45,
      detail: null,
    },
    {
      K: 45,
      M2: 46,
      detail: null,
    },
    {
      K: 46,
      M2: 47,
      detail: null,
    },
    {
      K: 47,
      M2: 48,
      detail: null,
    },
    {
      K: 48,
      M2: 49,
      detail: null,
    },
    {
      K: 49,
      M2: 50,
      detail: null,
    },
    {
      K: 50,
      M2: 51,
      detail: null,
    },
    {
      K: 51,
      M2: 52,
      detail: null,
    },
    {
      K: 52,
      M2: 53,
      detail: null,
    },
    {
      K: 53,
      M2: 54,
      detail: null,
    },
    {
      K: 54,
      M2: 55,
      detail: null,
    },
    {
      K: 55,
      M2: 56,
      detail: null,
    },
    {
      K: 56,
      M2: 57,
      detail: null,
    },
    {
      K: 57,
      M2: 58,
      detail: null,
    },
    {
      K: 58,
      M2: 59,
      detail: null,
    },
    {
      K: 59,
      M2: 60,
      detail: null,
    },
    {
      K: 60,
      M2: 61,
      detail: null,
    },
    {
      K: 61,
      M2: 62,
      detail: null,
    },
    {
      K: 62,
      M2: 63,
      detail: null,
    },
    {
      K: 63,
      M2: 64,
      detail: null,
    },
    {
      K: 64,
      M2: 65,
      detail: null,
    },
    {
      K: 65,
      M2: 66,
      detail: null,
    },
    {
      K: 66,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [67] } },
    },
    {
      K: 67,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [67] } },
    },
    {
      K: null,
      M2: 67,
      detail: { instance: ["M2"], eq: { K: [66, 67] } },
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [73, 74] } },
    },
    {
      K: null,
      M2: 73,
      detail: { instance: ["M2"], eq: { K: [73] } },
    },
    {
      K: null,
      M2: 74,
      detail: { instance: ["M2"], eq: { K: [73] } },
    },
    {
      K: 74,
      M2: 75,
      detail: null,
    },
    {
      K: 75,
      M2: 76,
      detail: null,
    },
    {
      K: 76,
      M2: 77,
      detail: null,
    },
    {
      K: 77,
      M2: 78,
      detail: null,
    },
    {
      K: 78,
      M2: 79,
      detail: null,
    },
    {
      K: 79,
      M2: 80,
      detail: null,
    },
    {
      K: 80,
      M2: 81,
      detail: null,
    },
    {
      K: 81,
      M2: 82,
      detail: null,
    },
    {
      K: 82,
      M2: 83,
      detail: null,
    },
    {
      K: 83,
      M2: 84,
      detail: null,
    },
    {
      K: 84,
      M2: 85,
      detail: null,
    },
    {
      K: 85,
      M2: 86,
      detail: null,
    },
    {
      K: 86,
      M2: 87,
      detail: null,
    },
    {
      K: 87,
      M2: 88,
      detail: null,
    },
    {
      K: 88,
      M2: 89,
      detail: null,
    },
    {
      K: 89,
      M2: 90,
      detail: null,
    },
    {
      K: 90,
      M2: 91,
      detail: null,
    },
    {
      K: 91,
      M2: 92,
      detail: null,
    },
    {
      K: 92,
      M2: 93,
      detail: null,
    },
    {
      K: 93,
      M2: 94,
      detail: null,
    },
    {
      K: 94,
      M2: 95,
      detail: null,
    },
    {
      K: 95,
      M2: 96,
      detail: null,
    },
    {
      K: 96,
      M2: 97,
      detail: null,
    },
    {
      K: 97,
      M2: 98,
      detail: null,
    },
    {
      K: 98,
      M2: 99,
      detail: null,
    },
    {
      K: 99,
      M2: 100,
      detail: null,
    },
    {
      K: 100,
      M2: 101,
      detail: null,
    },
    {
      K: 101,
      M2: 102,
      detail: null,
    },
    {
      K: 102,
      M2: 103,
      detail: null,
    },
    {
      K: 103,
      M2: 104,
      detail: null,
    },
    {
      K: 104,
      M2: 105,
      detail: null,
    },
    {
      K: 105,
      M2: 106,
      detail: null,
    },
    {
      K: 106,
      M2: 107,
      detail: null,
    },
    {
      K: 107,
      M2: 108,
      detail: null,
    },
    {
      K: 108,
      M2: 109,
      detail: null,
    },
    {
      K: 109,
      M2: 110,
      detail: null,
    },
    {
      K: 110,
      M2: 111,
      detail: null,
    },
    {
      K: 111,
      M2: 112,
      detail: null,
    },
    {
      K: 112,
      M2: 113,
      detail: null,
    },
    {
      K: 113,
      M2: 114,
      detail: null,
    },
    {
      K: 114,
      M2: 115,
      detail: null,
    },
    {
      K: 115,
      M2: 116,
      detail: null,
    },
    {
      K: 116,
      M2: 117,
      detail: null,
    },
    {
      K: 117,
      M2: 118,
      detail: null,
    },
    {
      K: 118,
      M2: 119,
      detail: null,
    },
    {
      K: 119,
      M2: 120,
      detail: null,
    },
    {
      K: 120,
      M2: 121,
      detail: null,
    },
    {
      K: 121,
      M2: 122,
      detail: null,
    },
    {
      K: 122,
      M2: 123,
      detail: null,
    },
    {
      K: 123,
      M2: 124,
      detail: null,
    },
    {
      K: 124,
      M2: 125,
      detail: null,
    },
    {
      K: 125,
      M2: 126,
      detail: null,
    },
    {
      K: 126,
      M2: 127,
      detail: null,
    },
    {
      K: 127,
      M2: 128,
      detail: null,
    },
    {
      K: 128,
      M2: 129,
      detail: null,
    },
    {
      K: 129,
      M2: 130,
      detail: null,
    },
    {
      K: 130,
      M2: 131,
      detail: null,
    },
    {
      K: 131,
      M2: 132,
      detail: null,
    },
    {
      K: 132,
      M2: 133,
      detail: null,
    },
    {
      K: 133,
      M2: 134,
      detail: null,
    },
    {
      K: 134,
      M2: 135,
      detail: null,
    },
    {
      K: 135,
      M2: 136,
      detail: null,
    },
    {
      K: 136,
      M2: 137,
      detail: null,
    },
    {
      K: 137,
      M2: 138,
      detail: null,
    },
    {
      K: 138,
      M2: 139,
      detail: null,
    },
    {
      K: 139,
      M2: 140,
      detail: null,
    },
    {
      K: 140,
      M2: 141,
      detail: null,
    },
    {
      K: 141,
      M2: 142,
      detail: null,
    },
    {
      K: 142,
      M2: 143,
      detail: null,
    },
    {
      K: 143,
      M2: 144,
      detail: null,
    },
    {
      K: 144,
      M2: 145,
      detail: null,
    },
    {
      K: 145,
      M2: 146,
      detail: null,
    },
    {
      K: 146,
      M2: 147,
      detail: null,
    },
    {
      K: 147,
      M2: 148,
      detail: null,
    },
    {
      K: 148,
      M2: 149,
      detail: null,
    },
    {
      K: 149,
      M2: 150,
      detail: null,
    },
    {
      K: 150,
      M2: 151,
      detail: null,
    },
    {
      K: 151,
      M2: 152,
      detail: null,
    },
    {
      K: 152,
      M2: 153,
      detail: null,
    },
    {
      K: 153,
      M2: 154,
      detail: null,
    },
    {
      K: 154,
      M2: 155,
      detail: null,
    },
    {
      K: 155,
      M2: 156,
      detail: null,
    },
    {
      K: 156,
      M2: 157,
      detail: null,
    },
    {
      K: 157,
      M2: 158,
      detail: null,
    },
    {
      K: 158,
      M2: 159,
      detail: null,
    },
    {
      K: 159,
      M2: 160,
      detail: null,
    },
    {
      K: 160,
      M2: 161,
      detail: null,
    },
    {
      K: 161,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [162, 163] } },
    },
    {
      K: null,
      M2: 162,
      detail: { instance: ["M2"], eq: { K: [161] } },
    },
    {
      K: null,
      M2: 163,
      detail: { instance: ["M2"], eq: { K: [161] } },
    },
    {
      K: 162,
      M2: 164,
      detail: null,
    },
    {
      K: 163,
      M2: 165,
      detail: null,
    },
    {
      K: 164,
      M2: 166,
      detail: null,
    },
    {
      K: 165,
      M2: 167,
      detail: null,
    },
  ],
  7: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [28] } },
    },
    {
      K: 30,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [28] } },
    },
    {
      K: null,
      M2: 28,
      detail: { instance: ["M2"], eq: { K: [29, 3] } },
    },
    {
      K: 31,
      M2: 29,
      detail: null,
    },
    {
      K: 32,
      M2: 30,
      detail: null,
    },
    {
      K: 33,
      M2: 31,
      detail: null,
    },
    {
      K: 34,
      M2: 32,
      detail: null,
    },
    {
      K: 35,
      M2: 33,
      detail: null,
    },
    {
      K: 36,
      M2: 34,
      detail: null,
    },
    {
      K: 37,
      M2: 35,
      detail: null,
    },
    {
      K: 38,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [36, 37] } },
    },
    {
      K: null,
      M2: 36,
      detail: { instance: ["M2"], eq: { K: [38] } },
    },
    {
      K: null,
      M2: 37,
      detail: { instance: ["M2"], eq: { K: [38] } },
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
    {
      K: 61,
      M2: 60,
      detail: null,
    },
    {
      K: 62,
      M2: 61,
      detail: null,
    },
    {
      K: 63,
      M2: 62,
      detail: null,
    },
    {
      K: 64,
      M2: 63,
      detail: null,
    },
    {
      K: 65,
      M2: 64,
      detail: null,
    },
    {
      K: 66,
      M2: 65,
      detail: null,
    },
    {
      K: 67,
      M2: 66,
      detail: null,
    },
    {
      K: 68,
      M2: 67,
      detail: null,
    },
    {
      K: 69,
      M2: 68,
      detail: null,
    },
    {
      K: 70,
      M2: 69,
      detail: null,
    },
    {
      K: 71,
      M2: 70,
      detail: null,
    },
    {
      K: 72,
      M2: 71,
      detail: null,
    },
    {
      K: 73,
      M2: 72,
      detail: null,
    },
    {
      K: 74,
      M2: 73,
      detail: null,
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
    {
      K: 79,
      M2: 78,
      detail: null,
    },
    {
      K: 80,
      M2: 79,
      detail: null,
    },
    {
      K: 81,
      M2: 80,
      detail: null,
    },
    {
      K: 82,
      M2: 81,
      detail: null,
    },
    {
      K: 83,
      M2: 82,
      detail: null,
    },
    {
      K: 84,
      M2: 83,
      detail: null,
    },
    {
      K: 85,
      M2: 84,
      detail: null,
    },
    {
      K: 86,
      M2: 85,
      detail: null,
    },
    {
      K: 87,
      M2: 86,
      detail: null,
    },
    {
      K: 88,
      M2: 87,
      detail: null,
    },
    {
      K: 89,
      M2: 88,
      detail: null,
    },
    {
      K: 90,
      M2: 89,
      detail: null,
    },
    {
      K: 91,
      M2: 90,
      detail: null,
    },
    {
      K: 92,
      M2: 91,
      detail: null,
    },
    {
      K: 93,
      M2: 92,
      detail: null,
    },
    {
      K: 94,
      M2: 93,
      detail: null,
    },
    {
      K: 95,
      M2: 94,
      detail: null,
    },
    {
      K: 96,
      M2: 95,
      detail: null,
    },
    {
      K: 97,
      M2: 96,
      detail: null,
    },
    {
      K: 98,
      M2: 97,
      detail: null,
    },
    {
      K: 99,
      M2: 98,
      detail: null,
    },
    {
      K: 100,
      M2: 99,
      detail: null,
    },
    {
      K: 101,
      M2: 100,
      detail: null,
    },
    {
      K: 102,
      M2: 101,
      detail: null,
    },
    {
      K: 103,
      M2: 102,
      detail: null,
    },
    {
      K: 104,
      M2: 103,
      detail: null,
    },
    {
      K: 105,
      M2: 104,
      detail: null,
    },
    {
      K: 106,
      M2: 105,
      detail: null,
    },
    {
      K: 107,
      M2: 106,
      detail: null,
    },
    {
      K: 108,
      M2: 107,
      detail: null,
    },
    {
      K: 109,
      M2: 108,
      detail: null,
    },
    {
      K: 110,
      M2: 109,
      detail: null,
    },
    {
      K: 111,
      M2: 110,
      detail: null,
    },
    {
      K: 112,
      M2: 111,
      detail: null,
    },
    {
      K: 113,
      M2: 112,
      detail: null,
    },
    {
      K: 114,
      M2: 113,
      detail: null,
    },
    {
      K: 115,
      M2: 114,
      detail: null,
    },
    {
      K: 116,
      M2: 115,
      detail: null,
    },
    {
      K: 117,
      M2: 116,
      detail: null,
    },
    {
      K: 118,
      M2: 117,
      detail: null,
    },
    {
      K: 119,
      M2: 118,
      detail: null,
    },
    {
      K: 120,
      M2: 119,
      detail: null,
    },
    {
      K: 121,
      M2: 120,
      detail: null,
    },
    {
      K: 122,
      M2: 121,
      detail: null,
    },
    {
      K: 123,
      M2: 122,
      detail: null,
    },
    {
      K: 124,
      M2: 123,
      detail: null,
    },
    {
      K: 125,
      M2: 124,
      detail: null,
    },
    {
      K: 126,
      M2: 125,
      detail: null,
    },
    {
      K: 127,
      M2: 126,
      detail: null,
    },
    {
      K: 128,
      M2: 127,
      detail: null,
    },
    {
      K: 129,
      M2: 128,
      detail: null,
    },
    {
      K: 130,
      M2: 129,
      detail: null,
    },
    {
      K: 131,
      M2: 130,
      detail: null,
    },
    {
      K: 132,
      M2: 131,
      detail: null,
    },
    {
      K: 133,
      M2: 132,
      detail: null,
    },
    {
      K: 134,
      M2: 133,
      detail: null,
    },
    {
      K: 135,
      M2: 134,
      detail: null,
    },
    {
      K: 136,
      M2: 135,
      detail: null,
    },
    {
      K: 137,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [136, 137] } },
    },
    {
      K: null,
      M2: 136,
      detail: { instance: ["M2"], eq: { K: [137] } },
    },
    {
      K: null,
      M2: 137,
      detail: { instance: ["M2"], eq: { K: [137] } },
    },
    {
      K: 138,
      M2: 138,
      detail: null,
    },
    {
      K: 139,
      M2: 139,
      detail: null,
    },
    {
      K: 140,
      M2: 140,
      detail: null,
    },
    {
      K: 141,
      M2: 141,
      detail: null,
    },
    {
      K: 142,
      M2: 142,
      detail: null,
    },
    {
      K: 143,
      M2: 143,
      detail: null,
    },
    {
      K: 144,
      M2: 144,
      detail: null,
    },
    {
      K: 145,
      M2: 145,
      detail: null,
    },
    {
      K: 146,
      M2: 146,
      detail: null,
    },
    {
      K: 147,
      M2: 147,
      detail: null,
    },
    {
      K: 148,
      M2: 148,
      detail: null,
    },
    {
      K: 149,
      M2: 149,
      detail: null,
    },
    {
      K: 150,
      M2: 150,
      detail: null,
    },
    {
      K: 151,
      M2: 151,
      detail: null,
    },
    {
      K: 152,
      M2: 152,
      detail: null,
    },
    {
      K: 153,
      M2: 153,
      detail: null,
    },
    {
      K: 154,
      M2: 154,
      detail: null,
    },
    {
      K: 155,
      M2: 155,
      detail: null,
    },
    {
      K: 156,
      M2: 156,
      detail: null,
    },
    {
      K: 157,
      M2: 157,
      detail: null,
    },
    {
      K: 158,
      M2: 158,
      detail: null,
    },
    {
      K: 159,
      M2: 159,
      detail: null,
    },
    {
      K: 160,
      M2: 160,
      detail: null,
    },
    {
      K: 161,
      M2: 161,
      detail: null,
    },
    {
      K: 162,
      M2: 162,
      detail: null,
    },
    {
      K: 163,
      M2: 163,
      detail: null,
    },
    {
      K: 164,
      M2: 164,
      detail: null,
    },
    {
      K: 165,
      M2: 165,
      detail: null,
    },
    {
      K: 166,
      M2: 166,
      detail: null,
    },
    {
      K: 167,
      M2: 167,
      detail: null,
    },
    {
      K: 168,
      M2: 168,
      detail: null,
    },
    {
      K: 169,
      M2: 169,
      detail: null,
    },
    {
      K: 170,
      M2: 170,
      detail: null,
    },
    {
      K: 171,
      M2: 171,
      detail: null,
    },
    {
      K: 172,
      M2: 172,
      detail: null,
    },
    {
      K: 173,
      M2: 173,
      detail: null,
    },
    {
      K: 174,
      M2: 174,
      detail: null,
    },
    {
      K: 175,
      M2: 175,
      detail: null,
    },
    {
      K: 176,
      M2: 176,
      detail: null,
    },
    {
      K: 177,
      M2: 177,
      detail: null,
    },
    {
      K: 178,
      M2: 178,
      detail: null,
    },
    {
      K: 179,
      M2: 179,
      detail: null,
    },
    {
      K: 180,
      M2: 180,
      detail: null,
    },
    {
      K: 181,
      M2: 181,
      detail: null,
    },
    {
      K: 182,
      M2: 182,
      detail: null,
    },
    {
      K: 183,
      M2: 183,
      detail: null,
    },
    {
      K: 184,
      M2: 184,
      detail: null,
    },
    {
      K: 185,
      M2: 185,
      detail: null,
    },
    {
      K: 186,
      M2: 186,
      detail: null,
    },
    {
      K: 187,
      M2: 187,
      detail: null,
    },
    {
      K: 188,
      M2: 188,
      detail: null,
    },
    {
      K: 189,
      M2: 189,
      detail: null,
    },
    {
      K: 190,
      M2: 190,
      detail: null,
    },
    {
      K: 191,
      M2: 191,
      detail: null,
    },
    {
      K: 192,
      M2: 192,
      detail: null,
    },
    {
      K: 193,
      M2: 193,
      detail: null,
    },
    {
      K: 194,
      M2: 194,
      detail: null,
    },
    {
      K: 195,
      M2: 195,
      detail: null,
    },
    {
      K: 196,
      M2: 196,
      detail: null,
    },
    {
      K: 197,
      M2: 197,
      detail: null,
    },
    {
      K: 198,
      M2: 198,
      detail: null,
    },
    {
      K: 199,
      M2: 199,
      detail: null,
    },
    {
      K: 200,
      M2: 200,
      detail: null,
    },
    {
      K: 201,
      M2: 201,
      detail: null,
    },
    {
      K: 202,
      M2: 202,
      detail: null,
    },
    {
      K: 203,
      M2: 203,
      detail: null,
    },
    {
      K: 204,
      M2: 204,
      detail: null,
    },
    {
      K: 205,
      M2: 205,
      detail: null,
    },
    {
      K: 206,
      M2: 206,
      detail: null,
    },
  ],
  8: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [42, 43] } },
    },
    {
      K: null,
      M2: 42,
      detail: { instance: ["M2"], eq: { K: [42] } },
    },
    {
      K: null,
      M2: 43,
      detail: { instance: ["M2"], eq: { K: [42] } },
    },
    {
      K: 43,
      M2: 44,
      detail: null,
    },
    {
      K: 44,
      M2: 45,
      detail: null,
    },
    {
      K: 45,
      M2: 46,
      detail: null,
    },
    {
      K: 46,
      M2: 47,
      detail: null,
    },
    {
      K: 47,
      M2: 48,
      detail: null,
    },
    {
      K: 48,
      M2: 49,
      detail: null,
    },
    {
      K: 49,
      M2: 50,
      detail: null,
    },
    {
      K: 50,
      M2: 51,
      detail: null,
    },
    {
      K: 51,
      M2: 52,
      detail: null,
    },
    {
      K: 52,
      M2: 53,
      detail: null,
    },
    {
      K: 53,
      M2: 54,
      detail: null,
    },
    {
      K: 54,
      M2: 55,
      detail: null,
    },
    {
      K: 55,
      M2: 56,
      detail: null,
    },
    {
      K: 56,
      M2: 57,
      detail: null,
    },
    {
      K: 57,
      M2: 58,
      detail: null,
    },
    {
      K: 58,
      M2: 59,
      detail: null,
    },
    {
      K: 59,
      M2: 60,
      detail: null,
    },
    {
      K: 60,
      M2: 61,
      detail: null,
    },
    {
      K: 61,
      M2: 62,
      detail: null,
    },
    {
      K: 62,
      M2: 63,
      detail: null,
    },
    {
      K: 63,
      M2: 64,
      detail: null,
    },
    {
      K: 64,
      M2: 65,
      detail: null,
    },
    {
      K: 65,
      M2: 66,
      detail: null,
    },
    {
      K: 66,
      M2: 67,
      detail: null,
    },
    {
      K: 67,
      M2: 68,
      detail: null,
    },
    {
      K: 68,
      M2: 69,
      detail: null,
    },
    {
      K: 69,
      M2: 70,
      detail: null,
    },
    {
      K: 70,
      M2: 71,
      detail: null,
    },
    {
      K: 71,
      M2: 72,
      detail: null,
    },
    {
      K: 72,
      M2: 73,
      detail: null,
    },
    {
      K: 73,
      M2: 74,
      detail: null,
    },
    {
      K: 74,
      M2: 75,
      detail: null,
    },
    {
      K: 75,
      M2: 76,
      detail: null,
    },
  ],
  9: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [70, 71] } },
    },
    {
      K: null,
      M2: 70,
      detail: { instance: ["M2"], eq: { K: [70] } },
    },
    {
      K: null,
      M2: 71,
      detail: { instance: ["M2"], eq: { K: [70] } },
    },
    {
      K: 71,
      M2: 72,
      detail: null,
    },
    {
      K: 72,
      M2: 73,
      detail: null,
    },
    {
      K: 73,
      M2: 74,
      detail: null,
    },
    {
      K: 74,
      M2: 75,
      detail: null,
    },
    {
      K: 75,
      M2: 76,
      detail: null,
    },
    {
      K: 76,
      M2: 77,
      detail: null,
    },
    {
      K: 77,
      M2: 78,
      detail: null,
    },
    {
      K: 78,
      M2: 79,
      detail: null,
    },
    {
      K: 79,
      M2: 80,
      detail: null,
    },
    {
      K: 80,
      M2: 81,
      detail: null,
    },
    {
      K: 81,
      M2: 82,
      detail: null,
    },
    {
      K: 82,
      M2: 83,
      detail: null,
    },
    {
      K: 83,
      M2: 84,
      detail: null,
    },
    {
      K: 84,
      M2: 85,
      detail: null,
    },
    {
      K: 85,
      M2: 86,
      detail: null,
    },
    {
      K: 86,
      M2: 87,
      detail: null,
    },
    {
      K: 87,
      M2: 88,
      detail: null,
    },
    {
      K: 88,
      M2: 89,
      detail: null,
    },
    {
      K: 89,
      M2: 90,
      detail: null,
    },
    {
      K: 90,
      M2: 91,
      detail: null,
    },
    {
      K: 91,
      M2: 92,
      detail: null,
    },
    {
      K: 92,
      M2: 93,
      detail: null,
    },
    {
      K: 93,
      M2: 94,
      detail: null,
    },
    {
      K: 94,
      M2: 95,
      detail: null,
    },
    {
      K: 95,
      M2: 96,
      detail: null,
    },
    {
      K: 96,
      M2: 97,
      detail: null,
    },
    {
      K: 97,
      M2: 98,
      detail: null,
    },
    {
      K: 98,
      M2: 99,
      detail: null,
    },
    {
      K: 99,
      M2: 100,
      detail: null,
    },
    {
      K: 100,
      M2: 101,
      detail: null,
    },
    {
      K: 101,
      M2: 102,
      detail: null,
    },
    {
      K: 102,
      M2: 103,
      detail: null,
    },
    {
      K: 103,
      M2: 104,
      detail: null,
    },
    {
      K: 104,
      M2: 105,
      detail: null,
    },
    {
      K: 105,
      M2: 106,
      detail: null,
    },
    {
      K: 106,
      M2: 107,
      detail: null,
    },
    {
      K: 107,
      M2: 108,
      detail: null,
    },
    {
      K: 108,
      M2: 109,
      detail: null,
    },
    {
      K: 109,
      M2: 110,
      detail: null,
    },
    {
      K: 110,
      M2: 111,
      detail: null,
    },
    {
      K: 111,
      M2: 112,
      detail: null,
    },
    {
      K: 112,
      M2: 113,
      detail: null,
    },
    {
      K: 113,
      M2: 114,
      detail: null,
    },
    {
      K: 114,
      M2: 115,
      detail: null,
    },
    {
      K: 115,
      M2: 116,
      detail: null,
    },
    {
      K: 116,
      M2: 117,
      detail: null,
    },
    {
      K: 117,
      M2: 118,
      detail: null,
    },
    {
      K: 118,
      M2: 119,
      detail: null,
    },
    {
      K: 119,
      M2: 120,
      detail: null,
    },
    {
      K: 120,
      M2: 121,
      detail: null,
    },
    {
      K: 121,
      M2: 122,
      detail: null,
    },
    {
      K: 122,
      M2: 123,
      detail: null,
    },
    {
      K: 123,
      M2: 124,
      detail: null,
    },
    {
      K: 124,
      M2: 125,
      detail: null,
    },
    {
      K: 125,
      M2: 126,
      detail: null,
    },
    {
      K: 126,
      M2: 127,
      detail: null,
    },
    {
      K: 127,
      M2: 128,
      detail: null,
    },
    {
      K: 128,
      M2: 129,
      detail: null,
    },
    {
      K: 129,
      M2: 130,
      detail: null,
    },
  ],
  10: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
    {
      K: 74,
      M2: 74,
      detail: null,
    },
    {
      K: 75,
      M2: 75,
      detail: null,
    },
    {
      K: 76,
      M2: 76,
      detail: null,
    },
    {
      K: 77,
      M2: 77,
      detail: null,
    },
    {
      K: 78,
      M2: 78,
      detail: null,
    },
    {
      K: 79,
      M2: 79,
      detail: null,
    },
    {
      K: 80,
      M2: 80,
      detail: null,
    },
    {
      K: 81,
      M2: 81,
      detail: null,
    },
    {
      K: 82,
      M2: 82,
      detail: null,
    },
    {
      K: 83,
      M2: 83,
      detail: null,
    },
    {
      K: 84,
      M2: 84,
      detail: null,
    },
    {
      K: 85,
      M2: 85,
      detail: null,
    },
    {
      K: 86,
      M2: 86,
      detail: null,
    },
    {
      K: 87,
      M2: 87,
      detail: null,
    },
    {
      K: 88,
      M2: 88,
      detail: null,
    },
    {
      K: 89,
      M2: 89,
      detail: null,
    },
    {
      K: 90,
      M2: 90,
      detail: null,
    },
    {
      K: 91,
      M2: 91,
      detail: null,
    },
    {
      K: 92,
      M2: 92,
      detail: null,
    },
    {
      K: 93,
      M2: 93,
      detail: null,
    },
    {
      K: 94,
      M2: 94,
      detail: null,
    },
    {
      K: 95,
      M2: 95,
      detail: null,
    },
    {
      K: 96,
      M2: 96,
      detail: null,
    },
    {
      K: 97,
      M2: 97,
      detail: null,
    },
    {
      K: 98,
      M2: 98,
      detail: null,
    },
    {
      K: 99,
      M2: 99,
      detail: null,
    },
    {
      K: 100,
      M2: 100,
      detail: null,
    },
    {
      K: 101,
      M2: 101,
      detail: null,
    },
    {
      K: 102,
      M2: 102,
      detail: null,
    },
    {
      K: 103,
      M2: 103,
      detail: null,
    },
    {
      K: 104,
      M2: 104,
      detail: null,
    },
    {
      K: 105,
      M2: 105,
      detail: null,
    },
    {
      K: 106,
      M2: 106,
      detail: null,
    },
    {
      K: 107,
      M2: 107,
      detail: null,
    },
    {
      K: 108,
      M2: 108,
      detail: null,
    },
    {
      K: 109,
      M2: 109,
      detail: null,
    },
  ],
  11: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [54] } },
    },
    {
      K: 55,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [54] } },
    },
    {
      K: null,
      M2: 54,
      detail: { instance: ["M2"], eq: { K: [54, 55] } },
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
    {
      K: 61,
      M2: 60,
      detail: null,
    },
    {
      K: 62,
      M2: 61,
      detail: null,
    },
    {
      K: 63,
      M2: 62,
      detail: null,
    },
    {
      K: 64,
      M2: 63,
      detail: null,
    },
    {
      K: 65,
      M2: 64,
      detail: null,
    },
    {
      K: 66,
      M2: 65,
      detail: null,
    },
    {
      K: 67,
      M2: 66,
      detail: null,
    },
    {
      K: 68,
      M2: 67,
      detail: null,
    },
    {
      K: 69,
      M2: 68,
      detail: null,
    },
    {
      K: 70,
      M2: 69,
      detail: null,
    },
    {
      K: 71,
      M2: 70,
      detail: null,
    },
    {
      K: 72,
      M2: 71,
      detail: null,
    },
    {
      K: 73,
      M2: 72,
      detail: null,
    },
    {
      K: 74,
      M2: 73,
      detail: null,
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
    {
      K: 79,
      M2: 78,
      detail: null,
    },
    {
      K: 80,
      M2: 79,
      detail: null,
    },
    {
      K: 81,
      M2: 80,
      detail: null,
    },
    {
      K: 82,
      M2: 81,
      detail: null,
    },
    {
      K: 83,
      M2: 82,
      detail: null,
    },
    {
      K: 84,
      M2: 83,
      detail: null,
    },
    {
      K: 85,
      M2: 84,
      detail: null,
    },
    {
      K: 86,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [85, 86] } },
    },
    {
      K: null,
      M2: 85,
      detail: { instance: ["M2"], eq: { K: [86] } },
    },
    {
      K: null,
      M2: 86,
      detail: { instance: ["M2"], eq: { K: [86] } },
    },
    {
      K: 87,
      M2: 87,
      detail: null,
    },
    {
      K: 88,
      M2: 88,
      detail: null,
    },
    {
      K: 89,
      M2: 89,
      detail: null,
    },
    {
      K: 90,
      M2: 90,
      detail: null,
    },
    {
      K: 91,
      M2: 91,
      detail: null,
    },
    {
      K: 92,
      M2: 92,
      detail: null,
    },
    {
      K: 93,
      M2: 93,
      detail: null,
    },
    {
      K: 94,
      M2: 94,
      detail: null,
    },
    {
      K: 95,
      M2: 95,
      detail: null,
    },
    {
      K: 96,
      M2: 96,
      detail: null,
    },
    {
      K: 97,
      M2: 97,
      detail: null,
    },
    {
      K: 98,
      M2: 98,
      detail: null,
    },
    {
      K: 99,
      M2: 99,
      detail: null,
    },
    {
      K: 100,
      M2: 100,
      detail: null,
    },
    {
      K: 101,
      M2: 101,
      detail: null,
    },
    {
      K: 102,
      M2: 102,
      detail: null,
    },
    {
      K: 103,
      M2: 103,
      detail: null,
    },
    {
      K: 104,
      M2: 104,
      detail: null,
    },
    {
      K: 105,
      M2: 105,
      detail: null,
    },
    {
      K: 106,
      M2: 106,
      detail: null,
    },
    {
      K: 107,
      M2: 107,
      detail: null,
    },
    {
      K: 108,
      M2: 108,
      detail: null,
    },
    {
      K: 109,
      M2: 109,
      detail: null,
    },
    {
      K: 110,
      M2: 110,
      detail: null,
    },
    {
      K: 111,
      M2: 111,
      detail: null,
    },
    {
      K: 112,
      M2: 112,
      detail: null,
    },
    {
      K: 113,
      M2: 113,
      detail: null,
    },
    {
      K: 114,
      M2: 114,
      detail: null,
    },
    {
      K: 115,
      M2: 115,
      detail: null,
    },
    {
      K: 116,
      M2: 116,
      detail: null,
    },
    {
      K: 117,
      M2: 117,
      detail: null,
    },
    {
      K: 118,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [118] } },
    },
    {
      K: 119,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [118] } },
    },
    {
      K: null,
      M2: 118,
      detail: { instance: ["M2"], eq: { K: [118, 119] } },
    },
    {
      K: 120,
      M2: 119,
      detail: null,
    },
    {
      K: 121,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [120] } },
    },
    {
      K: 122,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [120] } },
    },
    {
      K: null,
      M2: 120,
      detail: { instance: ["M2"], eq: { K: [121, 122] } },
    },
    {
      K: 123,
      M2: 121,
      detail: null,
    },
  ],
  12: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
    {
      K: 74,
      M2: 74,
      detail: null,
    },
    {
      K: 75,
      M2: 75,
      detail: null,
    },
    {
      K: 76,
      M2: 76,
      detail: null,
    },
    {
      K: 77,
      M2: 77,
      detail: null,
    },
    {
      K: 78,
      M2: 78,
      detail: null,
    },
    {
      K: 79,
      M2: 79,
      detail: null,
    },
    {
      K: 80,
      M2: 80,
      detail: null,
    },
    {
      K: 81,
      M2: 81,
      detail: null,
    },
    {
      K: 82,
      M2: 82,
      detail: null,
    },
    {
      K: 83,
      M2: 83,
      detail: null,
    },
    {
      K: 84,
      M2: 84,
      detail: null,
    },
    {
      K: 85,
      M2: 85,
      detail: null,
    },
    {
      K: 86,
      M2: 86,
      detail: null,
    },
    {
      K: 87,
      M2: 87,
      detail: null,
    },
    {
      K: 88,
      M2: 88,
      detail: null,
    },
    {
      K: 89,
      M2: 89,
      detail: null,
    },
    {
      K: 90,
      M2: 90,
      detail: null,
    },
    {
      K: 91,
      M2: 91,
      detail: null,
    },
    {
      K: 92,
      M2: 92,
      detail: null,
    },
    {
      K: 93,
      M2: 93,
      detail: null,
    },
    {
      K: 94,
      M2: 94,
      detail: null,
    },
    {
      K: 95,
      M2: 95,
      detail: null,
    },
    {
      K: 96,
      M2: 96,
      detail: null,
    },
    {
      K: 97,
      M2: 97,
      detail: null,
    },
    {
      K: 98,
      M2: 98,
      detail: null,
    },
    {
      K: 99,
      M2: 99,
      detail: null,
    },
    {
      K: 100,
      M2: 100,
      detail: null,
    },
    {
      K: 101,
      M2: 101,
      detail: null,
    },
    {
      K: 102,
      M2: 102,
      detail: null,
    },
    {
      K: 103,
      M2: 103,
      detail: null,
    },
    {
      K: 104,
      M2: 104,
      detail: null,
    },
    {
      K: 105,
      M2: 105,
      detail: null,
    },
    {
      K: 106,
      M2: 106,
      detail: null,
    },
    {
      K: 107,
      M2: 107,
      detail: null,
    },
    {
      K: 108,
      M2: 108,
      detail: null,
    },
    {
      K: 109,
      M2: 109,
      detail: null,
    },
    {
      K: 110,
      M2: 110,
      detail: null,
    },
    {
      K: 111,
      M2: 111,
      detail: null,
    },
  ],
  13: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [5, 6] } },
    },
    {
      K: null,
      M2: 5,
      detail: { instance: ["M2"], eq: { K: [5] } },
    },
    {
      K: null,
      M2: 6,
      detail: { instance: ["M2"], eq: { K: [5] } },
    },
    {
      K: 6,
      M2: 7,
      detail: null,
    },
    {
      K: 7,
      M2: 8,
      detail: null,
    },
    {
      K: 8,
      M2: 9,
      detail: null,
    },
    {
      K: 9,
      M2: 10,
      detail: null,
    },
    {
      K: 10,
      M2: 11,
      detail: null,
    },
    {
      K: 11,
      M2: 12,
      detail: null,
    },
    {
      K: 12,
      M2: 13,
      detail: null,
    },
    {
      K: 13,
      M2: 14,
      detail: null,
    },
    {
      K: 14,
      M2: 15,
      detail: null,
    },
    {
      K: 15,
      M2: 16,
      detail: null,
    },
    {
      K: 16,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [17, 18] } },
    },
    {
      K: null,
      M2: 17,
      detail: { instance: ["M2"], eq: { K: [16] } },
    },
    {
      K: null,
      M2: 18,
      detail: { instance: ["M2"], eq: { K: [16] } },
    },
    {
      K: 17,
      M2: 19,
      detail: null,
    },
    {
      K: 18,
      M2: 20,
      detail: null,
    },
    {
      K: 19,
      M2: 21,
      detail: null,
    },
    {
      K: 20,
      M2: 22,
      detail: null,
    },
    {
      K: 21,
      M2: 23,
      detail: null,
    },
    {
      K: 22,
      M2: 24,
      detail: null,
    },
    {
      K: 23,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [25] } },
    },
    {
      K: 24,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [25] } },
    },
    {
      K: null,
      M2: 25,
      detail: { instance: ["M2"], eq: { K: [23, 24] } },
    },
    {
      K: 25,
      M2: 26,
      detail: null,
    },
    {
      K: 26,
      M2: 27,
      detail: null,
    },
    {
      K: 27,
      M2: 28,
      detail: null,
    },
    {
      K: 28,
      M2: 29,
      detail: null,
    },
    {
      K: 29,
      M2: 30,
      detail: null,
    },
    {
      K: 30,
      M2: 31,
      detail: null,
    },
    {
      K: 31,
      M2: 32,
      detail: null,
    },
    {
      K: 32,
      M2: 33,
      detail: null,
    },
    {
      K: 33,
      M2: 34,
      detail: null,
    },
    {
      K: 34,
      M2: 35,
      detail: null,
    },
    {
      K: 35,
      M2: 36,
      detail: null,
    },
    {
      K: 36,
      M2: 37,
      detail: null,
    },
    {
      K: 37,
      M2: 38,
      detail: null,
    },
    {
      K: 38,
      M2: 39,
      detail: null,
    },
    {
      K: 39,
      M2: 40,
      detail: null,
    },
    {
      K: 40,
      M2: 41,
      detail: null,
    },
    {
      K: 41,
      M2: 42,
      detail: null,
    },
    {
      K: 42,
      M2: 43,
      detail: null,
    },
    {
      K: 43,
      M2: 44,
      detail: null,
    },
  ],
  14: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1, 2] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1] } },
    },
    {
      K: null,
      M2: 2,
      detail: { instance: ["M2"], eq: { K: [1] } },
    },
    {
      K: 2,
      M2: 3,
      detail: null,
    },
    {
      K: 3,
      M2: 4,
      detail: null,
    },
    {
      K: 4,
      M2: 5,
      detail: null,
    },
    {
      K: 5,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [6, 7] } },
    },
    {
      K: null,
      M2: 6,
      detail: { instance: ["M2"], eq: { K: [5] } },
    },
    {
      K: null,
      M2: 7,
      detail: { instance: ["M2"], eq: { K: [5] } },
    },
    {
      K: 6,
      M2: 8,
      detail: null,
    },
    {
      K: 7,
      M2: 9,
      detail: null,
    },
    {
      K: 8,
      M2: 10,
      detail: null,
    },
    {
      K: 9,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [11, 12] } },
    },
    {
      K: null,
      M2: 11,
      detail: { instance: ["M2"], eq: { K: [9] } },
    },
    {
      K: null,
      M2: 12,
      detail: { instance: ["M2"], eq: { K: [9] } },
    },
    {
      K: 10,
      M2: 13,
      detail: null,
    },
    {
      K: 11,
      M2: 14,
      detail: null,
    },
    {
      K: 12,
      M2: 15,
      detail: null,
    },
    {
      K: 13,
      M2: 16,
      detail: null,
    },
    {
      K: 14,
      M2: 17,
      detail: null,
    },
    {
      K: 15,
      M2: 18,
      detail: null,
    },
    {
      K: 16,
      M2: 19,
      detail: null,
    },
    {
      K: 17,
      M2: 20,
      detail: null,
    },
    {
      K: 18,
      M2: 21,
      detail: null,
    },
    {
      K: 19,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [22] } },
    },
    {
      K: 20,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [22] } },
    },
    {
      K: null,
      M2: 22,
      detail: { instance: ["M2"], eq: { K: [19, 2] } },
    },
    {
      K: 21,
      M2: 23,
      detail: null,
    },
    {
      K: 22,
      M2: 24,
      detail: null,
    },
    {
      K: 23,
      M2: 25,
      detail: null,
    },
    {
      K: 24,
      M2: 26,
      detail: null,
    },
    {
      K: 25,
      M2: 27,
      detail: null,
    },
    {
      K: 26,
      M2: 28,
      detail: null,
    },
    {
      K: 27,
      M2: 29,
      detail: null,
    },
    {
      K: 28,
      M2: 30,
      detail: null,
    },
    {
      K: 29,
      M2: 31,
      detail: null,
    },
    {
      K: 30,
      M2: 32,
      detail: null,
    },
    {
      K: 31,
      M2: 33,
      detail: null,
    },
    {
      K: 32,
      M2: 34,
      detail: null,
    },
    {
      K: 33,
      M2: 35,
      detail: null,
    },
    {
      K: 34,
      M2: 36,
      detail: null,
    },
    {
      K: 35,
      M2: 37,
      detail: null,
    },
    {
      K: 36,
      M2: 38,
      detail: null,
    },
    {
      K: 37,
      M2: 39,
      detail: null,
    },
    {
      K: 38,
      M2: 40,
      detail: null,
    },
    {
      K: 39,
      M2: 41,
      detail: null,
    },
    {
      K: 40,
      M2: 42,
      detail: null,
    },
    {
      K: 41,
      M2: 43,
      detail: null,
    },
    {
      K: 42,
      M2: 44,
      detail: null,
    },
    {
      K: 43,
      M2: 45,
      detail: null,
    },
    {
      K: 44,
      M2: 46,
      detail: null,
    },
    {
      K: 45,
      M2: 47,
      detail: null,
    },
    {
      K: 46,
      M2: 48,
      detail: null,
    },
    {
      K: 47,
      M2: 49,
      detail: null,
    },
    {
      K: 48,
      M2: 50,
      detail: null,
    },
    {
      K: 49,
      M2: 51,
      detail: null,
    },
    {
      K: 50,
      M2: 52,
      detail: null,
    },
    {
      K: 51,
      M2: 53,
      detail: null,
    },
    {
      K: 52,
      M2: 54,
      detail: null,
    },
  ],
  15: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
    {
      K: 74,
      M2: 74,
      detail: null,
    },
    {
      K: 75,
      M2: 75,
      detail: null,
    },
    {
      K: 76,
      M2: 76,
      detail: null,
    },
    {
      K: 77,
      M2: 77,
      detail: null,
    },
    {
      K: 78,
      M2: 78,
      detail: null,
    },
    {
      K: 79,
      M2: 79,
      detail: null,
    },
    {
      K: 80,
      M2: 80,
      detail: null,
    },
    {
      K: 81,
      M2: 81,
      detail: null,
    },
    {
      K: 82,
      M2: 82,
      detail: null,
    },
    {
      K: 83,
      M2: 83,
      detail: null,
    },
    {
      K: 84,
      M2: 84,
      detail: null,
    },
    {
      K: 85,
      M2: 85,
      detail: null,
    },
    {
      K: 86,
      M2: 86,
      detail: null,
    },
    {
      K: 87,
      M2: 87,
      detail: null,
    },
    {
      K: 88,
      M2: 88,
      detail: null,
    },
    {
      K: 89,
      M2: 89,
      detail: null,
    },
    {
      K: 90,
      M2: 90,
      detail: null,
    },
    {
      K: 91,
      M2: 91,
      detail: null,
    },
    {
      K: 92,
      M2: 92,
      detail: null,
    },
    {
      K: 93,
      M2: 93,
      detail: null,
    },
    {
      K: 94,
      M2: 94,
      detail: null,
    },
    {
      K: 95,
      M2: 95,
      detail: null,
    },
    {
      K: 96,
      M2: 96,
      detail: null,
    },
    {
      K: 97,
      M2: 97,
      detail: null,
    },
    {
      K: 98,
      M2: 98,
      detail: null,
    },
    {
      K: 99,
      M2: 99,
      detail: null,
    },
  ],
  16: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
    {
      K: 74,
      M2: 74,
      detail: null,
    },
    {
      K: 75,
      M2: 75,
      detail: null,
    },
    {
      K: 76,
      M2: 76,
      detail: null,
    },
    {
      K: 77,
      M2: 77,
      detail: null,
    },
    {
      K: 78,
      M2: 78,
      detail: null,
    },
    {
      K: 79,
      M2: 79,
      detail: null,
    },
    {
      K: 80,
      M2: 80,
      detail: null,
    },
    {
      K: 81,
      M2: 81,
      detail: null,
    },
    {
      K: 82,
      M2: 82,
      detail: null,
    },
    {
      K: 83,
      M2: 83,
      detail: null,
    },
    {
      K: 84,
      M2: 84,
      detail: null,
    },
    {
      K: 85,
      M2: 85,
      detail: null,
    },
    {
      K: 86,
      M2: 86,
      detail: null,
    },
    {
      K: 87,
      M2: 87,
      detail: null,
    },
    {
      K: 88,
      M2: 88,
      detail: null,
    },
    {
      K: 89,
      M2: 89,
      detail: null,
    },
    {
      K: 90,
      M2: 90,
      detail: null,
    },
    {
      K: 91,
      M2: 91,
      detail: null,
    },
    {
      K: 92,
      M2: 92,
      detail: null,
    },
    {
      K: 93,
      M2: 93,
      detail: null,
    },
    {
      K: 94,
      M2: 94,
      detail: null,
    },
    {
      K: 95,
      M2: 95,
      detail: null,
    },
    {
      K: 96,
      M2: 96,
      detail: null,
    },
    {
      K: 97,
      M2: 97,
      detail: null,
    },
    {
      K: 98,
      M2: 98,
      detail: null,
    },
    {
      K: 99,
      M2: 99,
      detail: null,
    },
    {
      K: 100,
      M2: 100,
      detail: null,
    },
    {
      K: 101,
      M2: 101,
      detail: null,
    },
    {
      K: 102,
      M2: 102,
      detail: null,
    },
    {
      K: 103,
      M2: 103,
      detail: null,
    },
    {
      K: 104,
      M2: 104,
      detail: null,
    },
    {
      K: 105,
      M2: 105,
      detail: null,
    },
    {
      K: 106,
      M2: 106,
      detail: null,
    },
    {
      K: 107,
      M2: 107,
      detail: null,
    },
    {
      K: 108,
      M2: 108,
      detail: null,
    },
    {
      K: 109,
      M2: 109,
      detail: null,
    },
    {
      K: 110,
      M2: 110,
      detail: null,
    },
    {
      K: 111,
      M2: 111,
      detail: null,
    },
    {
      K: 112,
      M2: 112,
      detail: null,
    },
    {
      K: 113,
      M2: 113,
      detail: null,
    },
    {
      K: 114,
      M2: 114,
      detail: null,
    },
    {
      K: 115,
      M2: 115,
      detail: null,
    },
    {
      K: 116,
      M2: 116,
      detail: null,
    },
    {
      K: 117,
      M2: 117,
      detail: null,
    },
    {
      K: 118,
      M2: 118,
      detail: null,
    },
    {
      K: 119,
      M2: 119,
      detail: null,
    },
    {
      K: 120,
      M2: 120,
      detail: null,
    },
    {
      K: 121,
      M2: 121,
      detail: null,
    },
    {
      K: 122,
      M2: 122,
      detail: null,
    },
    {
      K: 123,
      M2: 123,
      detail: null,
    },
    {
      K: 124,
      M2: 124,
      detail: null,
    },
    {
      K: 125,
      M2: 125,
      detail: null,
    },
    {
      K: 126,
      M2: 126,
      detail: null,
    },
    {
      K: 127,
      M2: 127,
      detail: null,
    },
    {
      K: 128,
      M2: 128,
      detail: null,
    },
  ],
  17: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
    {
      K: 74,
      M2: 74,
      detail: null,
    },
    {
      K: 75,
      M2: 75,
      detail: null,
    },
    {
      K: 76,
      M2: 76,
      detail: null,
    },
    {
      K: 77,
      M2: 77,
      detail: null,
    },
    {
      K: 78,
      M2: 78,
      detail: null,
    },
    {
      K: 79,
      M2: 79,
      detail: null,
    },
    {
      K: 80,
      M2: 80,
      detail: null,
    },
    {
      K: 81,
      M2: 81,
      detail: null,
    },
    {
      K: 82,
      M2: 82,
      detail: null,
    },
    {
      K: 83,
      M2: 83,
      detail: null,
    },
    {
      K: 84,
      M2: 84,
      detail: null,
    },
    {
      K: 85,
      M2: 85,
      detail: null,
    },
    {
      K: 86,
      M2: 86,
      detail: null,
    },
    {
      K: 87,
      M2: 87,
      detail: null,
    },
    {
      K: 88,
      M2: 88,
      detail: null,
    },
    {
      K: 89,
      M2: 89,
      detail: null,
    },
    {
      K: 90,
      M2: 90,
      detail: null,
    },
    {
      K: 91,
      M2: 91,
      detail: null,
    },
    {
      K: 92,
      M2: 92,
      detail: null,
    },
    {
      K: 93,
      M2: 93,
      detail: null,
    },
    {
      K: 94,
      M2: 94,
      detail: null,
    },
    {
      K: 95,
      M2: 95,
      detail: null,
    },
    {
      K: 96,
      M2: 96,
      detail: null,
    },
    {
      K: 97,
      M2: 97,
      detail: null,
    },
    {
      K: 98,
      M2: 98,
      detail: null,
    },
    {
      K: 99,
      M2: 99,
      detail: null,
    },
    {
      K: 100,
      M2: 100,
      detail: null,
    },
    {
      K: 101,
      M2: 101,
      detail: null,
    },
    {
      K: 102,
      M2: 102,
      detail: null,
    },
    {
      K: 103,
      M2: 103,
      detail: null,
    },
    {
      K: 104,
      M2: 104,
      detail: null,
    },
    {
      K: 105,
      M2: 105,
      detail: null,
    },
    {
      K: 106,
      M2: 106,
      detail: null,
    },
    {
      K: 107,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [107] } },
    },
    {
      K: 108,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [107] } },
    },
    {
      K: null,
      M2: 107,
      detail: { instance: ["M2"], eq: { K: [107, 108] } },
    },
    {
      K: 109,
      M2: 108,
      detail: null,
    },
    {
      K: 110,
      M2: 109,
      detail: null,
    },
    {
      K: 111,
      M2: 110,
      detail: null,
    },
  ],
  18: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [35] } },
    },
    {
      K: 36,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [35] } },
    },
    {
      K: null,
      M2: 35,
      detail: { instance: ["M2"], eq: { K: [35, 36] } },
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
    {
      K: 61,
      M2: 60,
      detail: null,
    },
    {
      K: 62,
      M2: 61,
      detail: null,
    },
    {
      K: 63,
      M2: 62,
      detail: null,
    },
    {
      K: 64,
      M2: 63,
      detail: null,
    },
    {
      K: 65,
      M2: 64,
      detail: null,
    },
    {
      K: 66,
      M2: 65,
      detail: null,
    },
    {
      K: 67,
      M2: 66,
      detail: null,
    },
    {
      K: 68,
      M2: 67,
      detail: null,
    },
    {
      K: 69,
      M2: 68,
      detail: null,
    },
    {
      K: 70,
      M2: 69,
      detail: null,
    },
    {
      K: 71,
      M2: 70,
      detail: null,
    },
    {
      K: 72,
      M2: 71,
      detail: null,
    },
    {
      K: 73,
      M2: 72,
      detail: null,
    },
    {
      K: 74,
      M2: 73,
      detail: null,
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
    {
      K: 79,
      M2: 78,
      detail: null,
    },
    {
      K: 80,
      M2: 79,
      detail: null,
    },
    {
      K: 81,
      M2: 80,
      detail: null,
    },
    {
      K: 82,
      M2: 81,
      detail: null,
    },
    {
      K: 83,
      M2: 82,
      detail: null,
    },
    {
      K: 84,
      M2: 83,
      detail: null,
    },
    {
      K: 85,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [84] } },
    },
    {
      K: 86,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [84] } },
    },
    {
      K: null,
      M2: 84,
      detail: { instance: ["M2"], eq: { K: [85, 86] } },
    },
    {
      K: 87,
      M2: 85,
      detail: null,
    },
    {
      K: 88,
      M2: 86,
      detail: null,
    },
    {
      K: 89,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [87] } },
    },
    {
      K: 90,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [87] } },
    },
    {
      K: null,
      M2: 87,
      detail: { instance: ["M2"], eq: { K: [89, 9] } },
    },
    {
      K: 91,
      M2: 88,
      detail: null,
    },
    {
      K: 92,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [89] } },
    },
    {
      K: 93,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [89] } },
    },
    {
      K: null,
      M2: 89,
      detail: { instance: ["M2"], eq: { K: [92, 93] } },
    },
    {
      K: 94,
      M2: 90,
      detail: null,
    },
    {
      K: 95,
      M2: 91,
      detail: null,
    },
    {
      K: 96,
      M2: 92,
      detail: null,
    },
    {
      K: 97,
      M2: 93,
      detail: null,
    },
    {
      K: 98,
      M2: 94,
      detail: null,
    },
    {
      K: 99,
      M2: 95,
      detail: null,
    },
    {
      K: 100,
      M2: 96,
      detail: null,
    },
    {
      K: 101,
      M2: 97,
      detail: null,
    },
    {
      K: 102,
      M2: 98,
      detail: null,
    },
    {
      K: 103,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [99] } },
    },
    {
      K: 104,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [99] } },
    },
    {
      K: null,
      M2: 99,
      detail: { instance: ["M2"], eq: { K: [103, 104] } },
    },
    {
      K: 105,
      M2: 100,
      detail: null,
    },
    {
      K: 106,
      M2: 101,
      detail: null,
    },
    {
      K: 107,
      M2: 102,
      detail: null,
    },
    {
      K: 108,
      M2: 103,
      detail: null,
    },
    {
      K: 109,
      M2: 104,
      detail: null,
    },
    {
      K: 110,
      M2: 105,
      detail: null,
    },
  ],
  19: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [40, 41] } },
    },
    {
      K: null,
      M2: 40,
      detail: { instance: ["M2"], eq: { K: [41] } },
    },
    {
      K: null,
      M2: 41,
      detail: { instance: ["M2"], eq: { K: [41] } },
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
    {
      K: 74,
      M2: 74,
      detail: null,
    },
    {
      K: 75,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [75, 76] } },
    },
    {
      K: null,
      M2: 75,
      detail: { instance: ["M2"], eq: { K: [75] } },
    },
    {
      K: null,
      M2: 76,
      detail: { instance: ["M2"], eq: { K: [75] } },
    },
    {
      K: 76,
      M2: 77,
      detail: null,
    },
    {
      K: 77,
      M2: 78,
      detail: null,
    },
    {
      K: 78,
      M2: 79,
      detail: null,
    },
    {
      K: 79,
      M2: 80,
      detail: null,
    },
    {
      K: 80,
      M2: 81,
      detail: null,
    },
    {
      K: 81,
      M2: 82,
      detail: null,
    },
    {
      K: 82,
      M2: 83,
      detail: null,
    },
    {
      K: 83,
      M2: 84,
      detail: null,
    },
    {
      K: 84,
      M2: 85,
      detail: null,
    },
    {
      K: 85,
      M2: 86,
      detail: null,
    },
    {
      K: 86,
      M2: 87,
      detail: null,
    },
    {
      K: 87,
      M2: 88,
      detail: null,
    },
    {
      K: 88,
      M2: 89,
      detail: null,
    },
    {
      K: 89,
      M2: 90,
      detail: null,
    },
    {
      K: 90,
      M2: 91,
      detail: null,
    },
    {
      K: 91,
      M2: 92,
      detail: null,
    },
    {
      K: 92,
      M2: 93,
      detail: null,
    },
    {
      K: 93,
      M2: 94,
      detail: null,
    },
    {
      K: 94,
      M2: 95,
      detail: null,
    },
    {
      K: 95,
      M2: 96,
      detail: null,
    },
    {
      K: 96,
      M2: 97,
      detail: null,
    },
    {
      K: 97,
      M2: 98,
      detail: null,
    },
    {
      K: 98,
      M2: 99,
      detail: null,
    },
  ],
  20: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
    {
      K: 61,
      M2: 60,
      detail: null,
    },
    {
      K: 62,
      M2: 61,
      detail: null,
    },
    {
      K: 63,
      M2: 62,
      detail: null,
    },
    {
      K: 64,
      M2: 63,
      detail: null,
    },
    {
      K: 65,
      M2: 64,
      detail: null,
    },
    {
      K: 66,
      M2: 65,
      detail: null,
    },
    {
      K: 67,
      M2: 66,
      detail: null,
    },
    {
      K: 68,
      M2: 67,
      detail: null,
    },
    {
      K: 69,
      M2: 68,
      detail: null,
    },
    {
      K: 70,
      M2: 69,
      detail: null,
    },
    {
      K: 71,
      M2: 70,
      detail: null,
    },
    {
      K: 72,
      M2: 71,
      detail: null,
    },
    {
      K: 73,
      M2: 72,
      detail: null,
    },
    {
      K: 74,
      M2: 73,
      detail: null,
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
    {
      K: 79,
      M2: 78,
      detail: null,
    },
    {
      K: 80,
      M2: 79,
      detail: null,
    },
    {
      K: 81,
      M2: 80,
      detail: null,
    },
    {
      K: 82,
      M2: 81,
      detail: null,
    },
    {
      K: 83,
      M2: 82,
      detail: null,
    },
    {
      K: 84,
      M2: 83,
      detail: null,
    },
    {
      K: 85,
      M2: 84,
      detail: null,
    },
    {
      K: 86,
      M2: 85,
      detail: null,
    },
    {
      K: 87,
      M2: 86,
      detail: null,
    },
    {
      K: 88,
      M2: 87,
      detail: null,
    },
    {
      K: 89,
      M2: 88,
      detail: null,
    },
    {
      K: 90,
      M2: 89,
      detail: null,
    },
    {
      K: 91,
      M2: 90,
      detail: null,
    },
    {
      K: 92,
      M2: 91,
      detail: null,
    },
    {
      K: 93,
      M2: 92,
      detail: null,
    },
    {
      K: 94,
      M2: 93,
      detail: null,
    },
    {
      K: 95,
      M2: 94,
      detail: null,
    },
    {
      K: 96,
      M2: 95,
      detail: null,
    },
    {
      K: 97,
      M2: 96,
      detail: null,
    },
    {
      K: 98,
      M2: 97,
      detail: null,
    },
    {
      K: 99,
      M2: 98,
      detail: null,
    },
    {
      K: 100,
      M2: 99,
      detail: null,
    },
    {
      K: 101,
      M2: 100,
      detail: null,
    },
    {
      K: 102,
      M2: 101,
      detail: null,
    },
    {
      K: 103,
      M2: 102,
      detail: null,
    },
    {
      K: 104,
      M2: 103,
      detail: null,
    },
    {
      K: 105,
      M2: 104,
      detail: null,
    },
    {
      K: 106,
      M2: 105,
      detail: null,
    },
    {
      K: 107,
      M2: 106,
      detail: null,
    },
    {
      K: 108,
      M2: 107,
      detail: null,
    },
    {
      K: 109,
      M2: 108,
      detail: null,
    },
    {
      K: 110,
      M2: 109,
      detail: null,
    },
    {
      K: 111,
      M2: 110,
      detail: null,
    },
    {
      K: 112,
      M2: 111,
      detail: null,
    },
    {
      K: 113,
      M2: 112,
      detail: null,
    },
    {
      K: 114,
      M2: 113,
      detail: null,
    },
    {
      K: 115,
      M2: 114,
      detail: null,
    },
    {
      K: 116,
      M2: 115,
      detail: null,
    },
    {
      K: 117,
      M2: 116,
      detail: null,
    },
    {
      K: 118,
      M2: 117,
      detail: null,
    },
    {
      K: 119,
      M2: 118,
      detail: null,
    },
    {
      K: 120,
      M2: 119,
      detail: null,
    },
    {
      K: 121,
      M2: 120,
      detail: null,
    },
    {
      K: 122,
      M2: 121,
      detail: null,
    },
    {
      K: 123,
      M2: 122,
      detail: null,
    },
    {
      K: 124,
      M2: 123,
      detail: null,
    },
    {
      K: 125,
      M2: 124,
      detail: null,
    },
    {
      K: 126,
      M2: 125,
      detail: null,
    },
    {
      K: 127,
      M2: 126,
      detail: null,
    },
    {
      K: 128,
      M2: 127,
      detail: null,
    },
    {
      K: 129,
      M2: 128,
      detail: null,
    },
    {
      K: 130,
      M2: 129,
      detail: null,
    },
    {
      K: 131,
      M2: 130,
      detail: null,
    },
    {
      K: 132,
      M2: 131,
      detail: null,
    },
    {
      K: 133,
      M2: 132,
      detail: null,
    },
    {
      K: 134,
      M2: 133,
      detail: null,
    },
    {
      K: 135,
      M2: 134,
      detail: null,
    },
  ],
  21: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [66] } },
    },
    {
      K: 67,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [66] } },
    },
    {
      K: null,
      M2: 66,
      detail: { instance: ["M2"], eq: { K: [66, 67] } },
    },
    {
      K: 68,
      M2: 67,
      detail: null,
    },
    {
      K: 69,
      M2: 68,
      detail: null,
    },
    {
      K: 70,
      M2: 69,
      detail: null,
    },
    {
      K: 71,
      M2: 70,
      detail: null,
    },
    {
      K: 72,
      M2: 71,
      detail: null,
    },
    {
      K: 73,
      M2: 72,
      detail: null,
    },
    {
      K: 74,
      M2: 73,
      detail: null,
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
    {
      K: 79,
      M2: 78,
      detail: null,
    },
    {
      K: 80,
      M2: 79,
      detail: null,
    },
    {
      K: 81,
      M2: 80,
      detail: null,
    },
    {
      K: 82,
      M2: 81,
      detail: null,
    },
    {
      K: 83,
      M2: 82,
      detail: null,
    },
    {
      K: 84,
      M2: 83,
      detail: null,
    },
    {
      K: 85,
      M2: 84,
      detail: null,
    },
    {
      K: 86,
      M2: 85,
      detail: null,
    },
    {
      K: 87,
      M2: 86,
      detail: null,
    },
    {
      K: 88,
      M2: 87,
      detail: null,
    },
    {
      K: 89,
      M2: 88,
      detail: null,
    },
    {
      K: 90,
      M2: 89,
      detail: null,
    },
    {
      K: 91,
      M2: 90,
      detail: null,
    },
    {
      K: 92,
      M2: 91,
      detail: null,
    },
    {
      K: 93,
      M2: 92,
      detail: null,
    },
    {
      K: 94,
      M2: 93,
      detail: null,
    },
    {
      K: 95,
      M2: 94,
      detail: null,
    },
    {
      K: 96,
      M2: 95,
      detail: null,
    },
    {
      K: 97,
      M2: 96,
      detail: null,
    },
    {
      K: 98,
      M2: 97,
      detail: null,
    },
    {
      K: 99,
      M2: 98,
      detail: null,
    },
    {
      K: 100,
      M2: 99,
      detail: null,
    },
    {
      K: 101,
      M2: 100,
      detail: null,
    },
    {
      K: 102,
      M2: 101,
      detail: null,
    },
    {
      K: 103,
      M2: 102,
      detail: null,
    },
    {
      K: 104,
      M2: 103,
      detail: null,
    },
    {
      K: 105,
      M2: 104,
      detail: null,
    },
    {
      K: 106,
      M2: 105,
      detail: null,
    },
    {
      K: 107,
      M2: 106,
      detail: null,
    },
    {
      K: 108,
      M2: 107,
      detail: null,
    },
    {
      K: 109,
      M2: 108,
      detail: null,
    },
    {
      K: 110,
      M2: 109,
      detail: null,
    },
    {
      K: 111,
      M2: 110,
      detail: null,
    },
    {
      K: 112,
      M2: 111,
      detail: null,
    },
  ],
  22: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [19] } },
    },
    {
      K: 20,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [19] } },
    },
    {
      K: 21,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [19] } },
    },
    {
      K: null,
      M2: 19,
      detail: { instance: ["M2"], eq: { K: [20, 21] } },
    },
    {
      K: 22,
      M2: 20,
      detail: null,
    },
    {
      K: 23,
      M2: 21,
      detail: null,
    },
    {
      K: 24,
      M2: 22,
      detail: null,
    },
    {
      K: 25,
      M2: 23,
      detail: null,
    },
    {
      K: 26,
      M2: 24,
      detail: null,
    },
    {
      K: 27,
      M2: 25,
      detail: null,
    },
    {
      K: 28,
      M2: 26,
      detail: null,
    },
    {
      K: 29,
      M2: 27,
      detail: null,
    },
    {
      K: 30,
      M2: 28,
      detail: null,
    },
    {
      K: 31,
      M2: 29,
      detail: null,
    },
    {
      K: 32,
      M2: 30,
      detail: null,
    },
    {
      K: 33,
      M2: 31,
      detail: null,
    },
    {
      K: 34,
      M2: 32,
      detail: null,
    },
    {
      K: 35,
      M2: 33,
      detail: null,
    },
    {
      K: 36,
      M2: 34,
      detail: null,
    },
    {
      K: 37,
      M2: 35,
      detail: null,
    },
    {
      K: 38,
      M2: 36,
      detail: null,
    },
    {
      K: 39,
      M2: 37,
      detail: null,
    },
    {
      K: 40,
      M2: 38,
      detail: null,
    },
    {
      K: 41,
      M2: 39,
      detail: null,
    },
    {
      K: 42,
      M2: 40,
      detail: null,
    },
    {
      K: 43,
      M2: 41,
      detail: null,
    },
    {
      K: 44,
      M2: 42,
      detail: null,
    },
    {
      K: 45,
      M2: 43,
      detail: null,
    },
    {
      K: 46,
      M2: 44,
      detail: null,
    },
    {
      K: 47,
      M2: 45,
      detail: null,
    },
    {
      K: 48,
      M2: 46,
      detail: null,
    },
    {
      K: 49,
      M2: 47,
      detail: null,
    },
    {
      K: 50,
      M2: 48,
      detail: null,
    },
    {
      K: 51,
      M2: 49,
      detail: null,
    },
    {
      K: 52,
      M2: 50,
      detail: null,
    },
    {
      K: 53,
      M2: 51,
      detail: null,
    },
    {
      K: 54,
      M2: 52,
      detail: null,
    },
    {
      K: 55,
      M2: 53,
      detail: null,
    },
    {
      K: 56,
      M2: 54,
      detail: null,
    },
    {
      K: 57,
      M2: 55,
      detail: null,
    },
    {
      K: 58,
      M2: 56,
      detail: null,
    },
    {
      K: 59,
      M2: 57,
      detail: null,
    },
    {
      K: 60,
      M2: 58,
      detail: null,
    },
    {
      K: 61,
      M2: 59,
      detail: null,
    },
    {
      K: 62,
      M2: 60,
      detail: null,
    },
    {
      K: 63,
      M2: 61,
      detail: null,
    },
    {
      K: 64,
      M2: 62,
      detail: null,
    },
    {
      K: 65,
      M2: 63,
      detail: null,
    },
    {
      K: 66,
      M2: 64,
      detail: null,
    },
    {
      K: 67,
      M2: 65,
      detail: null,
    },
    {
      K: 68,
      M2: 66,
      detail: null,
    },
    {
      K: 69,
      M2: 67,
      detail: null,
    },
    {
      K: 70,
      M2: 68,
      detail: null,
    },
    {
      K: 71,
      M2: 69,
      detail: null,
    },
    {
      K: 72,
      M2: 70,
      detail: null,
    },
    {
      K: 73,
      M2: 71,
      detail: null,
    },
    {
      K: 74,
      M2: 72,
      detail: null,
    },
    {
      K: 75,
      M2: 73,
      detail: null,
    },
    {
      K: 76,
      M2: 74,
      detail: null,
    },
    {
      K: 77,
      M2: 75,
      detail: null,
    },
    {
      K: 78,
      M2: 76,
      detail: null,
    },
  ],
  23: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [45, 46] } },
    },
    {
      K: null,
      M2: 45,
      detail: { instance: ["M2"], eq: { K: [45] } },
    },
    {
      K: null,
      M2: 46,
      detail: { instance: ["M2"], eq: { K: [45] } },
    },
    {
      K: 46,
      M2: 47,
      detail: null,
    },
    {
      K: 47,
      M2: 48,
      detail: null,
    },
    {
      K: 48,
      M2: 49,
      detail: null,
    },
    {
      K: 49,
      M2: 50,
      detail: null,
    },
    {
      K: 50,
      M2: 51,
      detail: null,
    },
    {
      K: 51,
      M2: 52,
      detail: null,
    },
    {
      K: 52,
      M2: 53,
      detail: null,
    },
    {
      K: 53,
      M2: 54,
      detail: null,
    },
    {
      K: 54,
      M2: 55,
      detail: null,
    },
    {
      K: 55,
      M2: 56,
      detail: null,
    },
    {
      K: 56,
      M2: 57,
      detail: null,
    },
    {
      K: 57,
      M2: 58,
      detail: null,
    },
    {
      K: 58,
      M2: 59,
      detail: null,
    },
    {
      K: 59,
      M2: 60,
      detail: null,
    },
    {
      K: 60,
      M2: 61,
      detail: null,
    },
    {
      K: 61,
      M2: 62,
      detail: null,
    },
    {
      K: 62,
      M2: 63,
      detail: null,
    },
    {
      K: 63,
      M2: 64,
      detail: null,
    },
    {
      K: 64,
      M2: 65,
      detail: null,
    },
    {
      K: 65,
      M2: 66,
      detail: null,
    },
    {
      K: 66,
      M2: 67,
      detail: null,
    },
    {
      K: 67,
      M2: 68,
      detail: null,
    },
    {
      K: 68,
      M2: 69,
      detail: null,
    },
    {
      K: 69,
      M2: 70,
      detail: null,
    },
    {
      K: 70,
      M2: 71,
      detail: null,
    },
    {
      K: 71,
      M2: 72,
      detail: null,
    },
    {
      K: 72,
      M2: 73,
      detail: null,
    },
    {
      K: 73,
      M2: 74,
      detail: null,
    },
    {
      K: 74,
      M2: 75,
      detail: null,
    },
    {
      K: 75,
      M2: 76,
      detail: null,
    },
    {
      K: 76,
      M2: 77,
      detail: null,
    },
    {
      K: 77,
      M2: 78,
      detail: null,
    },
    {
      K: 78,
      M2: 79,
      detail: null,
    },
    {
      K: 79,
      M2: 80,
      detail: null,
    },
    {
      K: 80,
      M2: 81,
      detail: null,
    },
    {
      K: 81,
      M2: 82,
      detail: null,
    },
    {
      K: 82,
      M2: 83,
      detail: null,
    },
    {
      K: 83,
      M2: 84,
      detail: null,
    },
    {
      K: 84,
      M2: 85,
      detail: null,
    },
    {
      K: 85,
      M2: 86,
      detail: null,
    },
    {
      K: 86,
      M2: 87,
      detail: null,
    },
    {
      K: 87,
      M2: 88,
      detail: null,
    },
    {
      K: 88,
      M2: 89,
      detail: null,
    },
    {
      K: 89,
      M2: 90,
      detail: null,
    },
    {
      K: 90,
      M2: 91,
      detail: null,
    },
    {
      K: 91,
      M2: 92,
      detail: null,
    },
    {
      K: 92,
      M2: 93,
      detail: null,
    },
    {
      K: 93,
      M2: 94,
      detail: null,
    },
    {
      K: 94,
      M2: 95,
      detail: null,
    },
    {
      K: 95,
      M2: 96,
      detail: null,
    },
    {
      K: 96,
      M2: 97,
      detail: null,
    },
    {
      K: 97,
      M2: 98,
      detail: null,
    },
    {
      K: 98,
      M2: 99,
      detail: null,
    },
    {
      K: 99,
      M2: 100,
      detail: null,
    },
    {
      K: 100,
      M2: 101,
      detail: null,
    },
    {
      K: 101,
      M2: 102,
      detail: null,
    },
    {
      K: 102,
      M2: 103,
      detail: null,
    },
    {
      K: 103,
      M2: 104,
      detail: null,
    },
    {
      K: 104,
      M2: 105,
      detail: null,
    },
    {
      K: 105,
      M2: 106,
      detail: null,
    },
    {
      K: 106,
      M2: 107,
      detail: null,
    },
    {
      K: 107,
      M2: 108,
      detail: null,
    },
    {
      K: 108,
      M2: 109,
      detail: null,
    },
    {
      K: 109,
      M2: 110,
      detail: null,
    },
    {
      K: 110,
      M2: 111,
      detail: null,
    },
    {
      K: 111,
      M2: 112,
      detail: null,
    },
    {
      K: 112,
      M2: 113,
      detail: null,
    },
    {
      K: 113,
      M2: 114,
      detail: null,
    },
    {
      K: 114,
      M2: 115,
      detail: null,
    },
    {
      K: 115,
      M2: 116,
      detail: null,
    },
    {
      K: 116,
      M2: 117,
      detail: null,
    },
    {
      K: 117,
      M2: 118,
      detail: null,
    },
    {
      K: 118,
      M2: 119,
      detail: null,
    },
  ],
  24: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [36] } },
    },
    {
      K: 37,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [36] } },
    },
    {
      K: null,
      M2: 36,
      detail: { instance: ["M2"], eq: { K: [36, 37] } },
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [42] } },
    },
    {
      K: 44,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [42] } },
    },
    {
      K: null,
      M2: 42,
      detail: { instance: ["M2"], eq: { K: [43, 44] } },
    },
    {
      K: 45,
      M2: 43,
      detail: null,
    },
    {
      K: 46,
      M2: 44,
      detail: null,
    },
    {
      K: 47,
      M2: 45,
      detail: null,
    },
    {
      K: 48,
      M2: 46,
      detail: null,
    },
    {
      K: 49,
      M2: 47,
      detail: null,
    },
    {
      K: 50,
      M2: 48,
      detail: null,
    },
    {
      K: 51,
      M2: 49,
      detail: null,
    },
    {
      K: 52,
      M2: 50,
      detail: null,
    },
    {
      K: 53,
      M2: 51,
      detail: null,
    },
    {
      K: 54,
      M2: 52,
      detail: null,
    },
    {
      K: 55,
      M2: 53,
      detail: null,
    },
    {
      K: 56,
      M2: 54,
      detail: null,
    },
    {
      K: 57,
      M2: 55,
      detail: null,
    },
    {
      K: 58,
      M2: 56,
      detail: null,
    },
    {
      K: 59,
      M2: 57,
      detail: null,
    },
    {
      K: 60,
      M2: 58,
      detail: null,
    },
    {
      K: 61,
      M2: 59,
      detail: null,
    },
    {
      K: 62,
      M2: 60,
      detail: null,
    },
    {
      K: 63,
      M2: 61,
      detail: null,
    },
    {
      K: 64,
      M2: 62,
      detail: null,
    },
  ],
  25: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
    {
      K: 74,
      M2: 74,
      detail: null,
    },
    {
      K: 75,
      M2: 75,
      detail: null,
    },
    {
      K: 76,
      M2: 76,
      detail: null,
    },
    {
      K: 77,
      M2: 77,
      detail: null,
    },
  ],
  26: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [48, 49] } },
    },
    {
      K: null,
      M2: 48,
      detail: { instance: ["M2"], eq: { K: [49] } },
    },
    {
      K: null,
      M2: 49,
      detail: { instance: ["M2"], eq: { K: [49] } },
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
    {
      K: 74,
      M2: 74,
      detail: null,
    },
    {
      K: 75,
      M2: 75,
      detail: null,
    },
    {
      K: 76,
      M2: 76,
      detail: null,
    },
    {
      K: 77,
      M2: 77,
      detail: null,
    },
    {
      K: 78,
      M2: 78,
      detail: null,
    },
    {
      K: 79,
      M2: 79,
      detail: null,
    },
    {
      K: 80,
      M2: 80,
      detail: null,
    },
    {
      K: 81,
      M2: 81,
      detail: null,
    },
    {
      K: 82,
      M2: 82,
      detail: null,
    },
    {
      K: 83,
      M2: 83,
      detail: null,
    },
    {
      K: 84,
      M2: 84,
      detail: null,
    },
    {
      K: 85,
      M2: 85,
      detail: null,
    },
    {
      K: 86,
      M2: 86,
      detail: null,
    },
    {
      K: 87,
      M2: 87,
      detail: null,
    },
    {
      K: 88,
      M2: 88,
      detail: null,
    },
    {
      K: 89,
      M2: 89,
      detail: null,
    },
    {
      K: 90,
      M2: 90,
      detail: null,
    },
    {
      K: 91,
      M2: 91,
      detail: null,
    },
    {
      K: 92,
      M2: 92,
      detail: null,
    },
    {
      K: 93,
      M2: 93,
      detail: null,
    },
    {
      K: 94,
      M2: 94,
      detail: null,
    },
    {
      K: 95,
      M2: 95,
      detail: null,
    },
    {
      K: 96,
      M2: 96,
      detail: null,
    },
    {
      K: 97,
      M2: 97,
      detail: null,
    },
    {
      K: 98,
      M2: 98,
      detail: null,
    },
    {
      K: 99,
      M2: 99,
      detail: null,
    },
    {
      K: 100,
      M2: 100,
      detail: null,
    },
    {
      K: 101,
      M2: 101,
      detail: null,
    },
    {
      K: 102,
      M2: 102,
      detail: null,
    },
    {
      K: 103,
      M2: 103,
      detail: null,
    },
    {
      K: 104,
      M2: 104,
      detail: null,
    },
    {
      K: 105,
      M2: 105,
      detail: null,
    },
    {
      K: 106,
      M2: 106,
      detail: null,
    },
    {
      K: 107,
      M2: 107,
      detail: null,
    },
    {
      K: 108,
      M2: 108,
      detail: null,
    },
    {
      K: 109,
      M2: 109,
      detail: null,
    },
    {
      K: 110,
      M2: 110,
      detail: null,
    },
    {
      K: 111,
      M2: 111,
      detail: null,
    },
    {
      K: 112,
      M2: 112,
      detail: null,
    },
    {
      K: 113,
      M2: 113,
      detail: null,
    },
    {
      K: 114,
      M2: 114,
      detail: null,
    },
    {
      K: 115,
      M2: 115,
      detail: null,
    },
    {
      K: 116,
      M2: 116,
      detail: null,
    },
    {
      K: 117,
      M2: 117,
      detail: null,
    },
    {
      K: 118,
      M2: 118,
      detail: null,
    },
    {
      K: 119,
      M2: 119,
      detail: null,
    },
    {
      K: 120,
      M2: 120,
      detail: null,
    },
    {
      K: 121,
      M2: 121,
      detail: null,
    },
    {
      K: 122,
      M2: 122,
      detail: null,
    },
    {
      K: 123,
      M2: 123,
      detail: null,
    },
    {
      K: 124,
      M2: 124,
      detail: null,
    },
    {
      K: 125,
      M2: 125,
      detail: null,
    },
    {
      K: 126,
      M2: 126,
      detail: null,
    },
    {
      K: 127,
      M2: 127,
      detail: null,
    },
    {
      K: 128,
      M2: 128,
      detail: null,
    },
    {
      K: 129,
      M2: 129,
      detail: null,
    },
    {
      K: 130,
      M2: 130,
      detail: null,
    },
    {
      K: 131,
      M2: 131,
      detail: null,
    },
    {
      K: 132,
      M2: 132,
      detail: null,
    },
    {
      K: 133,
      M2: 133,
      detail: null,
    },
    {
      K: 134,
      M2: 134,
      detail: null,
    },
    {
      K: 135,
      M2: 135,
      detail: null,
    },
    {
      K: 136,
      M2: 136,
      detail: null,
    },
    {
      K: 137,
      M2: 137,
      detail: null,
    },
    {
      K: 138,
      M2: 138,
      detail: null,
    },
    {
      K: 139,
      M2: 139,
      detail: null,
    },
    {
      K: 140,
      M2: 140,
      detail: null,
    },
    {
      K: 141,
      M2: 141,
      detail: null,
    },
    {
      K: 142,
      M2: 142,
      detail: null,
    },
    {
      K: 143,
      M2: 143,
      detail: null,
    },
    {
      K: 144,
      M2: 144,
      detail: null,
    },
    {
      K: 145,
      M2: 145,
      detail: null,
    },
    {
      K: 146,
      M2: 146,
      detail: null,
    },
    {
      K: 147,
      M2: 147,
      detail: null,
    },
    {
      K: 148,
      M2: 148,
      detail: null,
    },
    {
      K: 149,
      M2: 149,
      detail: null,
    },
    {
      K: 150,
      M2: 150,
      detail: null,
    },
    {
      K: 151,
      M2: 151,
      detail: null,
    },
    {
      K: 152,
      M2: 152,
      detail: null,
    },
    {
      K: 153,
      M2: 153,
      detail: null,
    },
    {
      K: 154,
      M2: 154,
      detail: null,
    },
    {
      K: 155,
      M2: 155,
      detail: null,
    },
    {
      K: 156,
      M2: 156,
      detail: null,
    },
    {
      K: 157,
      M2: 157,
      detail: null,
    },
    {
      K: 158,
      M2: 158,
      detail: null,
    },
    {
      K: 159,
      M2: 159,
      detail: null,
    },
    {
      K: 160,
      M2: 160,
      detail: null,
    },
    {
      K: 161,
      M2: 161,
      detail: null,
    },
    {
      K: 162,
      M2: 162,
      detail: null,
    },
    {
      K: 163,
      M2: 163,
      detail: null,
    },
    {
      K: 164,
      M2: 164,
      detail: null,
    },
    {
      K: 165,
      M2: 165,
      detail: null,
    },
    {
      K: 166,
      M2: 166,
      detail: null,
    },
    {
      K: 167,
      M2: 167,
      detail: null,
    },
    {
      K: 168,
      M2: 168,
      detail: null,
    },
    {
      K: 169,
      M2: 169,
      detail: null,
    },
    {
      K: 170,
      M2: 170,
      detail: null,
    },
    {
      K: 171,
      M2: 171,
      detail: null,
    },
    {
      K: 172,
      M2: 172,
      detail: null,
    },
    {
      K: 173,
      M2: 173,
      detail: null,
    },
    {
      K: 174,
      M2: 174,
      detail: null,
    },
    {
      K: 175,
      M2: 175,
      detail: null,
    },
    {
      K: 176,
      M2: 176,
      detail: null,
    },
    {
      K: 177,
      M2: 177,
      detail: null,
    },
    {
      K: 178,
      M2: 178,
      detail: null,
    },
    {
      K: 179,
      M2: 179,
      detail: null,
    },
    {
      K: 180,
      M2: 180,
      detail: null,
    },
    {
      K: 181,
      M2: 181,
      detail: null,
    },
    {
      K: 182,
      M2: 182,
      detail: null,
    },
    {
      K: 183,
      M2: 183,
      detail: null,
    },
    {
      K: 184,
      M2: 184,
      detail: null,
    },
    {
      K: 185,
      M2: 185,
      detail: null,
    },
    {
      K: 186,
      M2: 186,
      detail: null,
    },
    {
      K: 187,
      M2: 187,
      detail: null,
    },
    {
      K: 188,
      M2: 188,
      detail: null,
    },
    {
      K: 189,
      M2: 189,
      detail: null,
    },
    {
      K: 190,
      M2: 190,
      detail: null,
    },
    {
      K: 191,
      M2: 191,
      detail: null,
    },
    {
      K: 192,
      M2: 192,
      detail: null,
    },
    {
      K: 193,
      M2: 193,
      detail: null,
    },
    {
      K: 194,
      M2: 194,
      detail: null,
    },
    {
      K: 195,
      M2: 195,
      detail: null,
    },
    {
      K: 196,
      M2: 196,
      detail: null,
    },
    {
      K: 197,
      M2: 197,
      detail: null,
    },
    {
      K: 198,
      M2: 198,
      detail: null,
    },
    {
      K: 199,
      M2: 199,
      detail: null,
    },
    {
      K: 200,
      M2: 200,
      detail: null,
    },
    {
      K: 201,
      M2: 201,
      detail: null,
    },
    {
      K: 202,
      M2: 202,
      detail: null,
    },
    {
      K: 203,
      M2: 203,
      detail: null,
    },
    {
      K: 204,
      M2: 204,
      detail: null,
    },
    {
      K: 205,
      M2: 205,
      detail: null,
    },
    {
      K: 206,
      M2: 206,
      detail: null,
    },
    {
      K: 207,
      M2: 207,
      detail: null,
    },
    {
      K: 208,
      M2: 208,
      detail: null,
    },
    {
      K: 209,
      M2: 209,
      detail: null,
    },
    {
      K: 210,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [210] } },
    },
    {
      K: 211,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [210] } },
    },
    {
      K: null,
      M2: 210,
      detail: { instance: ["M2"], eq: { K: [210, 211] } },
    },
    {
      K: 212,
      M2: 211,
      detail: null,
    },
    {
      K: 213,
      M2: 212,
      detail: null,
    },
    {
      K: 214,
      M2: 213,
      detail: null,
    },
    {
      K: 215,
      M2: 214,
      detail: null,
    },
    {
      K: 216,
      M2: 215,
      detail: null,
    },
    {
      K: 217,
      M2: 216,
      detail: null,
    },
    {
      K: 218,
      M2: 217,
      detail: null,
    },
    {
      K: 219,
      M2: 218,
      detail: null,
    },
    {
      K: 220,
      M2: 219,
      detail: null,
    },
    {
      K: 221,
      M2: 220,
      detail: null,
    },
    {
      K: 222,
      M2: 221,
      detail: null,
    },
    {
      K: 223,
      M2: 222,
      detail: null,
    },
    {
      K: 224,
      M2: 223,
      detail: null,
    },
    {
      K: 225,
      M2: 224,
      detail: null,
    },
    {
      K: 226,
      M2: 225,
      detail: null,
    },
    {
      K: 227,
      M2: 226,
      detail: null,
    },
  ],
  27: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [33, 34] } },
    },
    {
      K: null,
      M2: 33,
      detail: { instance: ["M2"], eq: { K: [33] } },
    },
    {
      K: null,
      M2: 34,
      detail: { instance: ["M2"], eq: { K: [33] } },
    },
    {
      K: 34,
      M2: 35,
      detail: null,
    },
    {
      K: 35,
      M2: 36,
      detail: null,
    },
    {
      K: 36,
      M2: 37,
      detail: null,
    },
    {
      K: 37,
      M2: 38,
      detail: null,
    },
    {
      K: 38,
      M2: 39,
      detail: null,
    },
    {
      K: 39,
      M2: 40,
      detail: null,
    },
    {
      K: 40,
      M2: 41,
      detail: null,
    },
    {
      K: 41,
      M2: 42,
      detail: null,
    },
    {
      K: 42,
      M2: 43,
      detail: null,
    },
    {
      K: 43,
      M2: 44,
      detail: null,
    },
    {
      K: 44,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [45, 46] } },
    },
    {
      K: null,
      M2: 45,
      detail: { instance: ["M2"], eq: { K: [44] } },
    },
    {
      K: null,
      M2: 46,
      detail: { instance: ["M2"], eq: { K: [44] } },
    },
    {
      K: 45,
      M2: 47,
      detail: null,
    },
    {
      K: 46,
      M2: 48,
      detail: null,
    },
    {
      K: 47,
      M2: 49,
      detail: null,
    },
    {
      K: 48,
      M2: 50,
      detail: null,
    },
    {
      K: 49,
      M2: 51,
      detail: null,
    },
    {
      K: 50,
      M2: 52,
      detail: null,
    },
    {
      K: 51,
      M2: 53,
      detail: null,
    },
    {
      K: 52,
      M2: 54,
      detail: null,
    },
    {
      K: 53,
      M2: 55,
      detail: null,
    },
    {
      K: 54,
      M2: 56,
      detail: null,
    },
    {
      K: 55,
      M2: 57,
      detail: null,
    },
    {
      K: 56,
      M2: 58,
      detail: null,
    },
    {
      K: 57,
      M2: 59,
      detail: null,
    },
    {
      K: 58,
      M2: 60,
      detail: null,
    },
    {
      K: 59,
      M2: 61,
      detail: null,
    },
    {
      K: 60,
      M2: 62,
      detail: null,
    },
    {
      K: 61,
      M2: 63,
      detail: null,
    },
    {
      K: 62,
      M2: 64,
      detail: null,
    },
    {
      K: 63,
      M2: 65,
      detail: null,
    },
    {
      K: 64,
      M2: 66,
      detail: null,
    },
    {
      K: 65,
      M2: 67,
      detail: null,
    },
    {
      K: 66,
      M2: 68,
      detail: null,
    },
    {
      K: 67,
      M2: 69,
      detail: null,
    },
    {
      K: 68,
      M2: 70,
      detail: null,
    },
    {
      K: 69,
      M2: 71,
      detail: null,
    },
    {
      K: 70,
      M2: 72,
      detail: null,
    },
    {
      K: 71,
      M2: 73,
      detail: null,
    },
    {
      K: 72,
      M2: 74,
      detail: null,
    },
    {
      K: 73,
      M2: 75,
      detail: null,
    },
    {
      K: 74,
      M2: 76,
      detail: null,
    },
    {
      K: 75,
      M2: 77,
      detail: null,
    },
    {
      K: 76,
      M2: 78,
      detail: null,
    },
    {
      K: 77,
      M2: 79,
      detail: null,
    },
    {
      K: 78,
      M2: 80,
      detail: null,
    },
    {
      K: 79,
      M2: 81,
      detail: null,
    },
    {
      K: 80,
      M2: 82,
      detail: null,
    },
    {
      K: 81,
      M2: 83,
      detail: null,
    },
    {
      K: 82,
      M2: 84,
      detail: null,
    },
    {
      K: 83,
      M2: 85,
      detail: null,
    },
    {
      K: 84,
      M2: 86,
      detail: null,
    },
    {
      K: 85,
      M2: 87,
      detail: null,
    },
    {
      K: 86,
      M2: 88,
      detail: null,
    },
    {
      K: 87,
      M2: 89,
      detail: null,
    },
    {
      K: 88,
      M2: 90,
      detail: null,
    },
    {
      K: 89,
      M2: 91,
      detail: null,
    },
    {
      K: 90,
      M2: 92,
      detail: null,
    },
    {
      K: 91,
      M2: 93,
      detail: null,
    },
    {
      K: 92,
      M2: 94,
      detail: null,
    },
    {
      K: 93,
      M2: 95,
      detail: null,
    },
  ],
  28: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [22, 23] } },
    },
    {
      K: null,
      M2: 22,
      detail: { instance: ["M2"], eq: { K: [23] } },
    },
    {
      K: null,
      M2: 23,
      detail: { instance: ["M2"], eq: { K: [23] } },
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
    {
      K: 74,
      M2: 74,
      detail: null,
    },
    {
      K: 75,
      M2: 75,
      detail: null,
    },
    {
      K: 76,
      M2: 76,
      detail: null,
    },
    {
      K: 77,
      M2: 77,
      detail: null,
    },
    {
      K: 78,
      M2: 78,
      detail: null,
    },
    {
      K: 79,
      M2: 79,
      detail: null,
    },
    {
      K: 80,
      M2: 80,
      detail: null,
    },
    {
      K: 81,
      M2: 81,
      detail: null,
    },
    {
      K: 82,
      M2: 82,
      detail: null,
    },
    {
      K: 83,
      M2: 83,
      detail: null,
    },
    {
      K: 84,
      M2: 84,
      detail: null,
    },
    {
      K: 85,
      M2: 85,
      detail: null,
    },
    {
      K: 86,
      M2: 86,
      detail: null,
    },
    {
      K: 87,
      M2: 87,
      detail: null,
    },
    {
      K: 88,
      M2: 88,
      detail: null,
    },
  ],
  29: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [28, 29] } },
    },
    {
      K: null,
      M2: 28,
      detail: { instance: ["M2"], eq: { K: [29] } },
    },
    {
      K: null,
      M2: 29,
      detail: { instance: ["M2"], eq: { K: [29] } },
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
  ],
  30: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 3,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [2, 3] } },
    },
    {
      K: 4,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [2, 3] } },
    },
    {
      K: null,
      M2: 2,
      detail: { instance: ["M2"], eq: { K: [4] } },
    },
    {
      K: null,
      M2: 3,
      detail: { instance: ["M2"], eq: { K: [4] } },
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
  ],
  31: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
  ],
  32: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [9, 1] } },
    },
    {
      K: null,
      M2: 9,
      detail: { instance: ["M2"], eq: { K: [10] } },
    },
    {
      K: null,
      M2: 10,
      detail: { instance: ["M2"], eq: { K: [10] } },
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
  ],
  33: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
  ],
  34: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
  ],
  35: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [43, 44] } },
    },
    {
      K: null,
      M2: 43,
      detail: { instance: ["M2"], eq: { K: [43] } },
    },
    {
      K: null,
      M2: 44,
      detail: { instance: ["M2"], eq: { K: [43] } },
    },
    {
      K: 44,
      M2: 45,
      detail: null,
    },
    {
      K: 45,
      M2: 46,
      detail: null,
    },
  ],
  36: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
    {
      K: 61,
      M2: 60,
      detail: null,
    },
    {
      K: 62,
      M2: 61,
      detail: null,
    },
    {
      K: 63,
      M2: 62,
      detail: null,
    },
    {
      K: 64,
      M2: 63,
      detail: null,
    },
    {
      K: 65,
      M2: 64,
      detail: null,
    },
    {
      K: 66,
      M2: 65,
      detail: null,
    },
    {
      K: 67,
      M2: 66,
      detail: null,
    },
    {
      K: 68,
      M2: 67,
      detail: null,
    },
    {
      K: 69,
      M2: 68,
      detail: null,
    },
    {
      K: 70,
      M2: 69,
      detail: null,
    },
    {
      K: 71,
      M2: 70,
      detail: null,
    },
    {
      K: 72,
      M2: 71,
      detail: null,
    },
    {
      K: 73,
      M2: 72,
      detail: null,
    },
    {
      K: 74,
      M2: 73,
      detail: null,
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
    {
      K: 79,
      M2: 78,
      detail: null,
    },
    {
      K: 80,
      M2: 79,
      detail: null,
    },
    {
      K: 81,
      M2: 80,
      detail: null,
    },
    {
      K: 82,
      M2: 81,
      detail: null,
    },
    {
      K: 83,
      M2: 82,
      detail: null,
    },
  ],
  37: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
    {
      K: 74,
      M2: 74,
      detail: null,
    },
    {
      K: 75,
      M2: 75,
      detail: null,
    },
    {
      K: 76,
      M2: 76,
      detail: null,
    },
    {
      K: 77,
      M2: 77,
      detail: null,
    },
    {
      K: 78,
      M2: 78,
      detail: null,
    },
    {
      K: 79,
      M2: 79,
      detail: null,
    },
    {
      K: 80,
      M2: 80,
      detail: null,
    },
    {
      K: 81,
      M2: 81,
      detail: null,
    },
    {
      K: 82,
      M2: 82,
      detail: null,
    },
    {
      K: 83,
      M2: 83,
      detail: null,
    },
    {
      K: 84,
      M2: 84,
      detail: null,
    },
    {
      K: 85,
      M2: 85,
      detail: null,
    },
    {
      K: 86,
      M2: 86,
      detail: null,
    },
    {
      K: 87,
      M2: 87,
      detail: null,
    },
    {
      K: 88,
      M2: 88,
      detail: null,
    },
    {
      K: 89,
      M2: 89,
      detail: null,
    },
    {
      K: 90,
      M2: 90,
      detail: null,
    },
    {
      K: 91,
      M2: 91,
      detail: null,
    },
    {
      K: 92,
      M2: 92,
      detail: null,
    },
    {
      K: 93,
      M2: 93,
      detail: null,
    },
    {
      K: 94,
      M2: 94,
      detail: null,
    },
    {
      K: 95,
      M2: 95,
      detail: null,
    },
    {
      K: 96,
      M2: 96,
      detail: null,
    },
    {
      K: 97,
      M2: 97,
      detail: null,
    },
    {
      K: 98,
      M2: 98,
      detail: null,
    },
    {
      K: 99,
      M2: 99,
      detail: null,
    },
    {
      K: 100,
      M2: 100,
      detail: null,
    },
    {
      K: 101,
      M2: 101,
      detail: null,
    },
    {
      K: 102,
      M2: 102,
      detail: null,
    },
    {
      K: 103,
      M2: 103,
      detail: null,
    },
    {
      K: 104,
      M2: 104,
      detail: null,
    },
    {
      K: 105,
      M2: 105,
      detail: null,
    },
    {
      K: 106,
      M2: 106,
      detail: null,
    },
    {
      K: 107,
      M2: 107,
      detail: null,
    },
    {
      K: 108,
      M2: 108,
      detail: null,
    },
    {
      K: 109,
      M2: 109,
      detail: null,
    },
    {
      K: 110,
      M2: 110,
      detail: null,
    },
    {
      K: 111,
      M2: 111,
      detail: null,
    },
    {
      K: 112,
      M2: 112,
      detail: null,
    },
    {
      K: 113,
      M2: 113,
      detail: null,
    },
    {
      K: 114,
      M2: 114,
      detail: null,
    },
    {
      K: 115,
      M2: 115,
      detail: null,
    },
    {
      K: 116,
      M2: 116,
      detail: null,
    },
    {
      K: 117,
      M2: 117,
      detail: null,
    },
    {
      K: 118,
      M2: 118,
      detail: null,
    },
    {
      K: 119,
      M2: 119,
      detail: null,
    },
    {
      K: 120,
      M2: 120,
      detail: null,
    },
    {
      K: 121,
      M2: 121,
      detail: null,
    },
    {
      K: 122,
      M2: 122,
      detail: null,
    },
    {
      K: 123,
      M2: 123,
      detail: null,
    },
    {
      K: 124,
      M2: 124,
      detail: null,
    },
    {
      K: 125,
      M2: 125,
      detail: null,
    },
    {
      K: 126,
      M2: 126,
      detail: null,
    },
    {
      K: 127,
      M2: 127,
      detail: null,
    },
    {
      K: 128,
      M2: 128,
      detail: null,
    },
    {
      K: 129,
      M2: 129,
      detail: null,
    },
    {
      K: 130,
      M2: 130,
      detail: null,
    },
    {
      K: 131,
      M2: 131,
      detail: null,
    },
    {
      K: 132,
      M2: 132,
      detail: null,
    },
    {
      K: 133,
      M2: 133,
      detail: null,
    },
    {
      K: 134,
      M2: 134,
      detail: null,
    },
    {
      K: 135,
      M2: 135,
      detail: null,
    },
    {
      K: 136,
      M2: 136,
      detail: null,
    },
    {
      K: 137,
      M2: 137,
      detail: null,
    },
    {
      K: 138,
      M2: 138,
      detail: null,
    },
    {
      K: 139,
      M2: 139,
      detail: null,
    },
    {
      K: 140,
      M2: 140,
      detail: null,
    },
    {
      K: 141,
      M2: 141,
      detail: null,
    },
    {
      K: 142,
      M2: 142,
      detail: null,
    },
    {
      K: 143,
      M2: 143,
      detail: null,
    },
    {
      K: 144,
      M2: 144,
      detail: null,
    },
    {
      K: 145,
      M2: 145,
      detail: null,
    },
    {
      K: 146,
      M2: 146,
      detail: null,
    },
    {
      K: 147,
      M2: 147,
      detail: null,
    },
    {
      K: 148,
      M2: 148,
      detail: null,
    },
    {
      K: 149,
      M2: 149,
      detail: null,
    },
    {
      K: 150,
      M2: 150,
      detail: null,
    },
    {
      K: 151,
      M2: 151,
      detail: null,
    },
    {
      K: 152,
      M2: 152,
      detail: null,
    },
    {
      K: 153,
      M2: 153,
      detail: null,
    },
    {
      K: 154,
      M2: 154,
      detail: null,
    },
    {
      K: 155,
      M2: 155,
      detail: null,
    },
    {
      K: 156,
      M2: 156,
      detail: null,
    },
    {
      K: 157,
      M2: 157,
      detail: null,
    },
    {
      K: 158,
      M2: 158,
      detail: null,
    },
    {
      K: 159,
      M2: 159,
      detail: null,
    },
    {
      K: 160,
      M2: 160,
      detail: null,
    },
    {
      K: 161,
      M2: 161,
      detail: null,
    },
    {
      K: 162,
      M2: 162,
      detail: null,
    },
    {
      K: 163,
      M2: 163,
      detail: null,
    },
    {
      K: 164,
      M2: 164,
      detail: null,
    },
    {
      K: 165,
      M2: 165,
      detail: null,
    },
    {
      K: 166,
      M2: 166,
      detail: null,
    },
    {
      K: 167,
      M2: 167,
      detail: null,
    },
    {
      K: 168,
      M2: 168,
      detail: null,
    },
    {
      K: 169,
      M2: 169,
      detail: null,
    },
    {
      K: 170,
      M2: 170,
      detail: null,
    },
    {
      K: 171,
      M2: 171,
      detail: null,
    },
    {
      K: 172,
      M2: 172,
      detail: null,
    },
    {
      K: 173,
      M2: 173,
      detail: null,
    },
    {
      K: 174,
      M2: 174,
      detail: null,
    },
    {
      K: 175,
      M2: 175,
      detail: null,
    },
    {
      K: 176,
      M2: 176,
      detail: null,
    },
    {
      K: 177,
      M2: 177,
      detail: null,
    },
    {
      K: 178,
      M2: 178,
      detail: null,
    },
    {
      K: 179,
      M2: 179,
      detail: null,
    },
    {
      K: 180,
      M2: 180,
      detail: null,
    },
    {
      K: 181,
      M2: 181,
      detail: null,
    },
    {
      K: 182,
      M2: 182,
      detail: null,
    },
  ],
  38: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
    {
      K: 61,
      M2: 60,
      detail: null,
    },
    {
      K: 62,
      M2: 61,
      detail: null,
    },
    {
      K: 63,
      M2: 62,
      detail: null,
    },
    {
      K: 64,
      M2: 63,
      detail: null,
    },
    {
      K: 65,
      M2: 64,
      detail: null,
    },
    {
      K: 66,
      M2: 65,
      detail: null,
    },
    {
      K: 67,
      M2: 66,
      detail: null,
    },
    {
      K: 68,
      M2: 67,
      detail: null,
    },
    {
      K: 69,
      M2: 68,
      detail: null,
    },
    {
      K: 70,
      M2: 69,
      detail: null,
    },
    {
      K: 71,
      M2: 70,
      detail: null,
    },
    {
      K: 72,
      M2: 71,
      detail: null,
    },
    {
      K: 73,
      M2: 72,
      detail: null,
    },
    {
      K: 74,
      M2: 73,
      detail: null,
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
    {
      K: 79,
      M2: 78,
      detail: null,
    },
    {
      K: 80,
      M2: 79,
      detail: null,
    },
    {
      K: 81,
      M2: 80,
      detail: null,
    },
    {
      K: 82,
      M2: 81,
      detail: null,
    },
    {
      K: 83,
      M2: 82,
      detail: null,
    },
    {
      K: 84,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [83] } },
    },
    {
      K: 85,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [83] } },
    },
    {
      K: null,
      M2: 83,
      detail: { instance: ["M2"], eq: { K: [84, 85] } },
    },
    {
      K: 86,
      M2: 84,
      detail: null,
    },
    {
      K: 87,
      M2: 85,
      detail: null,
    },
    {
      K: 88,
      M2: 86,
      detail: null,
    },
  ],
  39: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [3, 4] } },
    },
    {
      K: null,
      M2: 3,
      detail: { instance: ["M2"], eq: { K: [3] } },
    },
    {
      K: null,
      M2: 4,
      detail: { instance: ["M2"], eq: { K: [3] } },
    },
    {
      K: 4,
      M2: 5,
      detail: null,
    },
    {
      K: 5,
      M2: 6,
      detail: null,
    },
    {
      K: 6,
      M2: 7,
      detail: null,
    },
    {
      K: 7,
      M2: 8,
      detail: null,
    },
    {
      K: 8,
      M2: 9,
      detail: null,
    },
    {
      K: 9,
      M2: 10,
      detail: null,
    },
    {
      K: 10,
      M2: 11,
      detail: null,
    },
    {
      K: 11,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [12] } },
    },
    {
      K: 12,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [12] } },
    },
    {
      K: null,
      M2: 12,
      detail: { instance: ["M2"], eq: { K: [11, 12] } },
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [14] } },
    },
    {
      K: 15,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [14] } },
    },
    {
      K: null,
      M2: 14,
      detail: { instance: ["M2"], eq: { K: [14, 15] } },
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [35] } },
    },
    {
      K: 37,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [35] } },
    },
    {
      K: null,
      M2: 35,
      detail: { instance: ["M2"], eq: { K: [36, 37] } },
    },
    {
      K: 38,
      M2: 36,
      detail: null,
    },
    {
      K: 39,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [37] } },
    },
    {
      K: 40,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [37] } },
    },
    {
      K: null,
      M2: 37,
      detail: { instance: ["M2"], eq: { K: [39, 4] } },
    },
    {
      K: 41,
      M2: 38,
      detail: null,
    },
    {
      K: 42,
      M2: 39,
      detail: null,
    },
    {
      K: 43,
      M2: 40,
      detail: null,
    },
    {
      K: 44,
      M2: 41,
      detail: null,
    },
    {
      K: 45,
      M2: 42,
      detail: null,
    },
    {
      K: 46,
      M2: 43,
      detail: null,
    },
    {
      K: 47,
      M2: 44,
      detail: null,
    },
    {
      K: 48,
      M2: 45,
      detail: null,
    },
    {
      K: 49,
      M2: 46,
      detail: null,
    },
    {
      K: 50,
      M2: 47,
      detail: null,
    },
    {
      K: 51,
      M2: 48,
      detail: null,
    },
    {
      K: 52,
      M2: 49,
      detail: null,
    },
    {
      K: 53,
      M2: 50,
      detail: null,
    },
    {
      K: 54,
      M2: 51,
      detail: null,
    },
    {
      K: 55,
      M2: 52,
      detail: null,
    },
    {
      K: 56,
      M2: 53,
      detail: null,
    },
    {
      K: 57,
      M2: 54,
      detail: null,
    },
    {
      K: 58,
      M2: 55,
      detail: null,
    },
    {
      K: 59,
      M2: 56,
      detail: null,
    },
    {
      K: 60,
      M2: 57,
      detail: null,
    },
    {
      K: 61,
      M2: 58,
      detail: null,
    },
    {
      K: 62,
      M2: 59,
      detail: null,
    },
    {
      K: 63,
      M2: 60,
      detail: null,
    },
    {
      K: 64,
      M2: 61,
      detail: null,
    },
    {
      K: 65,
      M2: 62,
      detail: null,
    },
    {
      K: 66,
      M2: 63,
      detail: null,
    },
    {
      K: 67,
      M2: 64,
      detail: null,
    },
    {
      K: 68,
      M2: 65,
      detail: null,
    },
    {
      K: 69,
      M2: 66,
      detail: null,
    },
    {
      K: 70,
      M2: 67,
      detail: null,
    },
    {
      K: 71,
      M2: 68,
      detail: null,
    },
    {
      K: 72,
      M2: 69,
      detail: null,
    },
    {
      K: 73,
      M2: 70,
      detail: null,
    },
    {
      K: 74,
      M2: 71,
      detail: null,
    },
    {
      K: 75,
      M2: 72,
      detail: null,
    },
  ],
  40: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [17, 18] } },
    },
    {
      K: null,
      M2: 17,
      detail: { instance: ["M2"], eq: { K: [18] } },
    },
    {
      K: null,
      M2: 18,
      detail: { instance: ["M2"], eq: { K: [18] } },
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [53] } },
    },
    {
      K: 54,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [53] } },
    },
    {
      K: null,
      M2: 53,
      detail: { instance: ["M2"], eq: { K: [53, 54] } },
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [57, 58] } },
    },
    {
      K: null,
      M2: 57,
      detail: { instance: ["M2"], eq: { K: [58] } },
    },
    {
      K: null,
      M2: 58,
      detail: { instance: ["M2"], eq: { K: [58] } },
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [73] } },
    },
    {
      K: 74,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [73] } },
    },
    {
      K: null,
      M2: 73,
      detail: { instance: ["M2"], eq: { K: [73, 74] } },
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
    {
      K: 79,
      M2: 78,
      detail: null,
    },
    {
      K: 80,
      M2: 79,
      detail: null,
    },
    {
      K: 81,
      M2: 80,
      detail: null,
    },
    {
      K: 82,
      M2: 81,
      detail: null,
    },
    {
      K: 83,
      M2: 82,
      detail: null,
    },
    {
      K: 84,
      M2: 83,
      detail: null,
    },
    {
      K: 85,
      M2: 84,
      detail: null,
    },
  ],
  41: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
  ],
  42: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 3,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [2, 3] } },
    },
    {
      K: 4,
      M2: 2,
      detail: null,
    },
    {
      K: 5,
      M2: 3,
      detail: null,
    },
    {
      K: 6,
      M2: 4,
      detail: null,
    },
    {
      K: 7,
      M2: 5,
      detail: null,
    },
    {
      K: 8,
      M2: 6,
      detail: null,
    },
    {
      K: 9,
      M2: 7,
      detail: null,
    },
    {
      K: 10,
      M2: 8,
      detail: null,
    },
    {
      K: 11,
      M2: 9,
      detail: null,
    },
    {
      K: 12,
      M2: 10,
      detail: null,
    },
    {
      K: 13,
      M2: 11,
      detail: null,
    },
    {
      K: 14,
      M2: 12,
      detail: null,
    },
    {
      K: 15,
      M2: 13,
      detail: null,
    },
    {
      K: 16,
      M2: 14,
      detail: null,
    },
    {
      K: 17,
      M2: 15,
      detail: null,
    },
    {
      K: 18,
      M2: 16,
      detail: null,
    },
    {
      K: 19,
      M2: 17,
      detail: null,
    },
    {
      K: 20,
      M2: 18,
      detail: null,
    },
    {
      K: 21,
      M2: 19,
      detail: null,
    },
    {
      K: 22,
      M2: 20,
      detail: null,
    },
    {
      K: 23,
      M2: 21,
      detail: null,
    },
    {
      K: 24,
      M2: 22,
      detail: null,
    },
    {
      K: 25,
      M2: 23,
      detail: null,
    },
    {
      K: 26,
      M2: 24,
      detail: null,
    },
    {
      K: 27,
      M2: 25,
      detail: null,
    },
    {
      K: 28,
      M2: 26,
      detail: null,
    },
    {
      K: 29,
      M2: 27,
      detail: null,
    },
    {
      K: 30,
      M2: 28,
      detail: null,
    },
    {
      K: 31,
      M2: 29,
      detail: null,
    },
    {
      K: 32,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [30] } },
    },
    {
      K: 33,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [30] } },
    },
    {
      K: null,
      M2: 30,
      detail: { instance: ["M2"], eq: { K: [32, 33] } },
    },
    {
      K: 34,
      M2: 31,
      detail: null,
    },
    {
      K: 35,
      M2: 32,
      detail: null,
    },
    {
      K: 36,
      M2: 33,
      detail: null,
    },
    {
      K: 37,
      M2: 34,
      detail: null,
    },
    {
      K: 38,
      M2: 35,
      detail: null,
    },
    {
      K: 39,
      M2: 36,
      detail: null,
    },
    {
      K: 40,
      M2: 37,
      detail: null,
    },
    {
      K: 41,
      M2: 38,
      detail: null,
    },
    {
      K: 42,
      M2: 39,
      detail: null,
    },
    {
      K: 43,
      M2: 40,
      detail: null,
    },
    {
      K: 44,
      M2: 41,
      detail: null,
    },
    {
      K: 45,
      M2: 42,
      detail: null,
    },
    {
      K: 46,
      M2: 43,
      detail: null,
    },
    {
      K: 47,
      M2: 44,
      detail: null,
    },
    {
      K: 48,
      M2: 45,
      detail: null,
    },
    {
      K: 49,
      M2: 46,
      detail: null,
    },
    {
      K: 50,
      M2: 47,
      detail: null,
    },
    {
      K: 51,
      M2: 48,
      detail: null,
    },
    {
      K: 52,
      M2: 49,
      detail: null,
    },
    {
      K: 53,
      M2: 50,
      detail: null,
    },
  ],
  43: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [51, 52] } },
    },
    {
      K: null,
      M2: 51,
      detail: { instance: ["M2"], eq: { K: [52] } },
    },
    {
      K: null,
      M2: 52,
      detail: { instance: ["M2"], eq: { K: [52] } },
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
    {
      K: 61,
      M2: 61,
      detail: null,
    },
    {
      K: 62,
      M2: 62,
      detail: null,
    },
    {
      K: 63,
      M2: 63,
      detail: null,
    },
    {
      K: 64,
      M2: 64,
      detail: null,
    },
    {
      K: 65,
      M2: 65,
      detail: null,
    },
    {
      K: 66,
      M2: 66,
      detail: null,
    },
    {
      K: 67,
      M2: 67,
      detail: null,
    },
    {
      K: 68,
      M2: 68,
      detail: null,
    },
    {
      K: 69,
      M2: 69,
      detail: null,
    },
    {
      K: 70,
      M2: 70,
      detail: null,
    },
    {
      K: 71,
      M2: 71,
      detail: null,
    },
    {
      K: 72,
      M2: 72,
      detail: null,
    },
    {
      K: 73,
      M2: 73,
      detail: null,
    },
    {
      K: 74,
      M2: 74,
      detail: null,
    },
    {
      K: 75,
      M2: 75,
      detail: null,
    },
    {
      K: 76,
      M2: 76,
      detail: null,
    },
    {
      K: 77,
      M2: 77,
      detail: null,
    },
    {
      K: 78,
      M2: 78,
      detail: null,
    },
    {
      K: 79,
      M2: 79,
      detail: null,
    },
    {
      K: 80,
      M2: 80,
      detail: null,
    },
    {
      K: 81,
      M2: 81,
      detail: null,
    },
    {
      K: 82,
      M2: 82,
      detail: null,
    },
    {
      K: 83,
      M2: 83,
      detail: null,
    },
    {
      K: 84,
      M2: 84,
      detail: null,
    },
    {
      K: 85,
      M2: 85,
      detail: null,
    },
    {
      K: 86,
      M2: 86,
      detail: null,
    },
    {
      K: 87,
      M2: 87,
      detail: null,
    },
    {
      K: 88,
      M2: 88,
      detail: null,
    },
    {
      K: 89,
      M2: 89,
      detail: null,
    },
  ],
  44: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [33] } },
    },
    {
      K: 35,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [33] } },
    },
    {
      K: null,
      M2: 33,
      detail: { instance: ["M2"], eq: { K: [34, 35] } },
    },
    {
      K: 36,
      M2: 34,
      detail: null,
    },
    {
      K: 37,
      M2: 35,
      detail: null,
    },
    {
      K: 38,
      M2: 36,
      detail: null,
    },
    {
      K: 39,
      M2: 37,
      detail: null,
    },
    {
      K: 40,
      M2: 38,
      detail: null,
    },
    {
      K: 41,
      M2: 39,
      detail: null,
    },
    {
      K: 42,
      M2: 40,
      detail: null,
    },
    {
      K: 43,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [41] } },
    },
    {
      K: 44,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [41] } },
    },
    {
      K: null,
      M2: 41,
      detail: { instance: ["M2"], eq: { K: [43, 44] } },
    },
    {
      K: 45,
      M2: 42,
      detail: null,
    },
    {
      K: 46,
      M2: 43,
      detail: null,
    },
    {
      K: 47,
      M2: 44,
      detail: null,
    },
    {
      K: 48,
      M2: 45,
      detail: null,
    },
    {
      K: 49,
      M2: 46,
      detail: null,
    },
    {
      K: 50,
      M2: 47,
      detail: null,
    },
    {
      K: 51,
      M2: 48,
      detail: null,
    },
    {
      K: 52,
      M2: 49,
      detail: null,
    },
    {
      K: 53,
      M2: 50,
      detail: null,
    },
    {
      K: 54,
      M2: 51,
      detail: null,
    },
    {
      K: 55,
      M2: 52,
      detail: null,
    },
    {
      K: 56,
      M2: 53,
      detail: null,
    },
    {
      K: 57,
      M2: 54,
      detail: null,
    },
    {
      K: 58,
      M2: 55,
      detail: null,
    },
    {
      K: 59,
      M2: 56,
      detail: null,
    },
  ],
  45: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
  ],
  46: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
  ],
  47: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [4, 5] } },
    },
    {
      K: null,
      M2: 4,
      detail: { instance: ["M2"], eq: { K: [4] } },
    },
    {
      K: null,
      M2: 5,
      detail: { instance: ["M2"], eq: { K: [4] } },
    },
    {
      K: 5,
      M2: 6,
      detail: null,
    },
    {
      K: 6,
      M2: 7,
      detail: null,
    },
    {
      K: 7,
      M2: 8,
      detail: null,
    },
    {
      K: 8,
      M2: 9,
      detail: null,
    },
    {
      K: 9,
      M2: 10,
      detail: null,
    },
    {
      K: 10,
      M2: 11,
      detail: null,
    },
    {
      K: 11,
      M2: 12,
      detail: null,
    },
    {
      K: 12,
      M2: 13,
      detail: null,
    },
    {
      K: 13,
      M2: 14,
      detail: null,
    },
    {
      K: 14,
      M2: 15,
      detail: null,
    },
    {
      K: 15,
      M2: 16,
      detail: null,
    },
    {
      K: 16,
      M2: 17,
      detail: null,
    },
    {
      K: 17,
      M2: 18,
      detail: null,
    },
    {
      K: 18,
      M2: 19,
      detail: null,
    },
    {
      K: 19,
      M2: 20,
      detail: null,
    },
    {
      K: 20,
      M2: 21,
      detail: null,
    },
    {
      K: 21,
      M2: 22,
      detail: null,
    },
    {
      K: 22,
      M2: 23,
      detail: null,
    },
    {
      K: 23,
      M2: 24,
      detail: null,
    },
    {
      K: 24,
      M2: 25,
      detail: null,
    },
    {
      K: 25,
      M2: 26,
      detail: null,
    },
    {
      K: 26,
      M2: 27,
      detail: null,
    },
    {
      K: 27,
      M2: 28,
      detail: null,
    },
    {
      K: 28,
      M2: 29,
      detail: null,
    },
    {
      K: 29,
      M2: 30,
      detail: null,
    },
    {
      K: 30,
      M2: 31,
      detail: null,
    },
    {
      K: 31,
      M2: 32,
      detail: null,
    },
    {
      K: 32,
      M2: 33,
      detail: null,
    },
    {
      K: 33,
      M2: 34,
      detail: null,
    },
    {
      K: 34,
      M2: 35,
      detail: null,
    },
    {
      K: 35,
      M2: 36,
      detail: null,
    },
    {
      K: 36,
      M2: 37,
      detail: null,
    },
    {
      K: 37,
      M2: 38,
      detail: null,
    },
    {
      K: 38,
      M2: 39,
      detail: null,
    },
  ],
  48: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
  ],
  49: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
  ],
  50: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
  ],
  51: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
    {
      K: 56,
      M2: 56,
      detail: null,
    },
    {
      K: 57,
      M2: 57,
      detail: null,
    },
    {
      K: 58,
      M2: 58,
      detail: null,
    },
    {
      K: 59,
      M2: 59,
      detail: null,
    },
    {
      K: 60,
      M2: 60,
      detail: null,
    },
  ],
  52: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [12] } },
    },
    {
      K: 14,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [12] } },
    },
    {
      K: null,
      M2: 12,
      detail: { instance: ["M2"], eq: { K: [13, 14] } },
    },
    {
      K: 15,
      M2: 13,
      detail: null,
    },
    {
      K: 16,
      M2: 14,
      detail: null,
    },
    {
      K: 17,
      M2: 15,
      detail: null,
    },
    {
      K: 18,
      M2: 16,
      detail: null,
    },
    {
      K: 19,
      M2: 17,
      detail: null,
    },
    {
      K: 20,
      M2: 18,
      detail: null,
    },
    {
      K: 21,
      M2: 19,
      detail: null,
    },
    {
      K: 22,
      M2: 20,
      detail: null,
    },
    {
      K: 23,
      M2: 21,
      detail: null,
    },
    {
      K: 24,
      M2: 22,
      detail: null,
    },
    {
      K: 25,
      M2: 23,
      detail: null,
    },
    {
      K: 26,
      M2: 24,
      detail: null,
    },
    {
      K: 27,
      M2: 25,
      detail: null,
    },
    {
      K: 28,
      M2: 26,
      detail: null,
    },
    {
      K: 29,
      M2: 27,
      detail: null,
    },
    {
      K: 30,
      M2: 28,
      detail: null,
    },
    {
      K: 31,
      M2: 29,
      detail: null,
    },
    {
      K: 32,
      M2: 30,
      detail: null,
    },
    {
      K: 33,
      M2: 31,
      detail: null,
    },
    {
      K: 34,
      M2: 32,
      detail: null,
    },
    {
      K: 35,
      M2: 33,
      detail: null,
    },
    {
      K: 36,
      M2: 34,
      detail: null,
    },
    {
      K: 37,
      M2: 35,
      detail: null,
    },
    {
      K: 38,
      M2: 36,
      detail: null,
    },
    {
      K: 39,
      M2: 37,
      detail: null,
    },
    {
      K: 40,
      M2: 38,
      detail: null,
    },
    {
      K: 41,
      M2: 39,
      detail: null,
    },
    {
      K: 42,
      M2: 40,
      detail: null,
    },
    {
      K: 43,
      M2: 41,
      detail: null,
    },
    {
      K: 44,
      M2: 42,
      detail: null,
    },
    {
      K: 45,
      M2: 43,
      detail: null,
    },
    {
      K: 46,
      M2: 44,
      detail: null,
    },
    {
      K: 47,
      M2: 45,
      detail: null,
    },
    {
      K: 48,
      M2: 46,
      detail: null,
    },
    {
      K: 49,
      M2: 47,
      detail: null,
    },
  ],
  53: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [28] } },
    },
    {
      K: 29,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [28] } },
    },
    {
      K: null,
      M2: 28,
      detail: { instance: ["M2"], eq: { K: [28, 29] } },
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
    {
      K: 61,
      M2: 60,
      detail: null,
    },
    {
      K: 62,
      M2: 61,
      detail: null,
    },
  ],
  54: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
    {
      K: 53,
      M2: 53,
      detail: null,
    },
    {
      K: 54,
      M2: 54,
      detail: null,
    },
    {
      K: 55,
      M2: 55,
      detail: null,
    },
  ],
  55: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [2] } },
    },
    {
      K: 4,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [2] } },
    },
    {
      K: null,
      M2: 2,
      detail: { instance: ["M2"], eq: { K: [3, 4] } },
    },
    {
      K: 5,
      M2: 3,
      detail: null,
    },
    {
      K: 6,
      M2: 4,
      detail: null,
    },
    {
      K: 7,
      M2: 5,
      detail: null,
    },
    {
      K: 8,
      M2: 6,
      detail: null,
    },
    {
      K: 9,
      M2: 7,
      detail: null,
    },
    {
      K: 10,
      M2: 8,
      detail: null,
    },
    {
      K: 11,
      M2: 9,
      detail: null,
    },
    {
      K: 12,
      M2: 10,
      detail: null,
    },
    {
      K: 13,
      M2: 11,
      detail: null,
    },
    {
      K: 14,
      M2: 12,
      detail: null,
    },
    {
      K: 15,
      M2: 13,
      detail: null,
    },
    {
      K: 16,
      M2: 14,
      detail: null,
    },
    {
      K: 17,
      M2: 15,
      detail: null,
    },
    {
      K: 18,
      M2: 16,
      detail: null,
    },
    {
      K: 19,
      M2: 17,
      detail: null,
    },
    {
      K: 20,
      M2: 18,
      detail: null,
    },
    {
      K: 21,
      M2: 19,
      detail: null,
    },
    {
      K: 22,
      M2: 20,
      detail: null,
    },
    {
      K: 23,
      M2: 21,
      detail: null,
    },
    {
      K: 24,
      M2: 22,
      detail: null,
    },
    {
      K: 25,
      M2: 23,
      detail: null,
    },
    {
      K: 26,
      M2: 24,
      detail: null,
    },
    {
      K: 27,
      M2: 25,
      detail: null,
    },
    {
      K: 28,
      M2: 26,
      detail: null,
    },
    {
      K: 29,
      M2: 27,
      detail: null,
    },
    {
      K: 30,
      M2: 28,
      detail: null,
    },
    {
      K: 31,
      M2: 29,
      detail: null,
    },
    {
      K: 32,
      M2: 30,
      detail: null,
    },
    {
      K: 33,
      M2: 31,
      detail: null,
    },
    {
      K: 34,
      M2: 32,
      detail: null,
    },
    {
      K: 35,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [33, 34] } },
    },
    {
      K: null,
      M2: 33,
      detail: { instance: ["M2"], eq: { K: [35] } },
    },
    {
      K: null,
      M2: 34,
      detail: { instance: ["M2"], eq: { K: [35] } },
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
    {
      K: 57,
      M2: 56,
      detail: null,
    },
    {
      K: 58,
      M2: 57,
      detail: null,
    },
    {
      K: 59,
      M2: 58,
      detail: null,
    },
    {
      K: 60,
      M2: 59,
      detail: null,
    },
    {
      K: 61,
      M2: 60,
      detail: null,
    },
    {
      K: 62,
      M2: 61,
      detail: null,
    },
    {
      K: 63,
      M2: 62,
      detail: null,
    },
    {
      K: 64,
      M2: 63,
      detail: null,
    },
    {
      K: 65,
      M2: 64,
      detail: null,
    },
    {
      K: 66,
      M2: 65,
      detail: null,
    },
    {
      K: 67,
      M2: 66,
      detail: null,
    },
    {
      K: 68,
      M2: 67,
      detail: null,
    },
    {
      K: 69,
      M2: 68,
      detail: null,
    },
    {
      K: 70,
      M2: 69,
      detail: null,
    },
    {
      K: 71,
      M2: 70,
      detail: null,
    },
    {
      K: 72,
      M2: 71,
      detail: null,
    },
    {
      K: 73,
      M2: 72,
      detail: null,
    },
    {
      K: 74,
      M2: 73,
      detail: null,
    },
    {
      K: 75,
      M2: 74,
      detail: null,
    },
    {
      K: 76,
      M2: 75,
      detail: null,
    },
    {
      K: 77,
      M2: 76,
      detail: null,
    },
    {
      K: 78,
      M2: 77,
      detail: null,
    },
  ],
  56: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [8, 9] } },
    },
    {
      K: null,
      M2: 8,
      detail: { instance: ["M2"], eq: { K: [8] } },
    },
    {
      K: null,
      M2: 9,
      detail: { instance: ["M2"], eq: { K: [8] } },
    },
    {
      K: 9,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [10, 11] } },
    },
    {
      K: null,
      M2: 10,
      detail: { instance: ["M2"], eq: { K: [9] } },
    },
    {
      K: null,
      M2: 11,
      detail: { instance: ["M2"], eq: { K: [9] } },
    },
    {
      K: 10,
      M2: 12,
      detail: null,
    },
    {
      K: 11,
      M2: 13,
      detail: null,
    },
    {
      K: 12,
      M2: 14,
      detail: null,
    },
    {
      K: 13,
      M2: 15,
      detail: null,
    },
    {
      K: 14,
      M2: 16,
      detail: null,
    },
    {
      K: 15,
      M2: 17,
      detail: null,
    },
    {
      K: 16,
      M2: 18,
      detail: null,
    },
    {
      K: 17,
      M2: 19,
      detail: null,
    },
    {
      K: 18,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [20, 21] } },
    },
    {
      K: null,
      M2: 20,
      detail: { instance: ["M2"], eq: { K: [18] } },
    },
    {
      K: null,
      M2: 21,
      detail: { instance: ["M2"], eq: { K: [18] } },
    },
    {
      K: 19,
      M2: 22,
      detail: null,
    },
    {
      K: 20,
      M2: 23,
      detail: null,
    },
    {
      K: 21,
      M2: 24,
      detail: null,
    },
    {
      K: 22,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [25] } },
    },
    {
      K: 23,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [25] } },
    },
    {
      K: null,
      M2: 25,
      detail: { instance: ["M2"], eq: { K: [22, 23] } },
    },
    {
      K: 24,
      M2: 26,
      detail: null,
    },
    {
      K: 25,
      M2: 27,
      detail: null,
    },
    {
      K: 26,
      M2: 28,
      detail: null,
    },
    {
      K: 27,
      M2: 29,
      detail: null,
    },
    {
      K: 28,
      M2: 30,
      detail: null,
    },
    {
      K: 29,
      M2: 31,
      detail: null,
    },
    {
      K: 30,
      M2: 32,
      detail: null,
    },
    {
      K: 31,
      M2: 33,
      detail: null,
    },
    {
      K: 32,
      M2: 34,
      detail: null,
    },
    {
      K: 33,
      M2: 35,
      detail: null,
    },
    {
      K: 34,
      M2: 36,
      detail: null,
    },
    {
      K: 35,
      M2: 37,
      detail: null,
    },
    {
      K: 36,
      M2: 38,
      detail: null,
    },
    {
      K: 37,
      M2: 39,
      detail: null,
    },
    {
      K: 38,
      M2: 40,
      detail: null,
    },
    {
      K: 39,
      M2: 41,
      detail: null,
    },
    {
      K: 40,
      M2: 42,
      detail: null,
    },
    {
      K: 41,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [43, 44] } },
    },
    {
      K: null,
      M2: 43,
      detail: { instance: ["M2"], eq: { K: [41] } },
    },
    {
      K: null,
      M2: 44,
      detail: { instance: ["M2"], eq: { K: [41] } },
    },
    {
      K: 42,
      M2: 45,
      detail: null,
    },
    {
      K: 43,
      M2: 46,
      detail: null,
    },
    {
      K: 44,
      M2: 47,
      detail: null,
    },
    {
      K: 45,
      M2: 48,
      detail: null,
    },
    {
      K: 46,
      M2: 49,
      detail: null,
    },
    {
      K: 47,
      M2: 50,
      detail: null,
    },
    {
      K: 48,
      M2: 51,
      detail: null,
    },
    {
      K: 49,
      M2: 52,
      detail: null,
    },
    {
      K: 50,
      M2: 53,
      detail: null,
    },
    {
      K: 51,
      M2: 54,
      detail: null,
    },
    {
      K: 52,
      M2: 55,
      detail: null,
    },
    {
      K: 53,
      M2: 56,
      detail: null,
    },
    {
      K: 54,
      M2: 57,
      detail: null,
    },
    {
      K: 55,
      M2: 58,
      detail: null,
    },
    {
      K: 56,
      M2: 59,
      detail: null,
    },
    {
      K: 57,
      M2: 60,
      detail: null,
    },
    {
      K: 58,
      M2: 61,
      detail: null,
    },
    {
      K: 59,
      M2: 62,
      detail: null,
    },
    {
      K: 60,
      M2: 63,
      detail: null,
    },
    {
      K: 61,
      M2: 64,
      detail: null,
    },
    {
      K: 62,
      M2: 65,
      detail: null,
    },
    {
      K: 63,
      M2: 66,
      detail: null,
    },
    {
      K: 64,
      M2: 67,
      detail: null,
    },
    {
      K: 65,
      M2: 68,
      detail: null,
    },
    {
      K: 66,
      M2: 69,
      detail: null,
    },
    {
      K: 67,
      M2: 70,
      detail: null,
    },
    {
      K: 68,
      M2: 71,
      detail: null,
    },
    {
      K: 69,
      M2: 72,
      detail: null,
    },
    {
      K: 70,
      M2: 73,
      detail: null,
    },
    {
      K: 71,
      M2: 74,
      detail: null,
    },
    {
      K: 72,
      M2: 75,
      detail: null,
    },
    {
      K: 73,
      M2: 76,
      detail: null,
    },
    {
      K: 74,
      M2: 77,
      detail: null,
    },
    {
      K: 75,
      M2: 78,
      detail: null,
    },
    {
      K: 76,
      M2: 79,
      detail: null,
    },
    {
      K: 77,
      M2: 80,
      detail: null,
    },
    {
      K: 78,
      M2: 81,
      detail: null,
    },
    {
      K: 79,
      M2: 82,
      detail: null,
    },
    {
      K: 80,
      M2: 83,
      detail: null,
    },
    {
      K: 81,
      M2: 84,
      detail: null,
    },
    {
      K: 82,
      M2: 85,
      detail: null,
    },
    {
      K: 83,
      M2: 86,
      detail: null,
    },
    {
      K: 84,
      M2: 87,
      detail: null,
    },
    {
      K: 85,
      M2: 88,
      detail: null,
    },
    {
      K: 86,
      M2: 89,
      detail: null,
    },
    {
      K: 87,
      M2: 90,
      detail: null,
    },
    {
      K: 88,
      M2: 91,
      detail: null,
    },
    {
      K: 89,
      M2: 92,
      detail: null,
    },
    {
      K: 90,
      M2: 93,
      detail: null,
    },
    {
      K: 91,
      M2: 94,
      detail: null,
    },
    {
      K: 92,
      M2: 95,
      detail: null,
    },
    {
      K: 93,
      M2: 96,
      detail: null,
    },
    {
      K: 94,
      M2: 97,
      detail: null,
    },
    {
      K: 95,
      M2: 98,
      detail: null,
    },
    {
      K: 96,
      M2: 99,
      detail: null,
    },
  ],
  57: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [13] } },
    },
    {
      K: 14,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [13] } },
    },
    {
      K: null,
      M2: 13,
      detail: { instance: ["M2"], eq: { K: [13, 14] } },
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
  ],
  58: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [20] } },
    },
    {
      K: 21,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [20] } },
    },
    {
      K: null,
      M2: 20,
      detail: { instance: ["M2"], eq: { K: [20, 21] } },
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
  ],
  59: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
  ],
  60: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
  ],
  61: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
  ],
  62: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
  ],
  63: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
  ],
  64: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
  ],
  65: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
  ],
  66: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
  ],
  67: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [9, 1] } },
    },
    {
      K: null,
      M2: 9,
      detail: { instance: ["M2"], eq: { K: [9] } },
    },
    {
      K: null,
      M2: 10,
      detail: { instance: ["M2"], eq: { K: [9] } },
    },
    {
      K: 10,
      M2: 11,
      detail: null,
    },
    {
      K: 11,
      M2: 12,
      detail: null,
    },
    {
      K: 12,
      M2: 13,
      detail: null,
    },
    {
      K: 13,
      M2: 14,
      detail: null,
    },
    {
      K: 14,
      M2: 15,
      detail: null,
    },
    {
      K: 15,
      M2: 16,
      detail: null,
    },
    {
      K: 16,
      M2: 17,
      detail: null,
    },
    {
      K: 17,
      M2: 18,
      detail: null,
    },
    {
      K: 18,
      M2: 19,
      detail: null,
    },
    {
      K: 19,
      M2: 20,
      detail: null,
    },
    {
      K: 20,
      M2: 21,
      detail: null,
    },
    {
      K: 21,
      M2: 22,
      detail: null,
    },
    {
      K: 22,
      M2: 23,
      detail: null,
    },
    {
      K: 23,
      M2: 24,
      detail: null,
    },
    {
      K: 24,
      M2: 25,
      detail: null,
    },
    {
      K: 25,
      M2: 26,
      detail: null,
    },
    {
      K: 26,
      M2: 27,
      detail: null,
    },
    {
      K: 27,
      M2: 28,
      detail: null,
    },
    {
      K: 28,
      M2: 29,
      detail: null,
    },
    {
      K: 29,
      M2: 30,
      detail: null,
    },
    {
      K: 30,
      M2: 31,
      detail: null,
    },
  ],
  68: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
  ],
  69: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: 16,
      detail: null,
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [24, 25] } },
    },
    {
      K: null,
      M2: 24,
      detail: { instance: ["M2"], eq: { K: [25] } },
    },
    {
      K: null,
      M2: 25,
      detail: { instance: ["M2"], eq: { K: [25] } },
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
    {
      K: 51,
      M2: 51,
      detail: null,
    },
    {
      K: 52,
      M2: 52,
      detail: null,
    },
  ],
  70: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
  ],
  71: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [23, 24] } },
    },
    {
      K: null,
      M2: 23,
      detail: { instance: ["M2"], eq: { K: [23] } },
    },
    {
      K: null,
      M2: 24,
      detail: { instance: ["M2"], eq: { K: [23] } },
    },
    {
      K: 24,
      M2: 25,
      detail: null,
    },
    {
      K: 25,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [26, 27] } },
    },
    {
      K: null,
      M2: 26,
      detail: { instance: ["M2"], eq: { K: [25] } },
    },
    {
      K: null,
      M2: 27,
      detail: { instance: ["M2"], eq: { K: [25] } },
    },
    {
      K: 26,
      M2: 28,
      detail: null,
    },
    {
      K: 27,
      M2: 29,
      detail: null,
    },
    {
      K: 28,
      M2: 30,
      detail: null,
    },
  ],
  72: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
  ],
  73: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
    {
      K: 12,
      M2: 11,
      detail: null,
    },
    {
      K: 13,
      M2: 12,
      detail: null,
    },
    {
      K: 14,
      M2: 13,
      detail: null,
    },
    {
      K: 15,
      M2: 14,
      detail: null,
    },
    {
      K: 16,
      M2: 15,
      detail: null,
    },
    {
      K: 17,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [16] } },
    },
    {
      K: 18,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [16] } },
    },
    {
      K: null,
      M2: 16,
      detail: { instance: ["M2"], eq: { K: [17, 18] } },
    },
    {
      K: 19,
      M2: 17,
      detail: null,
    },
    {
      K: 20,
      M2: 18,
      detail: null,
    },
  ],
  74: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [40] } },
    },
    {
      K: 41,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [40] } },
    },
    {
      K: null,
      M2: 40,
      detail: { instance: ["M2"], eq: { K: [40, 41] } },
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
    {
      K: 47,
      M2: 46,
      detail: null,
    },
    {
      K: 48,
      M2: 47,
      detail: null,
    },
    {
      K: 49,
      M2: 48,
      detail: null,
    },
    {
      K: 50,
      M2: 49,
      detail: null,
    },
    {
      K: 51,
      M2: 50,
      detail: null,
    },
    {
      K: 52,
      M2: 51,
      detail: null,
    },
    {
      K: 53,
      M2: 52,
      detail: null,
    },
    {
      K: 54,
      M2: 53,
      detail: null,
    },
    {
      K: 55,
      M2: 54,
      detail: null,
    },
    {
      K: 56,
      M2: 55,
      detail: null,
    },
  ],
  75: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [16] } },
    },
    {
      K: 17,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [16] } },
    },
    {
      K: null,
      M2: 16,
      detail: { instance: ["M2"], eq: { K: [16, 17] } },
    },
    {
      K: 18,
      M2: 17,
      detail: null,
    },
    {
      K: 19,
      M2: 18,
      detail: null,
    },
    {
      K: 20,
      M2: 19,
      detail: null,
    },
    {
      K: 21,
      M2: 20,
      detail: null,
    },
    {
      K: 22,
      M2: 21,
      detail: null,
    },
    {
      K: 23,
      M2: 22,
      detail: null,
    },
    {
      K: 24,
      M2: 23,
      detail: null,
    },
    {
      K: 25,
      M2: 24,
      detail: null,
    },
    {
      K: 26,
      M2: 25,
      detail: null,
    },
    {
      K: 27,
      M2: 26,
      detail: null,
    },
    {
      K: 28,
      M2: 27,
      detail: null,
    },
    {
      K: 29,
      M2: 28,
      detail: null,
    },
    {
      K: 30,
      M2: 29,
      detail: null,
    },
    {
      K: 31,
      M2: 30,
      detail: null,
    },
    {
      K: 32,
      M2: 31,
      detail: null,
    },
    {
      K: 33,
      M2: 32,
      detail: null,
    },
    {
      K: 34,
      M2: 33,
      detail: null,
    },
    {
      K: 35,
      M2: 34,
      detail: null,
    },
    {
      K: 36,
      M2: 35,
      detail: null,
    },
    {
      K: 37,
      M2: 36,
      detail: null,
    },
    {
      K: 38,
      M2: 37,
      detail: null,
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
  ],
  76: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
  ],
  77: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
    {
      K: 43,
      M2: 43,
      detail: null,
    },
    {
      K: 44,
      M2: 44,
      detail: null,
    },
    {
      K: 45,
      M2: 45,
      detail: null,
    },
    {
      K: 46,
      M2: 46,
      detail: null,
    },
    {
      K: 47,
      M2: 47,
      detail: null,
    },
    {
      K: 48,
      M2: 48,
      detail: null,
    },
    {
      K: 49,
      M2: 49,
      detail: null,
    },
    {
      K: 50,
      M2: 50,
      detail: null,
    },
  ],
  78: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
  ],
  79: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [37] } },
    },
    {
      K: 38,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [37] } },
    },
    {
      K: null,
      M2: 37,
      detail: { instance: ["M2"], eq: { K: [37, 38] } },
    },
    {
      K: 39,
      M2: 38,
      detail: null,
    },
    {
      K: 40,
      M2: 39,
      detail: null,
    },
    {
      K: 41,
      M2: 40,
      detail: null,
    },
    {
      K: 42,
      M2: 41,
      detail: null,
    },
    {
      K: 43,
      M2: 42,
      detail: null,
    },
    {
      K: 44,
      M2: 43,
      detail: null,
    },
    {
      K: 45,
      M2: 44,
      detail: null,
    },
    {
      K: 46,
      M2: 45,
      detail: null,
    },
  ],
  80: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
    {
      K: 37,
      M2: 37,
      detail: null,
    },
    {
      K: 38,
      M2: 38,
      detail: null,
    },
    {
      K: 39,
      M2: 39,
      detail: null,
    },
    {
      K: 40,
      M2: 40,
      detail: null,
    },
    {
      K: 41,
      M2: 41,
      detail: null,
    },
    {
      K: 42,
      M2: 42,
      detail: null,
    },
  ],
  81: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
  ],
  82: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
  ],
  83: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
    {
      K: 27,
      M2: 27,
      detail: null,
    },
    {
      K: 28,
      M2: 28,
      detail: null,
    },
    {
      K: 29,
      M2: 29,
      detail: null,
    },
    {
      K: 30,
      M2: 30,
      detail: null,
    },
    {
      K: 31,
      M2: 31,
      detail: null,
    },
    {
      K: 32,
      M2: 32,
      detail: null,
    },
    {
      K: 33,
      M2: 33,
      detail: null,
    },
    {
      K: 34,
      M2: 34,
      detail: null,
    },
    {
      K: 35,
      M2: 35,
      detail: null,
    },
    {
      K: 36,
      M2: 36,
      detail: null,
    },
  ],
  84: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
  ],
  85: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
  ],
  86: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
  ],
  87: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
  ],
  88: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
    {
      K: 22,
      M2: 22,
      detail: null,
    },
    {
      K: 23,
      M2: 23,
      detail: null,
    },
    {
      K: 24,
      M2: 24,
      detail: null,
    },
    {
      K: 25,
      M2: 25,
      detail: null,
    },
    {
      K: 26,
      M2: 26,
      detail: null,
    },
  ],
  89: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [15, 16] } },
    },
    {
      K: null,
      M2: 15,
      detail: { instance: ["M2"], eq: { K: [15] } },
    },
    {
      K: null,
      M2: 16,
      detail: { instance: ["M2"], eq: { K: [15] } },
    },
    {
      K: 16,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [17, 18] } },
    },
    {
      K: null,
      M2: 17,
      detail: { instance: ["M2"], eq: { K: [16] } },
    },
    {
      K: null,
      M2: 18,
      detail: { instance: ["M2"], eq: { K: [16] } },
    },
    {
      K: 17,
      M2: 19,
      detail: null,
    },
    {
      K: 18,
      M2: 20,
      detail: null,
    },
    {
      K: 19,
      M2: 21,
      detail: null,
    },
    {
      K: 20,
      M2: 22,
      detail: null,
    },
    {
      K: 21,
      M2: 23,
      detail: null,
    },
    {
      K: 22,
      M2: 24,
      detail: null,
    },
    {
      K: 23,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [25, 26] } },
    },
    {
      K: null,
      M2: 25,
      detail: { instance: ["M2"], eq: { K: [23] } },
    },
    {
      K: null,
      M2: 26,
      detail: { instance: ["M2"], eq: { K: [23] } },
    },
    {
      K: 24,
      M2: 27,
      detail: null,
    },
    {
      K: 25,
      M2: 28,
      detail: null,
    },
    {
      K: 26,
      M2: 29,
      detail: null,
    },
    {
      K: 27,
      M2: 30,
      detail: null,
    },
    {
      K: 28,
      M2: 31,
      detail: null,
    },
    {
      K: 29,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [32] } },
    },
    {
      K: 30,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [32] } },
    },
    {
      K: null,
      M2: 32,
      detail: { instance: ["M2"], eq: { K: [29, 3] } },
    },
  ],
  90: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
  ],
  91: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
  ],
  92: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: 15,
      detail: null,
    },
    {
      K: 16,
      M2: 16,
      detail: null,
    },
    {
      K: 17,
      M2: 17,
      detail: null,
    },
    {
      K: 18,
      M2: 18,
      detail: null,
    },
    {
      K: 19,
      M2: 19,
      detail: null,
    },
    {
      K: 20,
      M2: 20,
      detail: null,
    },
    {
      K: 21,
      M2: 21,
      detail: null,
    },
  ],
  93: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
  ],
  94: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
  ],
  95: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
  ],
  96: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
    {
      K: 12,
      M2: 12,
      detail: null,
    },
    {
      K: 13,
      M2: 13,
      detail: null,
    },
    {
      K: 14,
      M2: 14,
      detail: null,
    },
    {
      K: 15,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [15, 16] } },
    },
    {
      K: null,
      M2: 15,
      detail: { instance: ["M2"], eq: { K: [15] } },
    },
    {
      K: null,
      M2: 16,
      detail: { instance: ["M2"], eq: { K: [15] } },
    },
    {
      K: 16,
      M2: 17,
      detail: null,
    },
    {
      K: 17,
      M2: 18,
      detail: null,
    },
    {
      K: 18,
      M2: 19,
      detail: null,
    },
    {
      K: 19,
      M2: 20,
      detail: null,
    },
  ],
  97: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
  ],
  98: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
  ],
  99: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [6, 7] } },
    },
    {
      K: null,
      M2: 6,
      detail: { instance: ["M2"], eq: { K: [6] } },
    },
    {
      K: null,
      M2: 7,
      detail: { instance: ["M2"], eq: { K: [6] } },
    },
    {
      K: 7,
      M2: 8,
      detail: null,
    },
    {
      K: 8,
      M2: 9,
      detail: null,
    },
  ],
  100: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
    {
      K: 10,
      M2: 10,
      detail: null,
    },
    {
      K: 11,
      M2: 11,
      detail: null,
    },
  ],
  101: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: 2,
      detail: null,
    },
    {
      K: 4,
      M2: 3,
      detail: null,
    },
    {
      K: 5,
      M2: 4,
      detail: null,
    },
    {
      K: 6,
      M2: 5,
      detail: null,
    },
    {
      K: 7,
      M2: 6,
      detail: null,
    },
    {
      K: 8,
      M2: 7,
      detail: null,
    },
    {
      K: 9,
      M2: 8,
      detail: null,
    },
    {
      K: 10,
      M2: 9,
      detail: null,
    },
    {
      K: 11,
      M2: 10,
      detail: null,
    },
  ],
  102: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
  ],
  103: [
    {
      K: 1,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: 2,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [1] } },
    },
    {
      K: null,
      M2: 1,
      detail: { instance: ["M2"], eq: { K: [1, 2] } },
    },
    {
      K: 3,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [2, 3] } },
    },
    {
      K: null,
      M2: 2,
      detail: { instance: ["M2"], eq: { K: [3] } },
    },
    {
      K: null,
      M2: 3,
      detail: { instance: ["M2"], eq: { K: [3] } },
    },
  ],
  104: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
    {
      K: 7,
      M2: 7,
      detail: null,
    },
    {
      K: 8,
      M2: 8,
      detail: null,
    },
    {
      K: 9,
      M2: 9,
      detail: null,
    },
  ],
  105: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
  ],
  106: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [4, 5] } },
    },
    {
      K: null,
      M2: 4,
      detail: { instance: ["M2"], eq: { K: [4] } },
    },
    {
      K: null,
      M2: 5,
      detail: { instance: ["M2"], eq: { K: [4] } },
    },
  ],
  107: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [6] } },
    },
    {
      K: 7,
      M2: null,
      detail: { instance: ["K"], eq: { M2: [6] } },
    },
    {
      K: null,
      M2: 6,
      detail: { instance: ["M2"], eq: { K: [6, 7] } },
    },
  ],
  108: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
  ],
  109: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
  ],
  110: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
  ],
  111: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
  ],
  112: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
  ],
  113: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
  ],
  114: [
    {
      K: 1,
      M2: 1,
      detail: null,
    },
    {
      K: 2,
      M2: 2,
      detail: null,
    },
    {
      K: 3,
      M2: 3,
      detail: null,
    },
    {
      K: 4,
      M2: 4,
      detail: null,
    },
    {
      K: 5,
      M2: 5,
      detail: null,
    },
    {
      K: 6,
      M2: 6,
      detail: null,
    },
  ],
}
