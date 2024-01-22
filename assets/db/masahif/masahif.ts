import { Masahif as MasahifType } from "app/quran-helpers/quranData"

export const Masahif: MasahifType = {
  shirifi2: {
    enabled: true,
    id: "shirifi2",
    name: "shirifi2",
    countingType: "kufi",
    ext: "png",
    url: "https://rsc.anaatlou.org/masahif/shirifi2/transparent", // "https://rsc.anaatlou.org/masahif/shirifi2/cropped",
    local: "masahif/shirifi2/transparent2",
    pages: 607,
    extraStartPages: 0,
    pagesByVerse: require("./pagesByVerse/shirifi2.json"),
    getAyatShadows: () => require("./ayatShadow/shirifi2.json"),
    meta: {
      name: {
        ar: "مصحف شريفي الثاني",
        en: "Mushaf Shirifi II",
        fr: "Mushaf Shirifi II",
      },
      riwaya: {
        ar: "رواية ورش عن الإمام نافع من طريق الأزرق",
        en: "Warsh from Imam Nafi' via Azraq",
        fr: "Warsh de l'Imam Nafi' via Azraq",
      },
      edition: {
        ar: "طبعة المؤسسة الوطنية للفنون المطبعية",
        en: "National Printing Arts Institution Edition",
        fr: "Édition de l'Institution nationale des arts d'impression",
      },
    },
  },
  imamMalik: {
    enabled: true,
    id: "imamMalik",
    name: "imamMalik",
    countingType: "madani2",
    ext: "png",
    url: "https://rsc.anaatlou.org/masahif/dar-imam-malik/transparent",
    local: "masahif/dar-imam-malik/transparent2",
    pages: 609,
    extraStartPages: 3,
    pagesByVerse: require("./pagesByVerse/imamMalik.json"),
    getAyatShadows: () => require("./ayatShadow/imamMalik.json"),
    meta: {
      name: {
        ar: "مصحف دار الإمام مالك",
        en: "Mushaf Dar Imam Malik",
        fr: "Mushaf Dar Imam Malik",
      },
      riwaya: {
        ar: "رواية ورش عن الإمام نافع من طريق الأزرق",
        en: "Warsh from Imam Nafi' via Azraq",
        fr: "Warsh de l'Imam Nafi' via Azraq",
      },
      edition: {
        ar: "طبعة دار الإمام مالك",
        en: "Dar Imam Malik Edition",
        fr: "Édition de Dar Imam Malik",
      },
    },
  },
}
