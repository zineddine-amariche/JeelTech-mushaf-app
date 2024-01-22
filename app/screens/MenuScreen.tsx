import React, { FC } from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { SideStackScreenProps } from "app/navigators"
import { Icon, Text } from "app/components"
import { colors, metrics, spacing } from "app/theme"
import { TxKeyPath } from "app/i18n"
import { useSideHeader } from "app/utils/useSideHeader"

interface MenuScreenProps extends SideStackScreenProps<"Menu"> {}

const drawerList = [
  { name: "menus.index", icon: "index", navigateTo: "Index" },
  { name: "menus.masahif", icon: "mushaf", navigateTo: "Masahif" },
  { name: "menus.reciters", icon: "readers", navigateTo: "Reciters" },
  { name: "menus.tafaseer", icon: "books", navigateTo: "TafaseerDetails" },
  { name: "menus.tarajim", icon: "translation", navigateTo: "TarajimDetails" },
  { name: "menus.search", icon: "search", navigateTo: "Search" },
  { name: "menus.bookmarks", icon: "bookmarkOff", navigateTo: "Bookmarks" },
  { name: "menus.favorites", icon: "star", navigateTo: "Favorites" },
  { name: "menus.settings", icon: "cog", navigateTo: "Languages" },
  { name: "menus.about", icon: "about", navigateTo: "About" },
]

export const MenuScreen: FC<MenuScreenProps> = function MenuScreen(_props) {
  const { navigation } = _props

  useSideHeader({ titleTx: "menus.home" })

  return (
    <View style={$container}>
      {drawerList.map((item) => {
        return (
          <TouchableOpacity
            key={item.name}
            style={$itemContainer}
            onPress={() => navigation.navigate(item.navigateTo)}
          >
            <Icon size={30} icon={item.icon} color={colors.iconPrimary} />
            <Text tx={item.name as TxKeyPath} style={$itemText} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.md,
  flex: 1,
  backgroundColor: colors.surfaceSecondary,
  borderBottomRightRadius: metrics.roundedLarge,
}
const $itemContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 20,
}
const $itemText: TextStyle = {
  marginLeft: 20,
  fontSize: 18,
}
