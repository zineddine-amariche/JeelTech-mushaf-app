import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const UIStoreModel = types
  .model("UIStore")
  .props({
    appNavigationBarsShown: types.optional(types.boolean, false),
    drawerIsOpen: types.maybe(types.boolean),
    menuAyahViewIsOpen: types.optional(types.boolean, true),
    shadowModalShow: types.optional(types.boolean, false),
    shadowModalPosition: types.maybe(
      types.model({
        top: types.number,
        bottom: types.number,
        left: types.number,
        right: types.number,
      }),
    ),
  })
  .actions((store) => ({
    setAppNavigationBarsShown(value: boolean) {
      store.appNavigationBarsShown = value
    },
    setDrawerIsOpen(value?: boolean) {
      store.drawerIsOpen = value
    },
    setMenuAyahViewIsOpen(value: boolean) {
      store.menuAyahViewIsOpen = value
    },
  }))
  .actions((store) => ({
    setShadowModalShow(value: boolean) {
      store.shadowModalShow = value
    },
    setShadowModalPosition(value: any) {
      store.shadowModalPosition = value
    },
  }))

export interface UIStore extends Instance<typeof UIStoreModel> {}
export interface UIStoreSnapshot extends SnapshotOut<typeof UIStoreModel> {}
