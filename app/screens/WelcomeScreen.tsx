import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "../components"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { AppStackScreenProps } from "app/navigators"
import { getLocale } from "app/i18n"
import { useStores } from "app/models"

const welcomeLogo = require("../../assets/images/logo.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(_props) {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { navigation } = _props

  const [step, setStep] = useState(1)

  const {
    mushafStore: { setOnboardingCompleted },
  } = useStores()

  function goNext() {
    setOnboardingCompleted(true)
    navigation.navigate("Home")
  }

  const dir = getLocale() === "ar" ? "rtl" : "ltr"

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={$welcomeHeading}
          tx="welcomeScreen.appName"
          preset="heading"
        />
        <Text tx="welcomeScreen.shortDescription" preset="subheading" style={$welcomeSubheading} />
      </View>

      <View style={[{ flex: 1, backgroundColor: colors.surfaceSecondary }, $bottomContainerInsets]}>
        <View style={[$bottomContainer]}>
          {step === 1 && (
            <>
              <Text
                tx="welcomeScreen.description"
                size="md"
                style={[$description, { writingDirection: dir }]}
                adjustsFontSizeToFit={true}
              />
              <View style={$bottomButton}>
                <Button
                  testID="next-screen-button"
                  preset="filled"
                  tx="welcomeScreen.continue"
                  onPress={() => goNext()}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.surfacePrimary,
}

const $topContainer: ViewStyle = {
  flex: 2,
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

const $bottomContainer: ViewStyle = {
  flex: 1,
  gap: spacing.md,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  padding: spacing.lg,
  justifyContent: "space-around",
}

const $description: ViewStyle = {
  flex: 1,
}

const $bottomButton: ViewStyle = {
  flexDirection: "column",
  justifyContent: "flex-end",
  gap: spacing.xs,
}

const $welcomeLogo: ImageStyle = {
  height: 160,
  width: "100%",
  marginBottom: spacing.lg,
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.md,
  textAlign: "center",
}

const $welcomeSubheading: TextStyle = {
  textAlign: "center",
}
