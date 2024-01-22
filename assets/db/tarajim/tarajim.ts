import { BooksType } from "../BooksType"

export type TarajimID = "en_sahih" | "fr_hamidullah"

export const Tarajim: BooksType = {
  en_sahih: {
    id: "en_sahih",
    lang: "en",
    file: require("./en_sahih.sqlite"),
    enabled: true,
    meta: {
      name: {
        en: "English: Saheeh International",
        ar: "الإنجليزية: Saheeh International",
        fr: "Anglais: Saheeh International",
      },
      author: {
        en: "By Umm Muhammad (Emily Assami) & Mary Kennedy & Amatullah Bantley",
        ar: "من تأليف أم محمد (إيميلي أسامي) وماري كينيدي وأمت الله بانتلي",
        fr: "Par Umm Muhammad (Emily Assami) & Mary Kennedy & Amatullah Bantley",
      },
    },
  },
  fr_hamidullah: {
    id: "fr_hamidullah",
    lang: "fr",
    file: require("./fr_hamidullah.sqlite"),
    enabled: true,
    meta: {
      name: {
        en: "French: Muhammad Hamidullah",
        ar: "الفرنسية: محمد حميد الله",
        fr: "Français: Muhammad Hamidullah",
      },
      author: {
        en: "By Muhammad Hamidullah",
        ar: "من تأليف محمد حميد الله",
        fr: "Par Muhammad Hamidullah",
      },
    },
  },
}
