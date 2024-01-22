import React from "react"
import { TextStyle, TouchableOpacityProps, View, ViewStyle } from "react-native"
import { isRTL, translate } from "../i18n"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { Icon } from "./Icon"
import { Text, TextProps } from "./Text"
import { NavigationProp } from "@react-navigation/native"

export interface SideHeaderProps {
  title?: TextProps["text"]
  titleTx?: TextProps["tx"]
  titleTxOptions?: TextProps["txOptions"]
  onBackPress?: TouchableOpacityProps["onPress"]
  navigation?: NavigationProp<ReactNavigation.RootParamList>
  icon?: string
}

export function SideHeader(props: SideHeaderProps) {
  const { title, titleTx, titleTxOptions, onBackPress, navigation, icon } = props

  const $containerInsets = useSafeAreaInsetsStyle(["top"])

  const titleContent = titleTx ? translate(titleTx, titleTxOptions) : title

  return (
    <View style={[$container, $containerInsets]}>
      <View style={$wrapper}>
        <View style={$titleWrapperFlex} pointerEvents="none">
          <Text preset="title" text={titleContent} style={$title} />
        </View>
        <Icon
          size={30}
          icon={!!icon ? icon : navigation?.canGoBack() ? "menu" : "back"}
          color={colors.iconPrimary}
          onPress={onBackPress}
          containerStyle={[$actionIconContainer]}
          style={isRTL && !icon ? { transform: [{ rotate: "180deg" }] } : {}}
        />
      </View>
    </View>
  )
}

const $wrapper: ViewStyle = {
  height: 56,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $container: ViewStyle = {
  width: "100%",
  backgroundColor: colors.surfacePrimary,
}

const $title: TextStyle = {
  textAlign: "left",
}

const $actionIconContainer: ViewStyle = {
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  paddingHorizontal: spacing.md,
  zIndex: 2,
}

const $titleWrapperFlex: ViewStyle = {
  justifyContent: "center",
  flexGrow: 1,
  paddingHorizontal: spacing.md,
}
