import React, { useEffect } from "react"
import { ImageStyle, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { colors, metrics, spacing, timing } from "../theme"
import { ExtendedEdge, useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { Icon } from "./Icon"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { isRTL, translate } from "app/i18n"
import { useAudioContext } from "app/utils/useAudioPlayer"
import { sideNavigate } from "app/navigators/navigationUtilities"
import { TextImageBackground } from "./TextImageBackground"

export interface MediaControlBarProps {
  style?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  backgroundColor?: string
  safeAreaEdges?: ExtendedEdge[]
  show?: boolean
}
export const MediaControlBar = observer((props: MediaControlBarProps) => {
  const {
    backgroundColor = colors.surfacePrimary,
    safeAreaEdges = ["bottom"],
    style: $styleOverride,
    containerStyle: $containerStyleOverride,
    show,
  } = props

  const {
    mushafStore: { selectedPrintPage, pageDetails },
  } = useStores()

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges)
  const renderAboveSafeArea = true

  const [isVisible, setIsVisible] = React.useState(true)
  const [localPage, setLocalPage] = React.useState("1")

  useEffect(() => {
    if (isVisible === show) return
    setIsVisible(show)
    translateY.value = withTiming(isVisible ? spacing.xxxl + $containerInsets.paddingBottom : 0, {
      duration: timing.visibility,
    })
    translateHeight.value = withTiming(
      isVisible ? (renderAboveSafeArea ? $containerInsets.paddingBottom : spacing.sm) : spacing.xxs,
      {
        duration: timing.visibility,
      },
    )
  }, [show])

  const translateY = useSharedValue(0)
  const translateHeight = useSharedValue(spacing.xxs)
  const $containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })
  const $extraHeightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: translateHeight.value,
    }
  })

  useEffect(() => {
    if (localPage === selectedPrintPage) return
    setLocalPage(selectedPrintPage)
  }, [selectedPrintPage])

  // audio Track player //
  const { isPlaying, play, pause, nextTrack, previousTrack } = useAudioContext()

  return (
    <Animated.View style={[$container, $containerStyleOverride, $containerAnimatedStyle]}>
      <View style={$bottomInfo}>
        <TextImageBackground texts={[localPage + ""]} />
        {pageDetails.hasNewEighthNo && (
          <TextImageBackground texts={[translate(`quran.eighth_${pageDetails.eighth}`)]} />
        )}
      </View>
      <Animated.View style={[$extraHeight, $extraHeightAnimatedStyle]}></Animated.View>
      <View
        style={[
          $wrapper,
          {
            flexDirection: isRTL ? "row-reverse" : "row",
            paddingBottom: $containerInsets.paddingBottom,
            height: spacing.xxxl + $containerInsets.paddingBottom,
          },
          $styleOverride,
        ]}
      >
        <Icon
          size={30}
          icon={"repeat"}
          color={colors.iconPrimary}
          containerStyle={[$actionIconContainer, { backgroundColor }, { opacity: 0 }]}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: spacing.md,
            flexDirection: isRTL ? "row-reverse" : "row",
            gap: spacing.xl,
          }}
        >
          <Icon
            size={30}
            icon={"next"}
            color={colors.iconPrimary}
            containerStyle={[$actionIconContainer, { backgroundColor }]}
            onPress={nextTrack}
            style={$rotate}
          />
          <Icon
            size={30}
            icon={isPlaying ? "pause" : "play"}
            color={colors.iconPrimary}
            containerStyle={[$actionIconContainer, { backgroundColor }]}
            onPress={() => (isPlaying ? pause() : play())}
          />
          <Icon
            size={30}
            icon={"prev"}
            color={colors.iconPrimary}
            containerStyle={[$actionIconContainer, { backgroundColor }]}
            onPress={previousTrack}
            style={$rotate}
          />
        </View>
        <Icon
          size={30}
          icon={"threedots"}
          color={colors.iconPrimary}
          containerStyle={[$actionIconContainer, { backgroundColor }]}
          style={{ transform: [{ rotate: "90deg" }] }}
          onPress={() => sideNavigate("Reciters")}
        />
      </View>
    </Animated.View>
  )
})

const $wrapper: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.surfacePrimary,
  borderTopLeftRadius: metrics.roundedLarge,
  borderTopRightRadius: metrics.roundedLarge,
  paddingHorizontal: spacing.md,
}

const $container: ViewStyle = {
  width: "100%",
  position: "absolute",
  bottom: 0,
  zIndex: 1,
}

const $extraHeight: ViewStyle = {
  width: "100%",
}

const $bottomInfo: ViewStyle = {
  width: "100%",
  height: spacing.xl,
  justifyContent: "space-between",
  flexDirection: "row",
  paddingHorizontal: spacing.md,
  alignItems: "center",
}

const $actionIconContainer: ViewStyle = {
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
}

let $rotate: ImageStyle = { transform: [{ rotate: "180deg" }] }
