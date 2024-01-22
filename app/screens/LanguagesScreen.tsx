import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { SideStackScreenProps } from "app/navigators"
import { useStores } from "app/models"
import { Pressable, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { Text } from "app/components"
import { colors, metrics, spacing } from "app/theme"
import { useSideHeader } from "app/utils/useSideHeader"
import restartApp from "app/utils/restartApp"
import { TxKeyPath, isRTL, translate } from "app/i18n"
import { logAnalyticsEvent } from "app/utils/handleAnalytics"

interface LanguagesScreenProps extends SideStackScreenProps<"Languages"> {}

const Languages = ["ar", "en", "fr"]

export const LanguagesScreen: FC<LanguagesScreenProps> = observer(function LanguagesScreen(_props) {
  useSideHeader({ titleTx: "menus.languages" })

  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])

  const {
    mushafStore: { locale, setLocale },
  } = useStores()
  const [selected, setSelected] = useState(null)
  const [notSelected, setNotSelected] = useState([])

  useEffect(() => {
    const currentLanguage = Languages.find((l) => l === locale)

    const notSelectedLanguages = Languages.filter((l) => l !== locale)

    setSelected(currentLanguage)
    setNotSelected(notSelectedLanguages)
  }, [locale])

  const changeLanguage = (language) => {
    setLocale(language)
    logAnalyticsEvent("language_selection", { language })
    restartApp()
  }
  return (
    <ScrollView style={$root}>
      <View style={[$container, $containerInsets]}>
        <Text
          size="sm"
          weight="light"
          tx={`languages.selectedLanguage`}
          style={{ textAlign: "left", color: colors.textPrimary, paddingBottom: spacing.xs }}
        ></Text>
        {selected && (
          <RenderCard
            language={selected}
            key={selected}
            setLocale={changeLanguage}
            isActive={true}
          />
        )}
        <Text
          size="sm"
          weight="light"
          tx={`languages.otherLanguage`}
          style={{ textAlign: "left", color: colors.textPrimary, paddingBottom: spacing.xs }}
        ></Text>
        <View style={{ flex: 1 }}>
          {notSelected.map((item) => (
            <RenderCard language={item} key={item} setLocale={changeLanguage} />
          ))}
        </View>
      </View>
    </ScrollView>
  )
})

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
        tx={`languages.${language}` as TxKeyPath}
        style={$textStyle}
        weight={language === "ar" && isRTL ? "light" : "medium"}
      />
      {!isActive && (
        <Text
          size="lg"
          tx={`(${translate(`languages.${language}`, { lng: language })})`}
          fontLang={language === "ar" ? "arabic" : "latin"}
          weight={language === "ar" && !isRTL ? "light" : "medium"}
          style={$textStyle}
        />
      )}
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
  textAlign: "left",
  color: colors.textPrimary,
  lineHeight: 24,
}
