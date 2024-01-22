import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UIStoreModel } from "./UIStore"
import { MushafStoreModel } from "./MushafStore"
import { AudioStoreModel } from "./AudioStore"
import { DownloadStoreModel } from "./DownloadStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  uiStore: types.optional(UIStoreModel, {}),
  downloadStore: types.optional(DownloadStoreModel, {}),
  mushafStore: types.optional(MushafStoreModel, {}),
  audioStore: types.optional(AudioStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
