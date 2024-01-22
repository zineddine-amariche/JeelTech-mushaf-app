import { BooksType } from "../BooksType"

export type TafaseerID = "katheer" | "ar_tabary" | "ar_baghawy" | "ar_qurtuby" | "saadi"

export const Tafaseer: BooksType = {
  katheer: {
    enabled: true,
    id: "katheer",
    lang: "ar",
    file: require("./katheer.sqlite"),
    meta: {
      name: {
        ar: "تفسير ابن كثير",
        en: "Tafseer Ibn Katheer",
        fr: "Tafsir Ibn Kathir",
      },
      author: {
        ar: "للإمام عماد الدين أبي الفداء إسماعيل بن كثير القرشي الدمشقي المعروف بابن كثير (المتوفي 774 هـ)",
        en: "By Imam Imaduddin Abulfida Ismail bin Umar bin Katheer Al-Qurashi Al-Dimashqi (d. 774 AH)",
        fr: "Par l'imam Imaduddin Abulfida Ismail bin Umar bin Katheer Al-Qurashi Al-Dimashqi (d. 774 AH)",
      },
    },
  },
  ar_tabary: {
    enabled: true,
    id: "ar_tabary",
    lang: "ar",
    file: require("./ar_tabary.sqlite"),
    meta: {
      name: {
        ar: "تفسير الطبري",
        en: "Tafseer At-Tabari",
        fr: "Tafsir At-Tabari",
      },
      author: {
        ar: "للإمام أبي جعفر محمد بن جرير الطبري (المتوفي 310 هـ)",
        en: "By Imam Abu Jafar Muhammad ibn Jarir al-Tabari (d. 310 AH)",
        fr: "Par l'imam Abu Jafar Muhammad ibn Jarir al-Tabari (d. 310 AH)",
      },
    },
  },
  ar_baghawy: {
    enabled: true,
    id: "ar_baghawy",
    lang: "ar",
    file: require("./ar_baghawy.sqlite"),
    meta: {
      name: {
        ar: "تفسير البغوي",
        en: "Tafseer Al-Baghawy",
        fr: "Tafsir Al-Baghawy",
      },
      author: {
        ar: "للإمام أبو محمد، الحسين بن مسعود بن محمد المعروف بالفراء البغوي، الفقيه الشافعي، المحدث، المفسر (المتوفي 516 هـ)",
        en: "By Imam Abu Muhammad, Al-Hussein bin Masoud bin Muhammad Al-Farra Al-Baghawy, Al-Faqih Al-Shafi'i, Al-Muhaddith, Al-Mufassir (d. 516 AH)",
        fr: "Par l'imam Abu Muhammad, Al-Hussein bin Masoud bin Muhammad Al-Farra Al-Baghawy, Al-Faqih Al-Shafi'i, Al-Muhaddith, Al-Mufassir (d. 516 AH)",
      },
    },
  },
  ar_qurtuby: {
    enabled: true,
    id: "ar_qurtuby",
    lang: "ar",
    file: require("./ar_qurtuby.sqlite"),
    meta: {
      name: {
        ar: "تفسير القرطبي",
        en: "Tafseer Al-Qurtoby",
        fr: "Tafsir Al-Qurtoby",
      },
      author: {
        ar: "للإمام أبو عبد الله محمد بن أحمد بن أبي بكر الأنصاري القرطبي (المتوفي 671 هـ)",
        en: "By Imam Abu Abdullah Muhammad bin Ahmad bin Abu Bakr Al-Ansari Al-Qurtubi (d. 671 AH)",
        fr: "Par l'imam Abu Abdullah Muhammad bin Ahmad bin Abu Bakr Al-Ansari Al-Qurtubi (d. 671 AH)",
      },
    },
  },
  saadi: {
    enabled: false,
    id: "saadi",
    lang: "ar",
    file: null,
    meta: {
      name: {
        ar: "تفسير السعدي",
        en: "Tafseer As-Saadi",
        fr: "Tafsir As-Saadi",
      },
      author: {
        ar: "للشيخ عبد الرحمن بن ناصر السعدي (المتوفي 1376 هـ)",
        en: "By Sheikh Abdul Rahman bin Nasir As-Saadi (d. 1376 AH)",
        fr: "Par le cheikh Abdul Rahman bin Nasir As-Saadi (d. 1376 AH)",
      },
    },
  },
}
