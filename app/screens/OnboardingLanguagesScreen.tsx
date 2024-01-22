import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { SideStackScreenProps } from "app/navigators"
import { useStores } from "app/models"
import { Pressable, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { Text } from "app/components"
import { colors, metrics, spacing } from "app/theme"
import restartApp from "app/utils/restartApp"
import { translate } from "app/i18n"
import { logAnalyticsEvent } from "app/utils/handleAnalytics"
import i18n from "app/i18n/i18n"
import { navigate } from "app/navigators/navigationUtilities"

interface OnboardingLanguagesScreenProps extends SideStackScreenProps<"Languages"> {}

const Languages = ["ar", "en", "fr"]

export const OnboardingLanguagesScreen: FC<OnboardingLanguagesScreenProps> = observer(
  function OnboardingLanguagesScreen(_props) {
    const $containerInsets = useSafeAreaInsetsStyle(["bottom"])

    const {
      mushafStore: { setLocale },
    } = useStores()

    const changeLanguage = (language) => {
      setLocale(language)
      logAnalyticsEvent("language_selection", { language })
      if (i18n.language.split("-")[0] !== language) {
        restartApp()
      } else {
        navigate("Welcome")
      }
    }
    return (
      <ScrollView
        style={$root}
        contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <View style={[$container, $containerInsets]}>
          {Languages.map((item) => (
            <RenderCard language={item} key={item} setLocale={changeLanguage} />
          ))}
        </View>
      </ScrollView>
    )
  },
)

type RenderCardProps = {
  language: string
  isActive?: boolean
  setLocale: (lang: string) => void
  key: string
}

const RenderCard: FC<RenderCardProps> = observer(({ language, isActive, setLocale }) => {
  return (
    <Pressable
      style={[$card, isActive ? $cardActive : $shadow]}
      disabled={isActive}
      onPress={() => setLocale(language)}
    >
      <Text
        size="lg"
        weight={language === "ar" ? "light" : "medium"}
        tx={`${translate(`languages.${language}`, { lng: language })}`}
        fontLang={language === "ar" ? "arabic" : "latin"}
        style={$textStyle}
      />
    </Pressable>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.surfaceSecondary,
}

const $container: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
}

const $card: ViewStyle = {
  borderColor: colors.transparent,
  borderWidth: 2,
  paddingHorizontal: spacing.md - spacing.xxxs,
  paddingVertical: spacing.xs,
  borderRadius: metrics.roundedMedium,
  marginBottom: spacing.md,
  backgroundColor: colors.white,
  flexDirection: "row",
  gap: spacing.xxs,
}

const $cardActive: ViewStyle = {
  borderColor: colors.surfaceBrand,
}

const $shadow: ViewStyle = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 2,
  elevation: 2,
}
const $textStyle: TextStyle = {
  textAlign: "center",
  color: colors.textPrimary,
  lineHeight: 24,
  width: "100%",
}
