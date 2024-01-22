import { translate } from "app/i18n"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

const DownloadItemModel = types
  .model("DownloadItem")
  .props({
    id: types.string,
    type: types.string,
    status: types.optional(types.enumeration(["idle", "pending", "done"]), "pending"),
    total: types.optional(types.number, 0),
    progress: types.optional(types.number, 0),
    title: types.optional(types.string, ""),
    error: types.maybeNull(types.string),
  })
  .views((store) => ({
    get progressHuman() {
      return `${store.progress}/${store.total}`
    },
    get progressPercent(): number {
      return (store.progress / store.total) * 100
    },
    get statusText() {
      if (store.error) {
        return translate("download.canceledDownloadingMushafImages", {
          mushaf: translate(`masahif.${store.title}.name`),
        })
      }
      switch (store.status) {
        case "pending":
          return translate("download.downloadingMushafImages", {
            mushaf: translate(`masahif.${store.title}.name`),
          })
        case "done":
          return translate("download.finishedDownloadingMushafImages", {
            mushaf: translate(`masahif.${store.title}.name`),
          })
      }

      return ""
    },
  }))
  .actions((store) => ({
    start() {
      store.error = null
      store.status = "pending"
    },
    finish() {
      store.error = null
      store.status = "done"
    },
    cancel(value: string | null = null) {
      store.error = value
      store.status = "idle"
    },
    dismissError() {
      store.error = null
    },
  }))
  .actions((store) => ({
    setTotal(value: number) {
      store.total = value
    },
    setProgress(value: number) {
      store.progress = value
    },
    setTitle(value: string) {
      store.title = value
    },
  }))

export const DownloadStoreModel = types
  .model("DownloadStore")
  .props({
    downloads: types.optional(types.array(DownloadItemModel), []),
  })
  .views((store) => ({
    get pendingDownloads() {
      return store.downloads.filter((download) => download.status === "pending")
    },
  }))
  .actions((store) => ({
    addDownload(download: Instance<typeof DownloadItemModel>) {
      if (!store.downloads.find((d) => d.id === download.id)) {
        store.downloads.push(download)
      }
    },
    getDownload(id: string) {
      return store.downloads.find((download) => download.id === id)
    },
  }))

export interface DownloadStore extends Instance<typeof DownloadStoreModel> {}
export interface DownloadStoreSnapshot extends SnapshotOut<typeof DownloadStoreModel> {}
