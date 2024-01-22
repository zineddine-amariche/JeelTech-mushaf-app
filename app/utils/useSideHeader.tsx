import React, { useLayoutEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { SideHeader, SideHeaderProps } from "../components"
import { closeDrawer } from "app/navigators/navigationUtilities"

export function useSideHeader(
  headerProps: SideHeaderProps,
  deps: Parameters<typeof useLayoutEffect>[1] = [],
) {
  const navigation = useNavigation()

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <SideHeader
          onBackPress={() => {
            navigation.canGoBack() ? navigation.navigate("Menu") : closeDrawer()
          }}
          navigation={navigation}
          {...headerProps}
        />
      ),
    })
  }, [...deps, navigation])
}
