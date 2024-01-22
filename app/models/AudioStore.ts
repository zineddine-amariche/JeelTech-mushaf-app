import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AudioStoreModel = types
  .model("AnimationStore")
  .props({
    duration: types.optional(types.number, 0),
    isPlaying: types.optional(types.boolean, false),
    currentPosition: types.optional(types.number, 0),
  })
  .actions((store) => ({
    setDuration(value: number) {
      store.duration = value
      store.isPlaying = true
    },
    setIsPlaying(value: boolean) {
      store.isPlaying = value
    },
    setCurrentPosition(value: number) {
      store.currentPosition = value
    },
  }))

export interface AudioStore extends Instance<typeof AudioStoreModel> {}
export interface AudioStoreSnapshot extends SnapshotOut<typeof AudioStoreModel> {}
