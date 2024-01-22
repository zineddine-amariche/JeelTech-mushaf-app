import React, { FC, useEffect, useState } from "react"
import { BackHandler, Keyboard, Platform, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { MediaControlBar, Screen } from "app/components"
import { colors, timing } from "app/theme"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"
import PagerViewMushaf from "app/components/PagerViewMushaf"
import { useStores } from "app/models"
import { useDrawerStatus } from "@react-navigation/drawer"
import DetailsSelectedAyahModal from "app/components/DetailsSelectedAyahModal"
import HomeHeader from "app/components/HomeHeader"
import { observer } from "mobx-react-lite"
import { Quran } from "app/quran-helpers/quranData"
import * as NavigationBar from "expo-navigation-bar"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { sideNavigate } from "app/navigators/navigationUtilities"
import { StatusBar } from "expo-status-bar"

interface HomeScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Home">> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen() {
  const [show, setShow] = useState(true)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])

  const {
    uiStore: { shadowModalShow, setAppNavigationBarsShown, setShadowModalShow, setDrawerIsOpen },
    mushafStore: {
      selectedVerse,
      selectedMushaf,
      selectedPage,
      setSelectedPage,
      onboardingSelectMushafCompleted,
      setOnboardingSelectMushafCompleted,
    },
  } = useStores()

  const isDrawerOpen = useDrawerStatus() === "open"

  useEffect(() => {
    Keyboard.dismiss()
    setDrawerIsOpen(isDrawerOpen)
  }, [isDrawerOpen])

  useEffect(() => {
    if (!onboardingSelectMushafCompleted) {
      setOnboardingSelectMushafCompleted(true)
      setTimeout(() => {
        sideNavigate("Masahif", { selection: false })
      }, 500)
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      sideNavigate()
      return true
    })
    return () => backHandler.remove()
  }, [])

  useEffect(() => {
    setAppNavigationBarsShown(show)
    if (Platform.OS === "android" && $containerInsets?.paddingBottom > 24) {
      if (show) {
        setTimeoutId(
          setTimeout(() => {
            NavigationBar.setBackgroundColorAsync(colors.dimTransparent)
            NavigationBar.setButtonStyleAsync("light")
          }, timing.visibility),
        )
      } else {
        clearTimeout(timeoutId!)
        NavigationBar.setBackgroundColorAsync("transparent")
        NavigationBar.setButtonStyleAsync("dark")
      }
    }
  }, [show])

  useEffect(() => {
    if (shadowModalShow) setShadowModalShow(false)
    const newPage = Quran.getPageByVerse(selectedVerse, selectedMushaf)
    if (newPage !== selectedPage) setSelectedPage(newPage)
  }, [selectedVerse, selectedMushaf])

  const gesture = Gesture.Tap().onEnd(() => {
    runOnJS(setShow)(!show)
  })

  return (
    <View style={$root}>
      <StatusBar translucent={true} />
      <View
        style={$container}
        onTouchStart={(e) => setShadowModalShow(false)}
        pointerEvents={"box-none"}
      >
        <HomeHeader show={show} />
        <GestureDetector gesture={gesture}>
          <View style={$container}>
            <PagerViewMushaf />
          </View>
        </GestureDetector>
        <MediaControlBar show={show} />
      </View>
      <DetailsSelectedAyahModal />
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}

const $container: ViewStyle = {
  height: "100%",
  width: "100%",
  backgroundColor: colors.surfaceSecondary,
}
