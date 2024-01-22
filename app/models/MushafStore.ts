import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Mushaf, Quran } from "app/quran-helpers/quranData"
import * as storage from "../utils/storage"
import { FavoriteAyahModel } from "./FavoriteAyah"
import { BookmarkModel } from "./BookmarkModel"
import { getPrintPageText } from "app/utils/formatText"
import { equivalentVerse } from "app/quran-helpers/quranCountingData"
import { Reciters, RecitersID } from "assets/db/reciters/reciters"
import { Tafaseer, TafaseerID } from "assets/db/tafaseer/tafaseer"
import { Tarajim, TarajimID } from "assets/db/tarajim/tarajim"
import { showToast } from "app/utils/ToastMessage"
import { TxKeyPath, translate } from "app/i18n"

export const MushafStoreModel = types
  .model("MushafStore")
  .props({
    selectedMushaf: types.optional(types.frozen<Mushaf>(), "shirifi2"),
    selectedReciter: types.maybeNull(types.frozen<RecitersID>()),
    selectedTafseer: types.maybeNull(types.frozen<TafaseerID>()),
    selectedTarjama: types.maybeNull(types.frozen<TarajimID>()),
    onboardingCompleted: types.optional(types.boolean, false),
    onboardingSelectMushafCompleted: types.optional(types.boolean, false),
    locale: types.maybeNull(types.string),
    selectedPage: types.optional(types.number, 1),
    selectedVerses: types.optional(types.array(types.number), [1]),
    favoritesAyat: types.optional(types.array(FavoriteAyahModel), []),
    bookmarks: types.optional(types.array(BookmarkModel), [
      {
        verse: 1,
        mushaf: "shirifi2",
        date: new Date(),
      },
    ]),
  })
  .views((store) => ({
    get pageDetails() {
      return Quran.getPageDetails(store.selectedPage, store.selectedMushaf)
    },
    get selectedReciterDetails() {
      return Reciters[store.selectedReciter]
    },
    get selectedTafseerDetails() {
      return store.selectedTafseer ? Tafaseer[store.selectedTafseer] : null
    },
    get selectedTarjamaDetails() {
      return store.selectedTarjama ? Tarajim[store.selectedTarjama] : null
    },
    get selectedPrintPage() {
      return getPrintPageText(store.selectedPage, store.selectedMushaf)
    },
    get selectedVerse() {
      return store.selectedVerses[0]
    },
    get selectedSurah() {
      return Quran.getDupletByVerseNo(store.selectedVerse, store.selectedMushaf).surah
    },
    get selectedAyah() {
      return Quran.getDupletByVerseNo(store.selectedVerse, store.selectedMushaf).ayah
    },
  }))
  .views((store) => ({
    get favoriteAyahList() {
      return store.favoritesAyat
        .map((item) => ({
          ...item,
          verse: equivalentVerse(item.verse, item.mushaf, store.selectedMushaf),
        }))
        .filter((item, index, self) => index === self.findIndex((t) => t.verse === item.verse))
    },
    get bookmarkList() {
      return store.bookmarks.map((item) => {
        return {
          ...item,
          verse: equivalentVerse(item.verse, item.mushaf, store.selectedMushaf),
        }
      })
    },
  }))
  .views((store) => ({
    get bookmark() {
      return store.bookmarkList.at(-1)
    },
    get bookmarksHistory() {
      return store.bookmarkList.slice(0, -1)
    },
  }))
  .actions((store) => ({
    setSelectedMushaf(value: Mushaf) {
      store.selectedMushaf = value
    },
    setSelectedReciter(value: RecitersID) {
      store.selectedReciter = value
    },
    setSelectedTafseer(value: TafaseerID) {
      store.selectedTafseer = value
    },
    setSelectedTarjama(value: TarajimID) {
      store.selectedTarjama = value
    },
    setOnboardingCompleted(value: boolean) {
      store.onboardingCompleted = value
    },
    setOnboardingSelectMushafCompleted(value: boolean) {
      store.onboardingSelectMushafCompleted = value
    },
    setSelectedPage(value: number) {
      store.selectedPage = value
    },
    setSelectedVerse(value: number) {
      store.selectedVerses = [value]
    },
    setSelectedVerses(value: number[]) {
      store.selectedVerses = value
    },
    setSelectedSurahAyah(surah: number, ayah: number) {
      store.selectedVerses = [Quran.getVerseNoByDuplet(surah, ayah, store.selectedMushaf)]
    },
    setLocale(newLocale: string) {
      store.locale = newLocale
      storage.saveString("locale", newLocale)
    },
  }))
  .actions((store) => ({
    setBookmarkVerse(verse: number) {
      store.bookmarks.push({
        verse,
        date: new Date(),
        mushaf: store.selectedMushaf,
      })
      showToast(translate("toasts.bookmarkAdded") as TxKeyPath, "success")
    },
    toggleFavoriteVerse(verse: number, setUnset?: boolean) {
      const alreadyExists = store.favoritesAyat.findIndex(
        (item) => item.verse === equivalentVerse(verse, item.mushaf, store.selectedMushaf),
      )
      if (alreadyExists !== -1 && setUnset === false) {
        store.favoritesAyat = store.favoritesAyat.filter(
          (item) => item.verse !== equivalentVerse(verse, item.mushaf, store.selectedMushaf),
        )
        showToast(translate("toasts.favoriteRemoved") as TxKeyPath, "success")
      } else if (setUnset !== false) {
        store.favoritesAyat.push({
          verse,
          date: new Date(),
          mushaf: store.selectedMushaf,
        })
        showToast(translate("toasts.favoriteAdded") as TxKeyPath, "success")
      }
    },
    deleteFavoriteAyah(verse: number) {
      store.favoritesAyat = store.favoritesAyat.filter(
        (item) => item.verse !== equivalentVerse(verse, item.mushaf, store.selectedMushaf),
      )
      showToast(translate("toasts.favoriteRemoved") as TxKeyPath, "success")
    },
    updateFavoriteAyahNote(verse: number, newNote: string) {
      const index = store.favoritesAyat.findIndex(
        (item) => item.verse === equivalentVerse(verse, item.mushaf, store.selectedMushaf),
      )
      if (index !== -1) {
        store.favoritesAyat[index].note = newNote
        showToast(translate("toasts.favoriteRemarkSaved") as TxKeyPath, "success")
      }
    },
  }))

export interface MushafStore extends Instance<typeof MushafStoreModel> {}
export interface MushafStoreSnapshot extends SnapshotOut<typeof MushafStoreModel> {}
