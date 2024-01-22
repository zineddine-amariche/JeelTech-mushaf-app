import React, { ReactElement, useEffect } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"
import { translate } from "../i18n"
import { colors, metrics, spacing, timing } from "../theme"
import { ExtendedEdge, useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { Icon, IconTypes } from "./Icon"
import { Text, TextProps } from "./Text"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { useStores } from "app/models"
import { Quran } from "app/quran-helpers/quranData"
import { observer } from "mobx-react-lite"
import { getLocale } from "app/i18n/i18n"
import { sideNavigate } from "app/navigators/navigationUtilities"
import { TextImageBackground } from "./TextImageBackground"

export interface HomeHeaderProps {
  style?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  backgroundColor?: string
  safeAreaEdges?: ExtendedEdge[]
  show?: boolean
}

interface HeaderActionProps {
  backgroundColor?: string
  icon?: IconTypes
  iconColor?: string
  text?: TextProps["text"]
  tx?: TextProps["tx"]
  txOptions?: TextProps["txOptions"]
  onPress?: TouchableOpacityProps["onPress"]
  onLongPress?: TouchableOpacityProps["onLongPress"]
  ActionComponent?: ReactElement
}

const HomeHeader = observer((props: HomeHeaderProps) => {
  const {
    safeAreaEdges = ["top"],
    style: $styleOverride,
    containerStyle: $containerStyleOverride,
    show,
  } = props

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges)
  const renderBellowSafeArea = true

  useEffect(() => {
    if (isHeaderVisible === show) return
    setIsHeaderVisible(show)
    translateY.value = withTiming(
      isHeaderVisible ? -(spacing.xxxl + $containerInsets.paddingTop) : 0,
      {
        duration: timing.visibility,
      },
    )
    translateHeight.value = withTiming(
      isHeaderVisible
        ? renderBellowSafeArea
          ? $containerInsets.paddingTop
          : spacing.sm
        : spacing.xxs,
      {
        duration: timing.visibility,
      },
    )
  }, [show])

  const [isHeaderVisible, setIsHeaderVisible] = React.useState(true)
  const translateY = useSharedValue(0)
  const translateHeight = useSharedValue(spacing.xxs)

  const $containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const $extraHeightAnimatedStyle = useAnimatedStyle(() => ({ height: translateHeight.value }))

  const {
    mushafStore: {
      selectedPage,
      selectedMushaf,
      bookmark,
      setBookmarkVerse,
      pageDetails: {
        // TODO : get all suwar of page
        surahDetails: { name: surahName },
        juz,
        hizb,
        verseNo,
      },
    },
  } = useStores()

  const handleBookmark = () => {
    if (Quran.getPageByVerse(bookmark?.verse ?? 1, selectedMushaf) !== selectedPage)
      setBookmarkVerse(Quran.getVerseNoByPage(selectedPage, selectedMushaf))
    else {
      sideNavigate("Bookmarks")
    }
  }

  return (
    <Animated.View style={[$container, $containerStyleOverride, $containerAnimatedStyle]}>
      <View
        style={[
          $wrapper,
          {
            paddingTop: $containerInsets.paddingTop,
            height: spacing.xxxl + $containerInsets.paddingTop,
          },
          $styleOverride,
        ]}
      >
        <HeaderAction
          icon={"menu"}
          iconColor={colors.iconPrimary}
          onPress={() => {
            sideNavigate()
          }}
          onLongPress={() => {
            sideNavigate("Menu")
          }}
        />
        <View style={$actionGroup}>
          <HeaderAction
            icon={"search"}
            iconColor={colors.iconPrimary}
            onPress={() => sideNavigate("Search")}
          />
          {verseNo > 0 && (
            <HeaderAction
              icon={
                Quran.getPageByVerse(bookmark?.verse ?? 1, selectedMushaf) === selectedPage
                  ? "bookmarkOn"
                  : "bookmarkOff"
              }
              iconColor={colors.iconPrimary}
              onPress={handleBookmark}
              onLongPress={() => {
                sideNavigate("Bookmarks")
              }}
            />
          )}
        </View>
      </View>
      <Animated.View style={[$extraHeight, $extraHeightAnimatedStyle]}></Animated.View>
      <View style={$topInfo}>
        <TextImageBackground
          texts={[
            translate("quran.surah", {
              surah: surahName?.[getLocale()] ?? surahName.ar,
            }),
          ]}
        />
        <TextImageBackground
          texts={[translate("quran.hizb", { hizb }), translate("quran.juz", { juz })]}
        />
      </View>
    </Animated.View>
  )
})

function HeaderAction(props: HeaderActionProps) {
  const {
    backgroundColor,
    icon,
    text,
    tx,
    txOptions,
    onPress,
    onLongPress,
    ActionComponent,
    iconColor,
  } = props

  const content = tx ? translate(tx, txOptions) : text

  if (ActionComponent) return ActionComponent

  if (content) {
    return (
      <TouchableOpacity
        style={[$actionTextContainer, { backgroundColor }]}
        onPress={onPress}
        disabled={!onPress}
        onLongPress={onLongPress}
        activeOpacity={0.8}
      >
        <Text weight="medium" size="md" text={content} style={$actionText} />
      </TouchableOpacity>
    )
  }

  if (icon) {
    return (
      <Icon
        size={30}
        icon={icon}
        color={iconColor}
        onPress={onPress}
        onLongPress={onLongPress}
        containerStyle={[$actionIconContainer, { backgroundColor }]}
      />
    )
  }

  return <View style={[$actionFillerContainer, { backgroundColor }]} />
}

const $wrapper: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.surfacePrimary,
  borderBottomLeftRadius: metrics.roundedLarge,
  borderBottomRightRadius: metrics.roundedLarge,
  paddingHorizontal: spacing.md,
}

const $container: ViewStyle = {
  position: "absolute",
  width: "100%",
  zIndex: 1,
}

const $extraHeight: ViewStyle = {
  width: "100%",
}

const $topInfo: ViewStyle = {
  width: "100%",
  height: spacing.xl,
  justifyContent: "space-between",
  flexDirection: "row",
  paddingHorizontal: spacing.md,
  alignItems: "center",
}

const $actionTextContainer: ViewStyle = {
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  zIndex: 2,
}

const $actionText: TextStyle = {
  color: colors.tint,
}

const $actionIconContainer: ViewStyle = {
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  zIndex: 2,
}

const $actionFillerContainer: ViewStyle = {
  width: 16,
}

const $actionGroup: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  height: "100%",
  gap: 10,
}

export default HomeHeader
