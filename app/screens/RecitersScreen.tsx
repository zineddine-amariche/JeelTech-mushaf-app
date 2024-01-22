import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { SideStackScreenProps } from "app/navigators"
import { useStores } from "app/models"
import { ScrollView, TouchableOpacity, View, ViewStyle } from "react-native"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { Text } from "app/components"
import { Reciters } from "assets/db/reciters/reciters"
import { colors, metrics, spacing } from "app/theme"
import { useSideHeader } from "app/utils/useSideHeader"
import { closeDrawer } from "app/navigators/navigationUtilities"
import { useAudioContext } from "app/utils/useAudioPlayer"
import { TxKeyPath } from "app/i18n"
import { logAnalyticsEvent } from "app/utils/handleAnalytics"

interface RecitersScreenProps extends SideStackScreenProps<"Reciters"> {}

export const RecitersScreen: FC<RecitersScreenProps> = observer(function RecitersScreen(_props) {
  useSideHeader({ titleTx: "menus.reciters" })

  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])

  const {
    mushafStore: { selectedReciter, setSelectedReciter },
  } = useStores()
  const [selected, setSelected] = useState(null)
  const [notSelected, setNotSelected] = useState([])

  const { play } = useAudioContext()
  const [shouldPlayAfterSelection] = useState(_props.route.params?.shouldPlayAfterSelection)

  useEffect(() => {
    if (selectedReciter && shouldPlayAfterSelection) {
      setTimeout(() => {
        play()
      }, 1000)
    }
    const currentReciter = !selectedReciter
      ? null
      : Object.values(Reciters)
          .filter((m) => m.enabled)
          .find((m) => m.id === selectedReciter)

    const notSelectedReciters = Object.values(Reciters).filter(
      (m) => m.enabled && m.id !== selectedReciter,
    )

    setSelected(currentReciter)
    setNotSelected(notSelectedReciters)
  }, [selectedReciter])

  const onSelect = (reciterId) => {
    setSelectedReciter(reciterId)
    logAnalyticsEvent("reciter_selection", { reciter: reciterId })
    closeDrawer()
  }

  return (
    <ScrollView style={$root}>
      <View style={[$container, $containerInsets]}>
        {selected && (
          <>
            <Text
              size="sm"
              weight="medium"
              tx={`reciters.selectedReciter`}
              style={{ textAlign: "left", color: colors.textPrimary, paddingBottom: spacing.xs }}
            ></Text>
            <RenderCard reciter={selected} isActive={true} key={selected.id} onSelect={onSelect} />
          </>
        )}
        <Text
          size="sm"
          weight="medium"
          tx={`reciters.otherReciter`}
          style={{ textAlign: "left", color: colors.textPrimary, paddingBottom: spacing.xs }}
        ></Text>
        <View style={{ flex: 1 }}>
          {notSelected.map((item, index) => (
            <RenderCard reciter={item} key={item.id} onSelect={onSelect} />
          ))}
        </View>
      </View>
    </ScrollView>
  )
})

interface RenderCardProps {
  reciter: any
  isActive?: boolean
  onSelect: (reciterId: string) => void
}

const RenderCard: FC<RenderCardProps> = ({ reciter, isActive, onSelect }) => {
  return (
    <TouchableOpacity
      style={[$card, isActive ? $cardActive : $shadow]}
      onPress={() => {
        onSelect(reciter.id)
      }}
    >
      <Text
        size="lg"
        weight="bold"
        tx={`reciters.${reciter.id}.name` as TxKeyPath}
        style={{ textAlign: "left", color: colors.textBrandSecondary, lineHeight: 24 }}
      ></Text>
      <Text
        size="sm"
        tx={`reciters.${reciter.id}.riwaya` as TxKeyPath}
        style={{ textAlign: "left", color: colors.textPrimary }}
      ></Text>
      <Text
        size="sm"
        tx={`reciters.${reciter.id}.edition` as TxKeyPath}
        style={{ textAlign: "left", color: colors.textPrimary }}
      ></Text>
    </TouchableOpacity>
  )
}

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
