import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import * as Localization from "expo-localization"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { I18nManager } from "react-native"
import RNRestart from "react-native-restart"

import en, { Translations } from "./en"
import fr from "./fr"
import ar from "./ar"
import restartApp from "app/utils/restartApp"

const languageDetector = {
  type: "languageDetector",
  async: true,
  init: () => {},
  detect: async function (callback: (lang: string) => void) {
    try {
      // get stored language from Async storage
      await AsyncStorage.getItem("locale").then((language) => {
        I18nManager.allowRTL(language === "ar")
        I18nManager.forceRTL(language === "ar")
        if (language) {
          // if language was stored before, use this language in the app
          return callback(language)
        } else {
          // if language was not stored yet, use device's locale
          return callback(Localization.locale)
        }
      })
    } catch (error) {
      console.log("Error reading language", error)
    }
  },
  cacheUserLanguage: async function (language: string) {
    try {
      // save a user's language choice in Async storage
      await AsyncStorage.setItem("locale", language)
    } catch (error) {}
  },
}

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    compatibilityJSON: "v3",
    resources: {
      en: {
        translation: {
          ...en,
        },
      },
      fr: {
        translation: {
          ...fr,
        },
      },
      ar: {
        translation: {
          ...ar,
        },
      },
    },
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    react: {
      useSuspense: false,
    },
  })
  .then(() => {
    isRTL = i18n.dir() === "rtl"
    if (RNRestart && isRTL !== I18nManager.isRTL) {
      restartApp()
    }
  })

export const addNewResources = (resources) => {
  Object.keys(resources).forEach((language) => {
    i18n.addResourceBundle(language, "translation", resources[language], true, true)
  })
}

export const convertObjectToI18n = (obj: any, group: string, key: string): any => {
  const i18n: any = {}

  for (const res in obj) {
    if (obj.hasOwnProperty(res)) {
      for (const lang in obj[res]) {
        if (obj[res].hasOwnProperty(lang)) {
          if (!i18n[lang]) i18n[lang] = { [group]: { [key]: {} } }
          i18n[lang][group][key][res] = obj[res][lang]
        }
      }
    }
  }

  return i18n
}
// TODO : Make the process dynamic using wrap
/*
const wrap = (obj: any, path: string): any => {
    const levels = path.split(".")
    let result = obj

    for (let i = levels.length - 1; i >= 0; i--) {
      const temp = result
      result = {}
      result[levels[i]] = temp
    }

    return result
  } */

export const getLocale = () => {
  return i18n.language.split("-")[0]
}
export let isRTL = false

export default i18n

/**
 * Builds up valid keypaths for translations.
 */
export type TxKeyPath = RecursiveKeyOf<Translations>

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
  : Text
