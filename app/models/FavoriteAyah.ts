import { Mushaf } from "app/quran-helpers/quranData"
import { types } from "mobx-state-tree"

export const FavoriteAyahModel = types.model("MushafStore").props({
  verse: types.number,
  mushaf: types.frozen<Mushaf>(),
  date: types.Date,
  note: types.maybeNull(types.string),
})
